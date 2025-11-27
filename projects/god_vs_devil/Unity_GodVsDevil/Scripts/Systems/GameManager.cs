using UnityEngine;
using UnityEngine.SceneManagement;
using GodVsDevil.Combat;
using GodVsDevil.Systems;
using GodVsDevil.UI;

namespace GodVsDevil.Core
{
    /// <summary>
    /// Gestor principal del juego - Maneja flujo, estados y victoria/derrota
    /// Autor: Fabrizio Raimondi Imfeld
    /// © 2024-2025 Todos los derechos reservados
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        #region Singleton
        public static GameManager Instance { get; private set; }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }
        #endregion

        #region Serialized Fields
        [Header("Referencias")]
        [SerializeField] private GameUIManager uiManager;
        [SerializeField] private MissionSystem missionSystem;
        [SerializeField] private CharacterProgression progression;
        
        [Header("Configuración de Combate")]
        [SerializeField] private int roundsToWin = 2;
        [SerializeField] private float roundStartDelay = 2f;
        [SerializeField] private float roundEndDelay = 3f;
        
        [Header("Configuración de XP")]
        [SerializeField] private float xpPerWin = 100f;
        [SerializeField] private float xpPerRound = 30f;
        [SerializeField] private float xpBonusPerfect = 50f; // Sin recibir daño
        #endregion

        #region Private Variables
        private FighterController player1;
        private FighterController player2;
        
        private int player1Wins;
        private int player2Wins;
        private int currentRound;
        
        private float combatStartTime;
        private GameState currentState;
        
        // Configuración del combate
        private string player1CharacterID;
        private string player2CharacterID;
        private bool isCPUMatch;
        #endregion

        #region Enums
        public enum GameState
        {
            MainMenu,
            CharacterSelect,
            PreRound,
            Fighting,
            RoundEnd,
            MatchEnd,
            Paused
        }

        public enum GameMode
        {
            Story,
            Arcade,
            Versus,
            Survival
        }
        #endregion

        #region Properties
        public GameState CurrentState => currentState;
        public GameMode CurrentMode { get; private set; }
        #endregion

        #region Unity Lifecycle
        private void Start()
        {
            ChangeState(GameState.MainMenu);
        }

        private void Update()
        {
            // Lógica por estado
            switch (currentState)
            {
                case GameState.Fighting:
                    CheckMatchConditions();
                    break;
            }
        }
        #endregion

        #region State Management
        private void ChangeState(GameState newState)
        {
            currentState = newState;
            
            switch (newState)
            {
                case GameState.PreRound:
                    StartRound();
                    break;
                    
                case GameState.Fighting:
                    EnableFighters(true);
                    uiManager.StartTimer();
                    combatStartTime = Time.time;
                    break;
                    
                case GameState.RoundEnd:
                    EnableFighters(false);
                    uiManager.StopTimer();
                    break;
                    
                case GameState.MatchEnd:
                    EnableFighters(false);
                    Invoke(nameof(EndMatch), roundEndDelay);
                    break;
            }
        }
        #endregion

        #region Match Setup
        public void SetupMatch(string p1CharID, string p2CharID, bool cpuOpponent, GameMode mode)
        {
            player1CharacterID = p1CharID;
            player2CharacterID = p2CharID;
            isCPUMatch = cpuOpponent;
            CurrentMode = mode;
            
            player1Wins = 0;
            player2Wins = 0;
            currentRound = 0;
            
            // Cargar arena
            SceneManager.LoadScene("Arena", LoadSceneMode.Single);
            SceneManager.sceneLoaded += OnArenaLoaded;
        }

        private void OnArenaLoaded(Scene scene, LoadSceneMode mode)
        {
            if (scene.name == "Arena")
            {
                SceneManager.sceneLoaded -= OnArenaLoaded;
                InitializeFighters();
                ChangeState(GameState.PreRound);
            }
        }

        private void InitializeFighters()
        {
            // Buscar spawn points
            GameObject p1Spawn = GameObject.Find("SpawnPoint_P1");
            GameObject p2Spawn = GameObject.Find("SpawnPoint_P2");

            // Instanciar prefabs de personajes
            // NOTA: Aquí deberías cargar los prefabs desde Resources o AssetBundles
            // basándote en player1CharacterID y player2CharacterID
            
            // Por ahora, asumimos que ya existen en la escena o se instancian manualmente
            player1 = GameObject.FindGameObjectWithTag("Player1").GetComponent<FighterController>();
            player2 = GameObject.FindGameObjectWithTag("Player2").GetComponent<FighterController>();

            // Configurar oponentes
            player1.SetOpponent(player2);
            player2.SetOpponent(player1);

            // Suscribirse a eventos
            player1.OnDeath += OnPlayer1Death;
            player2.OnDeath += OnPlayer2Death;

            // Inicializar UI
            uiManager.InitializeFighters(player1, player2, player1CharacterID, player2CharacterID);
        }
        #endregion

        #region Round Management
        private void StartRound()
        {
            currentRound++;
            Debug.Log($"ROUND {currentRound}!");

            // Reiniciar posiciones
            ResetFighterPositions();

            // Mostrar mensaje
            uiManager.ShowRoundStart(currentRound);

            // Notificar sistema de misiones
            if (missionSystem != null)
            {
                missionSystem.OnCombatStart();
            }

            // Iniciar pelea después del delay
            Invoke(nameof(StartFight), roundStartDelay);
        }

        private void StartFight()
        {
            uiManager.ShowFight();
            ChangeState(GameState.Fighting);
        }

        private void ResetFighterPositions()
        {
            GameObject p1Spawn = GameObject.Find("SpawnPoint_P1");
            GameObject p2Spawn = GameObject.Find("SpawnPoint_P2");

            if (p1Spawn != null && player1 != null)
                player1.transform.position = p1Spawn.transform.position;
                
            if (p2Spawn != null && player2 != null)
                player2.transform.position = p2Spawn.transform.position;

            // Reiniciar vida al 100%
            // NOTA: Necesitarías método ResetHealth() en FighterController
        }

        private void EndRound(FighterController winner)
        {
            ChangeState(GameState.RoundEnd);
            
            // Actualizar contador de victorias
            if (winner == player1)
            {
                player1Wins++;
                Debug.Log($"Player 1 gana el round! ({player1Wins}/{roundsToWin})");
            }
            else
            {
                player2Wins++;
                Debug.Log($"Player 2 gana el round! ({player2Wins}/{roundsToWin})");
            }

            // Actualizar UI
            uiManager.UpdateWinIcons(player1Wins, player2Wins);
            uiManager.ShowKO();

            // Otorgar XP por round
            if (winner == player1 && progression != null)
            {
                progression.AddXP(xpPerRound);
            }

            // Verificar si el match terminó
            if (player1Wins >= roundsToWin || player2Wins >= roundsToWin)
            {
                ChangeState(GameState.MatchEnd);
            }
            else
            {
                Invoke(nameof(NextRound), roundEndDelay);
            }
        }

        private void NextRound()
        {
            ChangeState(GameState.PreRound);
        }
        #endregion

        #region Victory/Defeat
        private void OnPlayer1Death()
        {
            EndRound(player2);
        }

        private void OnPlayer2Death()
        {
            EndRound(player1);
        }

        private void EndMatch()
        {
            FighterController winner = player1Wins >= roundsToWin ? player1 : player2;
            string winnerName = winner == player1 ? player1CharacterID : player2CharacterID;
            
            uiManager.ShowWinner(winnerName);
            
            // Otorgar XP si el jugador ganó
            if (winner == player1 && progression != null)
            {
                float totalXP = xpPerWin;
                
                // Bonus por victoria perfecta
                if (player1.GetHealthPercentage() == 1f)
                {
                    totalXP += xpBonusPerfect;
                    Debug.Log("¡VICTORIA PERFECTA! +" + xpBonusPerfect + " XP");
                }
                
                progression.AddXP(totalXP);
            }

            // Completar misión si aplica
            if (missionSystem != null && winner == player1)
            {
                float combatDuration = Time.time - combatStartTime;
                missionSystem.OnCombatEnd(true, player1.GetHealthPercentage(), combatDuration);
            }

            // Volver al menú principal después de delay
            Invoke(nameof(ReturnToMenu), 5f);
        }

        private void ReturnToMenu()
        {
            SceneManager.LoadScene("MainMenu");
        }
        #endregion

        #region Match Conditions
        private void CheckMatchConditions()
        {
            // Verificar si se acabó el tiempo
            // (La UI Manager ya maneja esto, pero podríamos añadir lógica adicional aquí)
        }

        private void EnableFighters(bool enabled)
        {
            if (player1 != null)
                player1.enabled = enabled;
                
            if (player2 != null)
                player2.enabled = enabled;
        }
        #endregion

        #region Pause
        public void PauseGame()
        {
            if (currentState == GameState.Fighting)
            {
                Time.timeScale = 0;
                ChangeState(GameState.Paused);
            }
        }

        public void ResumeGame()
        {
            if (currentState == GameState.Paused)
            {
                Time.timeScale = 1;
                ChangeState(GameState.Fighting);
            }
        }

        public void QuitToMenu()
        {
            Time.timeScale = 1;
            SceneManager.LoadScene("MainMenu");
        }
        #endregion

        #region Public Methods
        public void StartStoryMode(bool lightPath)
        {
            // Implementar lógica de modo historia
            // lightPath == true: Ruta de los Ángeles (vs Lucifer)
            // lightPath == false: Ruta de los Demonios (vs Elohim)
        }

        public void StartArcadeMode(string characterID)
        {
            // Implementar escalera de enemigos
        }

        public void StartVersusMode(string p1CharID, string p2CharID, bool cpuP2)
        {
            SetupMatch(p1CharID, p2CharID, cpuP2, GameMode.Versus);
        }
        #endregion
    }
}
