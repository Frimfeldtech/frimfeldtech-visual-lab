using UnityEngine;
using System;
using System.IO;

namespace GodVsDevil.Systems
{
    /// <summary>
    /// Sistema de progresión RPG con guardado persistente
    /// Autor: Fabrizio Raimondi Imfeld
    /// © 2024-2025 Todos los derechos reservados
    /// </summary>
    [Serializable]
    public class CharacterProgressionData
    {
        public int level = 1;
        public float currentXP = 0;
        public int skillPoints = 0;
        public int strengthModifier = 0;
        public int defenseModifier = 0;
        public int energyModifier = 0;
        public string characterName = "";
    }

    public class CharacterProgression : MonoBehaviour
    {
        #region Serialized Fields
        [Header("Configuración de Progresión")]
        [SerializeField] private int maxLevel = 50;
        [SerializeField] private float baseXPRequired = 100f;
        [SerializeField] private float xpScalingFactor = 1.5f;
        [SerializeField] private int skillPointsPerLevel = 3;
        
        [Header("Bonificaciones por Stats")]
        [SerializeField] private float strengthDamageBonus = 5f; // +5% daño por punto
        [SerializeField] private float defenseReductionBonus = 3f; // +3% reducción por punto
        [SerializeField] private float energyMaxBonus = 10f; // +10 energía máxima por punto
        #endregion

        #region Private Variables
        private CharacterProgressionData progressionData;
        private string saveFilePath;
        #endregion

        #region Events
        public event Action<int> OnLevelUp;
        public event Action<float> OnXPGained;
        public event Action<int> OnSkillPointsChanged;
        #endregion

        #region Properties
        public int Level => progressionData.level;
        public float CurrentXP => progressionData.currentXP;
        public int SkillPoints => progressionData.skillPoints;
        public int StrengthModifier => progressionData.strengthModifier;
        public int DefenseModifier => progressionData.defenseModifier;
        public int EnergyModifier => progressionData.energyModifier;
        #endregion

        #region Unity Lifecycle
        private void Awake()
        {
            saveFilePath = Path.Combine(Application.persistentDataPath, "character_save.json");
            LoadProgress();
        }
        #endregion

        #region XP and Leveling
        public void AddXP(float amount)
        {
            progressionData.currentXP += amount;
            OnXPGained?.Invoke(amount);

            float xpRequired = GetXPRequiredForNextLevel();
            
            while (progressionData.currentXP >= xpRequired && progressionData.level < maxLevel)
            {
                LevelUp();
                xpRequired = GetXPRequiredForNextLevel();
            }

            SaveProgress();
        }

        private void LevelUp()
        {
            progressionData.level++;
            progressionData.currentXP -= GetXPRequiredForLevel(progressionData.level - 1);
            progressionData.skillPoints += skillPointsPerLevel;

            OnLevelUp?.Invoke(progressionData.level);
            OnSkillPointsChanged?.Invoke(progressionData.skillPoints);

            Debug.Log($"¡NIVEL {progressionData.level}! Nuevos puntos de habilidad: {skillPointsPerLevel}");
        }

        public float GetXPRequiredForNextLevel()
        {
            return GetXPRequiredForLevel(progressionData.level);
        }

        private float GetXPRequiredForLevel(int level)
        {
            return baseXPRequired * Mathf.Pow(xpScalingFactor, level - 1);
        }

        public float GetXPProgressPercentage()
        {
            float required = GetXPRequiredForNextLevel();
            return Mathf.Clamp01(progressionData.currentXP / required);
        }
        #endregion

        #region Skill Points
        public bool CanSpendSkillPoint()
        {
            return progressionData.skillPoints > 0;
        }

        public void AddStrength()
        {
            if (!CanSpendSkillPoint()) return;

            progressionData.strengthModifier++;
            progressionData.skillPoints--;
            OnSkillPointsChanged?.Invoke(progressionData.skillPoints);
            SaveProgress();
        }

        public void AddDefense()
        {
            if (!CanSpendSkillPoint()) return;

            progressionData.defenseModifier++;
            progressionData.skillPoints--;
            OnSkillPointsChanged?.Invoke(progressionData.skillPoints);
            SaveProgress();
        }

        public void AddEnergy()
        {
            if (!CanSpendSkillPoint()) return;

            progressionData.energyModifier++;
            progressionData.skillPoints--;
            OnSkillPointsChanged?.Invoke(progressionData.skillPoints);
            SaveProgress();
        }

        public float GetDamageMultiplier()
        {
            return 1f + (progressionData.strengthModifier * strengthDamageBonus / 100f);
        }

        public float GetDefenseMultiplier()
        {
            return 1f - (progressionData.defenseModifier * defenseReductionBonus / 100f);
        }

        public float GetEnergyBonus()
        {
            return progressionData.energyModifier * energyMaxBonus;
        }
        #endregion

        #region Save/Load System
        public void SaveProgress()
        {
            try
            {
                string json = JsonUtility.ToJson(progressionData, true);
                File.WriteAllText(saveFilePath, json);
                Debug.Log($"Progreso guardado en: {saveFilePath}");
            }
            catch (Exception e)
            {
                Debug.LogError($"Error al guardar progreso: {e.Message}");
            }
        }

        public void LoadProgress()
        {
            if (File.Exists(saveFilePath))
            {
                try
                {
                    string json = File.ReadAllText(saveFilePath);
                    progressionData = JsonUtility.FromJson<CharacterProgressionData>(json);
                    Debug.Log($"Progreso cargado: Nivel {progressionData.level}");
                }
                catch (Exception e)
                {
                    Debug.LogError($"Error al cargar progreso: {e.Message}");
                    CreateNewProgress();
                }
            }
            else
            {
                CreateNewProgress();
            }
        }

        private void CreateNewProgress()
        {
            progressionData = new CharacterProgressionData();
            Debug.Log("Nuevo juego iniciado");
        }

        public void ResetProgress()
        {
            if (File.Exists(saveFilePath))
            {
                File.Delete(saveFilePath);
            }
            CreateNewProgress();
        }
        #endregion

        #region Public Methods
        public void SetCharacterName(string name)
        {
            progressionData.characterName = name;
            SaveProgress();
        }

        public string GetCharacterName()
        {
            return progressionData.characterName;
        }
        #endregion
    }
}
