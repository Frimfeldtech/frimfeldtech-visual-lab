using UnityEngine;
using System;
using System.Collections.Generic;

namespace GodVsDevil.Systems
{
    /// <summary>
    /// Sistema de Misiones con desafíos y recompensas
    /// Autor: Fabrizio Raimondi Imfeld
    /// © 2024-2025 Todos los derechos reservados
    /// </summary>
    [Serializable]
    public class Mission
    {
        public string missionID;
        public string missionName;
        public string description;
        public MissionType type;
        public float xpReward;
        public bool isCompleted;
        public float targetValue; // Valor objetivo (ej: 10% de vida restante)
    }

    public enum MissionType
    {
        WinWithKicksOnly,
        WinWithLowHealth,
        WinWithoutBlocking,
        WinWithPerfectBlock,
        PerformUltimate,
        AchieveCombo,
        WinUnderTime,
        NoJumping
    }

    public class MissionSystem : MonoBehaviour
    {
        #region Serialized Fields
        [Header("Configuración de Misiones")]
        [SerializeField] private List<Mission> availableMissions = new List<Mission>();
        [SerializeField] private int maxActiveMissions = 3;
        #endregion

        #region Private Variables
        private List<Mission> activeMissions = new List<Mission>();
        private Mission currentMission;
        
        // Estadísticas de seguimiento
        private int kicksUsed;
        private int punchesUsed;
        private bool hasBlocked;
        private bool hasJumped;
        private int perfectBlocksCount;
        private int maxComboAchieved;
        private bool ultimateUsed;
        #endregion

        #region Events
        public event Action<Mission> OnMissionCompleted;
        public event Action<Mission> OnMissionFailed;
        public event Action<Mission> OnNewMission;
        #endregion

        #region Unity Lifecycle
        private void Awake()
        {
            InitializeDefaultMissions();
        }

        private void Start()
        {
            AssignRandomMissions();
        }
        #endregion

        #region Mission Initialization
        private void InitializeDefaultMissions()
        {
            availableMissions = new List<Mission>
            {
                new Mission
                {
                    missionID = "KICK_ONLY",
                    missionName = "Maestro de Patadas",
                    description = "Gana usando solo patadas",
                    type = MissionType.WinWithKicksOnly,
                    xpReward = 500f,
                    targetValue = 0
                },
                new Mission
                {
                    missionID = "LOW_HP",
                    missionName = "Al Borde del Abismo",
                    description = "Gana con 10% o menos de vida",
                    type = MissionType.WinWithLowHealth,
                    xpReward = 800f,
                    targetValue = 0.1f
                },
                new Mission
                {
                    missionID = "NO_BLOCK",
                    missionName = "Sin Defensa",
                    description = "Gana sin bloquear ningún ataque",
                    type = MissionType.WinWithoutBlocking,
                    xpReward = 600f,
                    targetValue = 0
                },
                new Mission
                {
                    missionID = "PERFECT_BLOCK",
                    missionName = "Defensa Perfecta",
                    description = "Bloquea 10 ataques perfectamente",
                    type = MissionType.WinWithPerfectBlock,
                    xpReward = 700f,
                    targetValue = 10
                },
                new Mission
                {
                    missionID = "ULTIMATE",
                    missionName = "Poder Definitivo",
                    description = "Usa tu Ultimate 2 veces en un combate",
                    type = MissionType.PerformUltimate,
                    xpReward = 1000f,
                    targetValue = 2
                },
                new Mission
                {
                    missionID = "COMBO_MASTER",
                    missionName = "Maestro del Combo",
                    description = "Logra un combo de 7 golpes",
                    type = MissionType.AchieveCombo,
                    xpReward = 900f,
                    targetValue = 7
                },
                new Mission
                {
                    missionID = "SPEED_RUN",
                    missionName = "Victoria Rápida",
                    description = "Gana en menos de 30 segundos",
                    type = MissionType.WinUnderTime,
                    xpReward = 750f,
                    targetValue = 30f
                },
                new Mission
                {
                    missionID = "NO_JUMP",
                    missionName = "Pies en la Tierra",
                    description = "Gana sin saltar",
                    type = MissionType.NoJumping,
                    xpReward = 550f,
                    targetValue = 0
                }
            };
        }

        private void AssignRandomMissions()
        {
            activeMissions.Clear();
            
            List<Mission> shuffled = new List<Mission>(availableMissions);
            
            // Shuffle
            for (int i = 0; i < shuffled.Count; i++)
            {
                Mission temp = shuffled[i];
                int randomIndex = UnityEngine.Random.Range(i, shuffled.Count);
                shuffled[i] = shuffled[randomIndex];
                shuffled[randomIndex] = temp;
            }

            // Tomar las primeras N misiones
            for (int i = 0; i < Mathf.Min(maxActiveMissions, shuffled.Count); i++)
            {
                if (!shuffled[i].isCompleted)
                {
                    activeMissions.Add(shuffled[i]);
                    OnNewMission?.Invoke(shuffled[i]);
                }
            }
        }
        #endregion

        #region Combat Tracking
        public void OnCombatStart()
        {
            ResetTrackingStats();
            
            // Seleccionar misión activa para este combate
            if (activeMissions.Count > 0)
            {
                currentMission = activeMissions[UnityEngine.Random.Range(0, activeMissions.Count)];
                Debug.Log($"Misión activa: {currentMission.missionName}");
            }
        }

        public void OnCombatEnd(bool playerWon, float playerHealthPercentage, float combatDuration)
        {
            if (!playerWon || currentMission == null) return;

            bool missionComplete = CheckMissionCompletion(playerHealthPercentage, combatDuration);

            if (missionComplete)
            {
                CompleteMission(currentMission);
            }
            else
            {
                OnMissionFailed?.Invoke(currentMission);
            }
        }

        private bool CheckMissionCompletion(float playerHealthPercentage, float combatDuration)
        {
            switch (currentMission.type)
            {
                case MissionType.WinWithKicksOnly:
                    return punchesUsed == 0 && kicksUsed > 0;
                    
                case MissionType.WinWithLowHealth:
                    return playerHealthPercentage <= currentMission.targetValue;
                    
                case MissionType.WinWithoutBlocking:
                    return !hasBlocked;
                    
                case MissionType.WinWithPerfectBlock:
                    return perfectBlocksCount >= currentMission.targetValue;
                    
                case MissionType.PerformUltimate:
                    return ultimateUsed;
                    
                case MissionType.AchieveCombo:
                    return maxComboAchieved >= currentMission.targetValue;
                    
                case MissionType.WinUnderTime:
                    return combatDuration <= currentMission.targetValue;
                    
                case MissionType.NoJumping:
                    return !hasJumped;
                    
                default:
                    return false;
            }
        }

        private void CompleteMission(Mission mission)
        {
            mission.isCompleted = true;
            OnMissionCompleted?.Invoke(mission);
            
            // Otorgar XP
            CharacterProgression progression = FindObjectOfType<CharacterProgression>();
            if (progression != null)
            {
                progression.AddXP(mission.xpReward);
            }

            Debug.Log($"¡MISIÓN COMPLETADA! {mission.missionName} - +{mission.xpReward} XP");
        }

        private void ResetTrackingStats()
        {
            kicksUsed = 0;
            punchesUsed = 0;
            hasBlocked = false;
            hasJumped = false;
            perfectBlocksCount = 0;
            maxComboAchieved = 0;
            ultimateUsed = false;
        }
        #endregion

        #region Public Tracking Methods
        public void TrackPunch()
        {
            punchesUsed++;
        }

        public void TrackKick()
        {
            kicksUsed++;
        }

        public void TrackBlock(bool wasPerfect = false)
        {
            hasBlocked = true;
            if (wasPerfect) perfectBlocksCount++;
        }

        public void TrackJump()
        {
            hasJumped = true;
        }

        public void TrackCombo(int comboCount)
        {
            maxComboAchieved = Mathf.Max(maxComboAchieved, comboCount);
        }

        public void TrackUltimate()
        {
            ultimateUsed = true;
        }
        #endregion

        #region Public Getters
        public List<Mission> GetActiveMissions()
        {
            return new List<Mission>(activeMissions);
        }

        public Mission GetCurrentMission()
        {
            return currentMission;
        }

        public float GetMissionProgress()
        {
            if (currentMission == null) return 0f;

            switch (currentMission.type)
            {
                case MissionType.WinWithPerfectBlock:
                    return perfectBlocksCount / currentMission.targetValue;
                    
                case MissionType.AchieveCombo:
                    return Mathf.Clamp01(maxComboAchieved / currentMission.targetValue);
                    
                default:
                    return 0f;
            }
        }
        #endregion
    }
}
