using UnityEngine;
using UnityEngine.InputSystem;
using System;

namespace GodVsDevil.Combat
{
    /// <summary>
    /// Sistema de control de luchador con soporte para múltiples dispositivos
    /// Autor: Fabrizio Raimondi Imfeld
    /// © 2024-2025 Todos los derechos reservados
    /// </summary>
    [RequireComponent(typeof(Rigidbody2D))]
    [RequireComponent(typeof(Animator))]
    public class FighterController : MonoBehaviour
    {
        #region Serialized Fields
        [Header("Configuración de Combate")]
        [SerializeField] private float moveSpeed = 5f;
        [SerializeField] private float jumpForce = 12f;
        [SerializeField] private float maxEnergy = 100f;
        [SerializeField] private float energyChargeRate = 15f;
        
        [Header("Estadísticas de Combate")]
        [SerializeField] private float maxHealth = 100f;
        [SerializeField] private float punchDamage = 10f;
        [SerializeField] private float kickDamage = 15f;
        [SerializeField] private float grabDamage = 20f;
        [SerializeField] private float ultimateDamage = 50f;
        
        [Header("Hitboxes")]
        [SerializeField] private Transform punchHitbox;
        [SerializeField] private Transform kickHitbox;
        [SerializeField] private Transform grabHitbox;
        [SerializeField] private float hitboxRadius = 0.5f;
        [SerializeField] private LayerMask enemyLayer;
        
        [Header("Efectos Visuales")]
        [SerializeField] private ParticleSystem chargeEffect;
        [SerializeField] private ParticleSystem ultimateEffect;
        #endregion

        #region Private Variables
        private Rigidbody2D rb;
        private Animator animator;
        private PlayerInput playerInput;
        
        // Estados del jugador
        private float currentHealth;
        private float currentEnergy;
        private bool isBlocking;
        private bool isCharging;
        private bool isGrounded;
        private bool facingRight = true;
        
        // Referencia al oponente
        private FighterController opponent;
        
        // Inputs
        private Vector2 moveInput;
        private bool punchPressed;
        private bool kickPressed;
        private bool grabPressed;
        private bool blockHeld;
        private bool chargeHeld;
        private bool ultimatePressed;
        
        // Sistema de combos
        private float lastAttackTime;
        private int comboCount;
        private const float comboWindow = 0.8f;
        #endregion

        #region Events
        public event Action<float> OnHealthChanged;
        public event Action<float> OnEnergyChanged;
        public event Action OnDeath;
        #endregion

        #region Unity Lifecycle
        private void Awake()
        {
            rb = GetComponent<Rigidbody2D>();
            animator = GetComponent<Animator>();
            playerInput = GetComponent<PlayerInput>();
            
            currentHealth = maxHealth;
            currentEnergy = 0;
        }

        private void Update()
        {
            HandleGroundCheck();
            HandleBlocking();
            HandleEnergyCharge();
            HandleFlip();
            HandleAnimations();
        }

        private void FixedUpdate()
        {
            HandleMovement();
        }
        #endregion

        #region Input Callbacks (New Input System)
        public void OnMove(InputValue value)
        {
            moveInput = value.Get<Vector2>();
        }

        public void OnPunch(InputValue value)
        {
            if (value.isPressed && !isBlocking)
            {
                PerformPunch();
            }
        }

        public void OnKick(InputValue value)
        {
            if (value.isPressed && !isBlocking)
            {
                PerformKick();
            }
        }

        public void OnGrab(InputValue value)
        {
            if (value.isPressed && !isBlocking)
            {
                PerformGrab();
            }
        }

        public void OnBlock(InputValue value)
        {
            blockHeld = value.isPressed;
        }

        public void OnChargeEnergy(InputValue value)
        {
            chargeHeld = value.isPressed;
        }

        public void OnUltimate(InputValue value)
        {
            if (value.isPressed && currentEnergy >= maxEnergy)
            {
                PerformUltimate();
            }
        }
        #endregion

        #region Movement
        private void HandleMovement()
        {
            if (isBlocking || isCharging) return;

            // Movimiento horizontal
            float targetVelocityX = moveInput.x * moveSpeed;
            rb.velocity = new Vector2(targetVelocityX, rb.velocity.y);

            // Salto
            if (moveInput.y > 0.5f && isGrounded)
            {
                rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
                animator.SetTrigger("Jump");
            }
        }

        private void HandleFlip()
        {
            if (opponent == null) return;

            bool shouldFaceRight = opponent.transform.position.x > transform.position.x;
            if (shouldFaceRight != facingRight)
            {
                facingRight = shouldFaceRight;
                transform.localScale = new Vector3(facingRight ? 1 : -1, 1, 1);
            }
        }

        private void HandleGroundCheck()
        {
            isGrounded = Physics2D.Raycast(transform.position, Vector2.down, 1.1f, LayerMask.GetMask("Ground"));
        }
        #endregion

        #region Combat Actions
        private void PerformPunch()
        {
            animator.SetTrigger("Punch");
            CheckCombo();
            
            Collider2D[] hits = Physics2D.OverlapCircleAll(punchHitbox.position, hitboxRadius, enemyLayer);
            foreach (var hit in hits)
            {
                FighterController enemy = hit.GetComponent<FighterController>();
                if (enemy != null)
                {
                    enemy.TakeDamage(punchDamage * (1 + comboCount * 0.2f));
                    AddEnergy(5f);
                }
            }
        }

        private void PerformKick()
        {
            animator.SetTrigger("Kick");
            CheckCombo();
            
            Collider2D[] hits = Physics2D.OverlapCircleAll(kickHitbox.position, hitboxRadius, enemyLayer);
            foreach (var hit in hits)
            {
                FighterController enemy = hit.GetComponent<FighterController>();
                if (enemy != null)
                {
                    enemy.TakeDamage(kickDamage * (1 + comboCount * 0.2f));
                    AddEnergy(8f);
                }
            }
        }

        private void PerformGrab()
        {
            animator.SetTrigger("Grab");
            
            Collider2D[] hits = Physics2D.OverlapCircleAll(grabHitbox.position, hitboxRadius, enemyLayer);
            foreach (var hit in hits)
            {
                FighterController enemy = hit.GetComponent<FighterController>();
                if (enemy != null && !enemy.isBlocking)
                {
                    enemy.TakeDamage(grabDamage);
                    AddEnergy(10f);
                    comboCount = 0; // El agarre rompe combos
                }
            }
        }

        private void PerformUltimate()
        {
            if (currentEnergy < maxEnergy) return;

            currentEnergy = 0;
            OnEnergyChanged?.Invoke(currentEnergy);
            
            animator.SetTrigger("Ultimate");
            
            if (ultimateEffect != null)
                ultimateEffect.Play();

            // El ultimate golpea en área grande
            Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, 5f, enemyLayer);
            foreach (var hit in hits)
            {
                FighterController enemy = hit.GetComponent<FighterController>();
                if (enemy != null)
                {
                    enemy.TakeDamage(ultimateDamage);
                }
            }
        }

        private void CheckCombo()
        {
            if (Time.time - lastAttackTime < comboWindow)
            {
                comboCount++;
            }
            else
            {
                comboCount = 0;
            }
            lastAttackTime = Time.time;
        }
        #endregion

        #region Blocking & Energy
        private void HandleBlocking()
        {
            // Bloqueo se activa manteniendo hacia atrás (relativo al oponente)
            bool backwardInput = (facingRight && moveInput.x < -0.3f) || (!facingRight && moveInput.x > 0.3f);
            isBlocking = blockHeld || backwardInput;
            
            animator.SetBool("IsBlocking", isBlocking);
        }

        private void HandleEnergyCharge()
        {
            isCharging = chargeHeld && isGrounded;
            
            if (isCharging)
            {
                currentEnergy = Mathf.Min(currentEnergy + energyChargeRate * Time.deltaTime, maxEnergy);
                OnEnergyChanged?.Invoke(currentEnergy);
                
                animator.SetBool("IsCharging", true);
                
                if (chargeEffect != null && !chargeEffect.isPlaying)
                    chargeEffect.Play();
            }
            else
            {
                animator.SetBool("IsCharging", false);
                
                if (chargeEffect != null && chargeEffect.isPlaying)
                    chargeEffect.Stop();
            }
        }

        private void AddEnergy(float amount)
        {
            currentEnergy = Mathf.Min(currentEnergy + amount, maxEnergy);
            OnEnergyChanged?.Invoke(currentEnergy);
        }
        #endregion

        #region Damage System
        public void TakeDamage(float damage)
        {
            if (isBlocking)
            {
                damage *= 0.3f; // Bloqueo reduce daño en 70%
                animator.SetTrigger("BlockHit");
            }
            else
            {
                animator.SetTrigger("Hit");
            }

            currentHealth = Mathf.Max(currentHealth - damage, 0);
            OnHealthChanged?.Invoke(currentHealth);

            if (currentHealth <= 0)
            {
                Die();
            }
        }

        private void Die()
        {
            animator.SetTrigger("Death");
            enabled = false;
            OnDeath?.Invoke();
        }
        #endregion

        #region Animations
        private void HandleAnimations()
        {
            animator.SetFloat("Speed", Mathf.Abs(rb.velocity.x));
            animator.SetBool("IsGrounded", isGrounded);
            animator.SetFloat("VelocityY", rb.velocity.y);
        }
        #endregion

        #region Public Methods
        public void SetOpponent(FighterController other)
        {
            opponent = other;
        }

        public float GetHealthPercentage() => currentHealth / maxHealth;
        public float GetEnergyPercentage() => currentEnergy / maxEnergy;
        #endregion

        #region Debug
        private void OnDrawGizmosSelected()
        {
            if (punchHitbox != null)
            {
                Gizmos.color = Color.red;
                Gizmos.DrawWireSphere(punchHitbox.position, hitboxRadius);
            }
            if (kickHitbox != null)
            {
                Gizmos.color = Color.blue;
                Gizmos.DrawWireSphere(kickHitbox.position, hitboxRadius);
            }
            if (grabHitbox != null)
            {
                Gizmos.color = Color.yellow;
                Gizmos.DrawWireSphere(grabHitbox.position, hitboxRadius);
            }
        }
        #endregion
    }
}
