using UnityEngine;
using System.Collections;
using GodVsDevil.Combat;

namespace GodVsDevil.AI
{
    /// <summary>
    /// IA de Jefes Finales con patrones agresivos y fases dinámicas
    /// Autor: Fabrizio Raimondi Imfeld
    /// © 2024-2025 Todos los derechos reservados
    /// </summary>
    public enum BossType
    {
        Lucifer,    // Jefe de la ruta de los Ángeles
        Elohim      // Dios Supremo - Jefe de la ruta de los Demonios
    }

    public enum BossState
    {
        Idle,
        Aggressive,
        Defensive,
        UltimateAttack,
        Phase2
    }

    [RequireComponent(typeof(FighterController))]
    public class BossAI : MonoBehaviour
    {
        #region Serialized Fields
        [Header("Configuración del Jefe")]
        [SerializeField] private BossType bossType;
        [SerializeField] private float phase2HealthThreshold = 0.5f;
        [SerializeField] private float phase2SpeedMultiplier = 1.2f;
        
        [Header("Patrones de Ataque")]
        [SerializeField] private float aggressiveAttackInterval = 1.5f;
        [SerializeField] private float defensiveWaitTime = 2f;
        [SerializeField] private float inputReadingChance = 0.7f; // 70% de "leer" inputs del jugador
        
        [Header("Fase 2")]
        [SerializeField] private float phase2UltimateFrequency = 5f;
        [SerializeField] private ParticleSystem phase2TransitionEffect;
        
        [Header("Elohim Específico")]
        [SerializeField] private float elohimScale = 2.5f;
        [SerializeField] private float elohimProjectileInterval = 2f;
        [SerializeField] private GameObject divineProjectilePrefab;
        #endregion

        #region Private Variables
        private FighterController fighter;
        private FighterController player;
        private BossState currentState;
        
        private bool isInPhase2;
        private float nextAttackTime;
        private float nextUltimateTime;
        private float nextProjectileTime;
        
        // Input reading (hace trampa!)
        private Vector2 playerLastInput;
        private bool playerAboutToAttack;
        #endregion

        #region Unity Lifecycle
        private void Awake()
        {
            fighter = GetComponent<FighterController>();
            
            // Configuración específica por jefe
            if (bossType == BossType.Elohim)
            {
                transform.localScale = Vector3.one * elohimScale;
            }
        }

        private void Start()
        {
            player = FindObjectOfType<FighterController>();
            if (player == this.fighter)
            {
                // Buscar el otro fighter
                FighterController[] fighters = FindObjectsOfType<FighterController>();
                foreach (var f in fighters)
                {
                    if (f != this.fighter)
                    {
                        player = f;
                        break;
                    }
                }
            }

            fighter.OnHealthChanged += OnHealthChanged;
            currentState = BossState.Aggressive;
        }

        private void Update()
        {
            if (player == null) return;

            UpdateAIBehavior();
            
            if (bossType == BossType.Elohim && isInPhase2)
            {
                HandleElohimProjectiles();
            }
        }
        #endregion

        #region AI Behavior
        private void UpdateAIBehavior()
        {
            // Input Reading (trampa del jefe)
            if (Random.value < inputReadingChance * Time.deltaTime)
            {
                ReadPlayerInput();
            }

            switch (currentState)
            {
                case BossState.Idle:
                    HandleIdleState();
                    break;
                    
                case BossState.Aggressive:
                    HandleAggressiveState();
                    break;
                    
                case BossState.Defensive:
                    HandleDefensiveState();
                    break;
                    
                case BossState.UltimateAttack:
                    HandleUltimateState();
                    break;
            }

            // Uso frecuente de Ultimates en Fase 2
            if (isInPhase2 && Time.time >= nextUltimateTime)
            {
                if (fighter.GetEnergyPercentage() >= 1f)
                {
                    SimulateUltimateInput();
                    nextUltimateTime = Time.time + phase2UltimateFrequency;
                }
            }
        }

        private void HandleAggressiveState()
        {
            if (Time.time < nextAttackTime) return;

            float distanceToPlayer = Vector2.Distance(transform.position, player.transform.position);

            if (distanceToPlayer < 1.5f)
            {
                // Combos agresivos
                int attackPattern = Random.Range(0, 4);
                switch (attackPattern)
                {
                    case 0: // Puño-Puño-Patada
                        StartCoroutine(ComboRoutine(new string[] { "Punch", "Punch", "Kick" }));
                        break;
                    case 1: // Patada-Agarre
                        StartCoroutine(ComboRoutine(new string[] { "Kick", "Grab" }));
                        break;
                    case 2: // Puño-Patada-Puño
                        StartCoroutine(ComboRoutine(new string[] { "Punch", "Kick", "Punch" }));
                        break;
                    case 3: // Agarre directo
                        SimulateGrabInput();
                        break;
                }
                
                nextAttackTime = Time.time + aggressiveAttackInterval / (isInPhase2 ? phase2SpeedMultiplier : 1f);
            }
            else
            {
                // Moverse hacia el jugador
                MoveTowardsPlayer();
            }

            // Cambio aleatorio a defensivo
            if (Random.value < 0.1f)
            {
                currentState = BossState.Defensive;
            }
        }

        private void HandleDefensiveState()
        {
            // Bloqueo y espera
            SimulateBlockInput(true);
            
            if (Time.time > nextAttackTime + defensiveWaitTime)
            {
                SimulateBlockInput(false);
                currentState = BossState.Aggressive;
            }
        }

        private void HandleIdleState()
        {
            // Espera estratégica, carga energía
            if (fighter.GetEnergyPercentage() < 0.5f)
            {
                SimulateChargeInput(true);
            }
            else
            {
                SimulateChargeInput(false);
                currentState = BossState.Aggressive;
            }
        }

        private void HandleUltimateState()
        {
            if (fighter.GetEnergyPercentage() >= 1f)
            {
                SimulateUltimateInput();
            }
            currentState = BossState.Aggressive;
        }

        private IEnumerator ComboRoutine(string[] attacks)
        {
            foreach (string attack in attacks)
            {
                switch (attack)
                {
                    case "Punch":
                        SimulatePunchInput();
                        break;
                    case "Kick":
                        SimulateKickInput();
                        break;
                    case "Grab":
                        SimulateGrabInput();
                        break;
                }
                yield return new WaitForSeconds(0.3f);
            }
        }
        #endregion

        #region Input Reading (Boss Cheating)
        private void ReadPlayerInput()
        {
            // El jefe "lee" las intenciones del jugador y reacciona
            
            // Si el jugador está a punto de atacar, el jefe bloquea
            if (Vector2.Distance(transform.position, player.transform.position) < 2f)
            {
                playerAboutToAttack = Random.value < 0.5f;
                
                if (playerAboutToAttack)
                {
                    SimulateBlockInput(true);
                    StartCoroutine(ReleaseBlockAfterDelay(0.5f));
                }
            }
        }

        private IEnumerator ReleaseBlockAfterDelay(float delay)
        {
            yield return new WaitForSeconds(delay);
            SimulateBlockInput(false);
        }
        #endregion

        #region Phase System
        private void OnHealthChanged(float currentHealth)
        {
            float healthPercentage = fighter.GetHealthPercentage();

            if (!isInPhase2 && healthPercentage <= phase2HealthThreshold)
            {
                EnterPhase2();
            }
        }

        private void EnterPhase2()
        {
            isInPhase2 = true;
            Debug.Log($"{bossType} ha entrado en FASE 2!");

            // Efectos visuales
            if (phase2TransitionEffect != null)
            {
                phase2TransitionEffect.Play();
            }

            // Aumentar velocidad
            // Nota: esto requeriría acceso a las variables del FighterController
            // En producción, harías esto a través de un método público o eventos
            
            // Habilitar ataques más frecuentes
            aggressiveAttackInterval /= phase2SpeedMultiplier;
            
            // Mensaje cinematográfico
            StartCoroutine(Phase2Announcement());
        }

        private IEnumerator Phase2Announcement()
        {
            // Aquí podrías mostrar un texto en pantalla tipo "¡FORMA FINAL!"
            yield return new WaitForSeconds(2f);
            currentState = BossState.Aggressive;
        }
        #endregion

        #region Elohim Specific
        private void HandleElohimProjectiles()
        {
            if (Time.time >= nextProjectileTime && divineProjectilePrefab != null)
            {
                FireDivineProjectile();
                nextProjectileTime = Time.time + elohimProjectileInterval;
            }
        }

        private void FireDivineProjectile()
        {
            Vector3 direction = (player.transform.position - transform.position).normalized;
            GameObject projectile = Instantiate(divineProjectilePrefab, transform.position, Quaternion.identity);
            
            Rigidbody2D rb = projectile.GetComponent<Rigidbody2D>();
            if (rb != null)
            {
                rb.velocity = direction * 10f;
            }
        }
        #endregion

        #region Movement
        private void MoveTowardsPlayer()
        {
            Vector2 direction = (player.transform.position - transform.position).normalized;
            
            // Simula input de movimiento
            // Nota: Esto necesitaría integrarse con el sistema de inputs
            // Para producción, usar el PlayerInput del New Input System
            transform.position = Vector2.MoveTowards(
                transform.position, 
                player.transform.position, 
                Time.deltaTime * 3f * (isInPhase2 ? phase2SpeedMultiplier : 1f)
            );
        }
        #endregion

        #region Simulated Inputs
        private void SimulatePunchInput()
        {
            // Triggear el método OnPunch del FighterController
            // En producción, usarías el sistema de Input directamente
            fighter.SendMessage("OnPunch", SendMessageOptions.DontRequireReceiver);
        }

        private void SimulateKickInput()
        {
            fighter.SendMessage("OnKick", SendMessageOptions.DontRequireReceiver);
        }

        private void SimulateGrabInput()
        {
            fighter.SendMessage("OnGrab", SendMessageOptions.DontRequireReceiver);
        }

        private void SimulateBlockInput(bool active)
        {
            // Activar/desactivar bloqueo
        }

        private void SimulateChargeInput(bool active)
        {
            // Activar/desactivar carga de energía
        }

        private void SimulateUltimateInput()
        {
            fighter.SendMessage("OnUltimate", SendMessageOptions.DontRequireReceiver);
        }
        #endregion
    }
}
