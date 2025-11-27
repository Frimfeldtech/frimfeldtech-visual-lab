using UnityEngine;
using UnityEngine.UI;
using TMPro;
using GodVsDevil.Combat;
using GodVsDevil.Systems;

namespace GodVsDevil.UI
{
    /// <summary>
    /// Controlador principal de la UI del juego
    /// Autor: Fabrizio Raimondi Imfeld
    /// © 2024-2025 Todos los derechos reservados
    /// </summary>
    public class GameUIManager : MonoBehaviour
    {
        #region Serialized Fields
        [Header("Barras de Vida")]
        [SerializeField] private Image player1HealthBar;
        [SerializeField] private Image player2HealthBar;
        [SerializeField] private TextMeshProUGUI player1NameText;
        [SerializeField] private TextMeshProUGUI player2NameText;
        
        [Header("Barras de Energía")]
        [SerializeField] private Image player1EnergyBar;
        [SerializeField] private Image player2EnergyBar;
        
        [Header("Timer")]
        [SerializeField] private TextMeshProUGUI timerText;
        [SerializeField] private float matchDuration = 99f;
        
        [Header("Combo Display")]
        [SerializeField] private TextMeshProUGUI comboText;
        [SerializeField] private GameObject comboPanel;
        
        [Header("Victorias")]
        [SerializeField] private Transform player1WinIcons;
        [SerializeField] private Transform player2WinIcons;
        
        [Header("Mensajes de Combate")]
        [SerializeField] private TextMeshProUGUI centerMessageText;
        [SerializeField] private GameObject centerMessagePanel;
        
        [Header("Misiones")]
        [SerializeField] private TextMeshProUGUI missionNameText;
        [SerializeField] private TextMeshProUGUI missionDescText;
        [SerializeField] private GameObject missionPanel;
        #endregion

        #region Private Variables
        private float currentTime;
        private bool timerRunning;
        #endregion

        #region Unity Lifecycle
        private void Start()
        {
            if (centerMessagePanel != null)
                centerMessagePanel.SetActive(false);
                
            if (comboPanel != null)
                comboPanel.SetActive(false);
        }

        private void Update()
        {
            if (timerRunning)
            {
                UpdateTimer();
            }
        }
        #endregion

        #region Health & Energy
        public void InitializeFighters(FighterController player1, FighterController player2, string p1Name, string p2Name)
        {
            if (player1 != null)
            {
                player1.OnHealthChanged += (health) => UpdateHealthBar(player1HealthBar, player1.GetHealthPercentage());
                player1.OnEnergyChanged += (energy) => UpdateEnergyBar(player1EnergyBar, player1.GetEnergyPercentage());
                player1NameText.text = p1Name;
            }

            if (player2 != null)
            {
                player2.OnHealthChanged += (health) => UpdateHealthBar(player2HealthBar, player2.GetHealthPercentage());
                player2.OnEnergyChanged += (energy) => UpdateEnergyBar(player2EnergyBar, player2.GetEnergyPercentage());
                player2NameText.text = p2Name;
            }
        }

        private void UpdateHealthBar(Image healthBar, float percentage)
        {
            if (healthBar != null)
            {
                healthBar.fillAmount = percentage;
                
                // Cambiar color según vida restante
                if (percentage > 0.5f)
                    healthBar.color = Color.Lerp(Color.yellow, Color.green, (percentage - 0.5f) * 2f);
                else
                    healthBar.color = Color.Lerp(Color.red, Color.yellow, percentage * 2f);
            }
        }

        private void UpdateEnergyBar(Image energyBar, float percentage)
        {
            if (energyBar != null)
            {
                energyBar.fillAmount = percentage;
                
                // Efecto de brillo al llegar al 100%
                if (percentage >= 1f)
                {
                    energyBar.color = Color.Lerp(Color.cyan, Color.white, Mathf.PingPong(Time.time * 2f, 1f));
                }
                else
                {
                    energyBar.color = Color.cyan;
                }
            }
        }
        #endregion

        #region Timer
        public void StartTimer()
        {
            currentTime = matchDuration;
            timerRunning = true;
        }

        public void StopTimer()
        {
            timerRunning = false;
        }

        private void UpdateTimer()
        {
            currentTime -= Time.deltaTime;
            
            if (currentTime <= 0)
            {
                currentTime = 0;
                timerRunning = false;
                // Trigger tiempo agotado
                OnTimeUp();
            }

            if (timerText != null)
            {
                int seconds = Mathf.CeilToInt(currentTime);
                timerText.text = seconds.ToString("00");
                
                // Efecto de parpadeo cuando quedan menos de 10 segundos
                if (seconds <= 10)
                {
                    timerText.color = Color.Lerp(Color.white, Color.red, Mathf.PingPong(Time.time * 3f, 1f));
                }
            }
        }

        private void OnTimeUp()
        {
            // Determinar ganador por vida restante
            Debug.Log("¡TIEMPO AGOTADO!");
        }
        #endregion

        #region Combat Messages
        public void ShowMessage(string message, float duration = 2f)
        {
            if (centerMessageText != null && centerMessagePanel != null)
            {
                centerMessageText.text = message;
                centerMessagePanel.SetActive(true);
                Invoke(nameof(HideMessage), duration);
            }
        }

        private void HideMessage()
        {
            if (centerMessagePanel != null)
                centerMessagePanel.SetActive(false);
        }

        public void ShowRoundStart(int roundNumber)
        {
            ShowMessage($"RONDA {roundNumber}\n¡LUCHA!", 2f);
        }

        public void ShowFight()
        {
            ShowMessage("¡LUCHA!", 1.5f);
        }

        public void ShowKO()
        {
            ShowMessage("¡K.O.!", 3f);
        }

        public void ShowWinner(string winnerName)
        {
            ShowMessage($"{winnerName}\n¡VICTORIA!", 3f);
        }
        #endregion

        #region Combo Display
        public void ShowCombo(int comboCount)
        {
            if (comboCount < 2) return;

            if (comboPanel != null)
                comboPanel.SetActive(true);

            if (comboText != null)
            {
                comboText.text = $"{comboCount} COMBO!";
                
                // Tamaño del texto aumenta con el combo
                float scale = 1f + (comboCount * 0.1f);
                comboText.transform.localScale = Vector3.one * Mathf.Min(scale, 2f);
            }

            CancelInvoke(nameof(HideCombo));
            Invoke(nameof(HideCombo), 1.5f);
        }

        private void HideCombo()
        {
            if (comboPanel != null)
                comboPanel.SetActive(false);
        }
        #endregion

        #region Win Icons
        public void UpdateWinIcons(int player1Wins, int player2Wins)
        {
            UpdatePlayerWinIcons(player1WinIcons, player1Wins);
            UpdatePlayerWinIcons(player2WinIcons, player2Wins);
        }

        private void UpdatePlayerWinIcons(Transform iconContainer, int wins)
        {
            if (iconContainer == null) return;

            for (int i = 0; i < iconContainer.childCount; i++)
            {
                iconContainer.GetChild(i).gameObject.SetActive(i < wins);
            }
        }
        #endregion

        #region Missions
        public void ShowMissionNotification(Mission mission)
        {
            if (missionPanel != null && missionNameText != null && missionDescText != null)
            {
                missionNameText.text = mission.missionName;
                missionDescText.text = mission.description;
                missionPanel.SetActive(true);
                
                Invoke(nameof(HideMissionPanel), 5f);
            }
        }

        private void HideMissionPanel()
        {
            if (missionPanel != null)
                missionPanel.SetActive(false);
        }

        public void ShowMissionComplete(Mission mission)
        {
            ShowMessage($"¡MISIÓN COMPLETADA!\n{mission.missionName}\n+{mission.xpReward} XP", 3f);
        }
        #endregion
    }
}
