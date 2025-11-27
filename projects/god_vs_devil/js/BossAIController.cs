// Developed by Fabrizio Raimondi Imfeld - GOD VS DEVIL
// Copyright 2024. Todos los derechos reservados.

using UnityEngine;

public class BossAIController : MonoBehaviour
{
    public enum BossType { Lucifer, GodSupreme }
    
    [Header("Configuración del Jefe")]
    public BossType bossIdentity;
    public float health = 2000f; // Mucha más vida que el jugador
    public bool isPhaseTwo = false; // Se activa al 50% de vida

    [Header("Combate")]
    public Transform playerTarget;
    public float attackRange = 2.5f;
    public float movementSpeed = 4f;
    private float attackCooldown = 0f;

    [Header("Habilidades Especiales")]
    // Lucifer: Rayo del Vacío | Dios: Juicio Final
    public GameObject ultimatePrefab; 

    void Update()
    {
        if (health <= 0) return;

        // Fase 2: Furia (Aumenta velocidad y daño al bajar de 1000 HP)
        if (health < 1000f && !isPhaseTwo)
        {
            ActivatePhaseTwo();
        }

        float distance = Vector2.Distance(transform.position, playerTarget.position);

        if (distance > attackRange)
        {
            ChasePlayer();
        }
        else
        {
            AttackLogic();
        }
    }

    void ChasePlayer()
    {
        // El jefe flota o camina hacia el jugador sin saltar (intimidante)
        transform.position = Vector2.MoveTowards(transform.position, new Vector2(playerTarget.position.x, transform.position.y), movementSpeed * Time.deltaTime);
    }

    void AttackLogic()
    {
        if (attackCooldown > 0)
        {
            attackCooldown -= Time.deltaTime;
            return;
        }

        // Decisión de IA "Injusta": 
        // 20% probabilidad de Agarre, 50% Golpe Normal, 30% Especial
        int rand = Random.Range(0, 100);

        if (rand < 20)
        {
            Debug.Log(bossIdentity + " usa Agarre Imparable.");
            // Anim.SetTrigger("Grab");
        }
        else if (rand < 70)
        {
             Debug.Log(bossIdentity + " usa Combo Pesado.");
             // Anim.SetTrigger("HeavyCombo");
        }
        else
        {
            // Solo usa el Ultimate si es Fase 2 o tiene carga
            if (isPhaseTwo) 
            {
                CastUltimateMove();
            }
        }

        attackCooldown = 1.5f; // Tiempo entre ataques
    }

    void CastUltimateMove()
    {
        Debug.Log("¡ALERTA! " + bossIdentity + " ESTÁ USANDO SU PODER DEFINITIVO.");
        // Instanciar el ataque de pantalla completa
        // Instantiate(ultimatePrefab, Vector3.zero, Quaternion.identity);
        attackCooldown = 5f; // Cooldown largo después del ultimate
    }

    void ActivatePhaseTwo()
    {
        isPhaseTwo = true;
        movementSpeed *= 1.5f; // Se vuelve más rápido
        Debug.Log("Fase 2 Activada: ¡El Jefe está furioso!");
        // Aquí cambiarías el color del sprite a rojo (Lucifer) o blanco cegador (Dios)
    }
}
