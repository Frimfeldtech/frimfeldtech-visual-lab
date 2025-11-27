import { InputHandler } from './input.js';
import { CHARACTERS } from './characters.js';

// ====== FIGHTER CLASS ======
class Fighter {
    constructor(data, x, y, facing, isAI) {
        this.data = data;
        this.x = x;
        this.y = y;
        this.facing = facing;
        this.isAI = isAI;
        
        this.hp = 100;
        this.maxHp = 100;
        this.energy = 0;
        this.maxEnergy = 100;
        this.damageMult = 1;
        
        this.vx = 0;
        this.vy = 0;
        this.grounded = false;
        this.gravity = 0.6;
        this.jumpForce = -15;
        this.speed = 4;
        
        this.isBlocking = false;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackType = '';
        
        this.width = 60;
        this.height = 100;
        this.groundY = 500;
    }
    
    move(direction) {
        if (this.isAttacking) return;
        this.vx = direction * this.speed;
        if (direction !== 0) {
            this.facing = direction > 0 ? 'right' : 'left';
        }
    }
    
    jump() {
        if (this.grounded && !this.isAttacking) {
            this.vy = this.jumpForce;
            this.grounded = false;
        }
    }
    
    attack(type) {
        if (this.isAttacking || this.attackCooldown > 0) return;
        
        this.isAttacking = true;
        this.attackType = type;
        this.attackCooldown = 30; // frames
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 300);
    }
    
    useChargePower(button) {
        // Charge energy or ultimate
        if (button === 'lb' || button === 'rb') {
            this.energy = Math.min(this.energy + 1, this.maxEnergy);
        }
        
        if (button === 'lt' && button === 'rt') {
            if (this.energy >= this.maxEnergy) {
                // Ultimate attack!
                this.attack('ultimate');
                this.energy = 0;
            }
        }
    }
    
    takeDamage(amount) {
        if (this.isBlocking) {
            amount *= 0.3; // 70% reduction
        }
        this.hp = Math.max(0, this.hp - amount);
    }
    
    update(dt, opponent) {
        // Gravity
        if (!this.grounded) {
            this.vy += this.gravity;
        }
        
        this.y += this.vy;
        this.x += this.vx;
        
        // Ground check
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
            this.grounded = true;
        }
        
        // Boundary
        this.x = Math.max(50, Math.min(1180, this.x));
        
        // Attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
            
            // Check hit
            if (this.attackCooldown === 20 && this.isAttacking) {
                this.checkHit(opponent);
            }
        }
        
        // Decay velocity
        this.vx *= 0.8;
    }
    
    checkHit(opponent) {
        const range = this.facing === 'right' ? 80 : -80;
        const hitX = this.x + range;
        
        if (Math.abs(hitX - opponent.x) < 70 && Math.abs(this.y - opponent.y) < 100) {
            let damage = 10;
            if (this.attackType === 'punch') damage = 10;
            if (this.attackType === 'kick') damage = 15;
            if (this.attackType === 'special') damage = 20;
            if (this.attackType === 'ultimate') damage = 50;
            
            opponent.takeDamage(damage * this.damageMult);
            this.energy = Math.min(this.energy + 5, this.maxEnergy);
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Body
        ctx.fillStyle = this.data.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Blocking indicator
        if (this.isBlocking) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
        }
        
        // Attack indicator
        if (this.isAttacking) {
            const range = this.facing === 'right' ? 80 : -80;
            ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
            ctx.fillRect(this.x + range, this.y + 30, 40, 40);
        }
        
        // Name tag
        ctx.fillStyle = '#fff';
        ctx.font = '16px Cinzel';
        ctx.textAlign = 'center';
        ctx.fillText(this.data.name, this.x + this.width/2, this.y - 10);
        
        ctx.restore();
    }
}

// ====== PROJECTILE CLASS ======
class Projectile {
    constructor(x, y, vx, color, owner) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.color = color;
        this.owner = owner;
        this.width = 40;
        this.height = 20;
        this.active = true;
    }
    
    update(opponent) {
        this.x += this.vx;
        
        // Collision
        if (
            this.x < opponent.x + opponent.width &&
            this.x + this.width > opponent.x &&
            this.y < opponent.y + opponent.height &&
            this.y + this.height > opponent.y
        ) {
            opponent.takeDamage(10 * (this.owner.damageMult || 1));
            this.active = false;
        }
        
        // Out of bounds
        if (this.x < -100 || this.x > 1380) this.active = false;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

// ====== GAME CLASS ======
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        this.input = new InputHandler();
        this.state = 'MENU';
        
        this.p1 = null;
        this.p2 = null;
        this.timer = 99;
        this.lastTime = 0;
        
        this.menuSelection = 0;
        this.charSelection = { side: 'angels', index: 0, confirmed: false };
        this.storyStarted = false;
        this.gameMode = 'arcade';
        
        this.projectiles = [];
        
        this.setupEventListeners();
        this.loop(0);
    }
    
    resize() {
        this.canvas.width = 1280;
        this.canvas.height = 720;
    }
    
    setupEventListeners() {
        // Menu buttons
        document.querySelectorAll('.menu-btn').forEach((btn) => {
            btn.addEventListener('click', () => this.handleMenuSelect(btn.dataset.action));
        });
        
        // Character grid
        const angelGrid = document.getElementById('angel-grid');
        const demonGrid = document.getElementById('demon-grid');
        
        CHARACTERS.ANGELS.forEach((char, i) => {
            const div = document.createElement('div');
            div.className = 'char-slot';
            div.style.backgroundImage = "url('assets/angel_portrait.png')";
            div.innerHTML = `<span style="font-size: 10px; color: #fff;">${char.name}</span>`;
            div.onclick = () => this.selectChar('angels', i);
            div.onmouseenter = () => this.previewChar('angels', i);
            angelGrid.appendChild(div);
        });
        
        CHARACTERS.DEMONS.forEach((char, i) => {
            const div = document.createElement('div');
            div.className = 'char-slot';
            div.style.backgroundImage = "url('assets/demon_portrait.png')";
            div.innerHTML = `<span style="font-size: 10px; color: #fff;">${char.name}</span>`;
            div.onclick = () => this.selectChar('demons', i);
            div.onmouseenter = () => this.previewChar('demons', i);
            demonGrid.appendChild(div);
        });
    }
    
    handleMenuSelect(action) {
        if (['story', 'arcade', 'versus', 'survival', 'infinite'].includes(action)) {
            this.gameMode = action;
            this.transitionTo('SELECT');
        } else if (action === 'back') {
            this.transitionTo('MENU');
        } else if (action === 'resume') {
            this.transitionTo('FIGHT');
        } else if (action === 'quit') {
            this.transitionTo('MENU');
        }
    }
    
    previewChar(side, index) {
        const char = CHARACTERS[side.toUpperCase()][index];
        document.getElementById('char-name').innerText = char.name;
        document.getElementById('char-desc').innerText = `${char.title}`;
        document.getElementById('char-desc').style.color = char.color;
        
        const preview = document.getElementById('char-preview');
        const imgUrl = side === 'angels' ? 'assets/angel_portrait.png' : 'assets/demon_portrait.png';
        preview.style.backgroundImage = `url('${imgUrl}')`;
        preview.style.borderColor = char.color;
    }
    
    selectChar(side, index) {
        this.charSelection.side = side;
        this.charSelection.index = index;
        this.previewChar(side, index);
        this.charSelection.confirmed = true;
        
        setTimeout(() => this.startGame(), 500);
    }
    
    transitionTo(newState) {
        this.state = newState;
        document.querySelectorAll('.menu-screen').forEach(el => el.classList.add('hidden'));
        document.getElementById('hud').classList.add('hidden');
        
        if (newState === 'MENU') {
            document.getElementById('main-menu').classList.remove('hidden');
        } else if (newState === 'SELECT') {
            document.getElementById('char-select').classList.remove('hidden');
        } else if (newState === 'FIGHT') {
            document.getElementById('hud').classList.remove('hidden');
        }
    }
    
    startGame() {
        const p1Char = CHARACTERS[this.charSelection.side.toUpperCase()][this.charSelection.index];
        
        // Determine opponent
        const enemySide = this.charSelection.side === 'angels' ? 'DEMONS' : 'ANGELS';
        const p2Char = CHARACTERS[enemySide][Math.floor(Math.random() * CHARACTERS[enemySide].length)];
        
        this.p1 = new Fighter(p1Char, 200, 500, 'right', false);
        this.p2 = new Fighter(p2Char, 1000, 500, 'left', true);
        
        this.projectiles = [];
        this.timer = 99;
        this.transitionTo('FIGHT');
        
        // Start timer
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.state !== 'FIGHT') return;
            
            this.timer--;
            document.getElementById('timer').innerText = this.timer;
            
            if (this.timer <= 0) {
                this.endGame(this.p1.hp > this.p2.hp);
            }
        }, 1000);
    }
    
    endGame(playerWon) {
        clearInterval(this.timerInterval);
        this.state = 'GAMEOVER';
        
        setTimeout(() => {
            if (playerWon) {
                alert('¡VICTORIA!\n\nPresiona OK para volver al menú');
            } else {
                alert('DERROTA\n\nPresiona OK para volver al menú');
            }
            this.transitionTo('MENU');
        }, 1000);
    }
    
    updateAI(ai, player) {
        // Simple AI
        const distance = Math.abs(ai.x - player.x);
        
        if (distance > 150) {
            // Move towards player
            ai.move(player.x > ai.x ? 1 : -1);
        } else {
            ai.move(0);
            
            // Attack randomly
            if (Math.random() < 0.02) {
                const attacks = ['punch', 'kick', 'special'];
                ai.attack(attacks[Math.floor(Math.random() * attacks.length)]);
            }
            
            // Block sometimes
            ai.isBlocking = Math.random() < 0.05;
        }
        
        // Random jump
        if (Math.random() < 0.01) {
            ai.jump();
        }
    }
    
    update(dt) {
        if (this.state === 'FIGHT') {
            // Player input
            if (!this.p1.isAI) {
                if (this.input.actions.p1.left) this.p1.move(-1);
                else if (this.input.actions.p1.right) this.p1.move(1);
                else this.p1.move(0);
                
                if (this.input.actions.p1.up) this.p1.jump();
                
                this.p1.isBlocking = this.input.actions.p1.block;
                
                if (this.input.actions.p1.punch) this.p1.attack('punch');
                if (this.input.actions.p1.kick) this.p1.attack('kick');
                if (this.input.actions.p1.special) this.p1.attack('special');
            }
            
            // AI
            if (this.p2.isAI) {
                this.updateAI(this.p2, this.p1);
            }
            
            this.p1.update(dt, this.p2);
            this.p2.update(dt, this.p1);
            
            // Projectiles
            this.projectiles.forEach(p => p.update(p.owner === this.p1 ? this.p2 : this.p1));
            this.projectiles = this.projectiles.filter(p => p.active);
            
            // HUD
            document.getElementById('p1-health').style.width = `${this.p1.hp}%`;
            document.getElementById('p2-health').style.width = `${this.p2.hp}%`;
            document.getElementById('p1-name').innerText = this.p1.data.name;
            document.getElementById('p2-name').innerText = this.p2.data.name;
            
            // Check win
            if (this.p1.hp <= 0 || this.p2.hp <= 0) {
                this.endGame(this.p2.hp <= 0);
            }
        }
    }
    
    draw() {
        // Clear
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, 1280, 720);
        
        // Ground
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 600, 1280, 120);
        
        // Grid lines
        this.ctx.strokeStyle = '#444';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 1280; i += 64) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, 720);
            this.ctx.stroke();
        }
        
        if (this.state === 'FIGHT') {
            this.p1.draw(this.ctx);
            this.p2.draw(this.ctx);
            this.projectiles.forEach(p => p.draw(this.ctx));
        }
    }
    
    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.input.update();
        this.update(dt);
        this.draw();
        
        requestAnimationFrame((t) => this.loop(t));
    }
}

// Start game
let game;
window.onload = () => {
    game = new Game();
};
