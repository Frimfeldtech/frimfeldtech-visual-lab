using UnityEngine;
using System.Collections.Generic;

namespace GodVsDevil.Data
{
    /// <summary>
    /// Base de datos de personajes del juego
    /// Autor: Fabrizio Raimondi Imfeld
    /// © 2024-2025 Todos los derechos reservados
    /// </summary>
    
    [System.Serializable]
    public class CharacterData
    {
        public string characterID;
        public string characterName;
        public CharacterFaction faction;
        public string description;
        
        // Stats base
        public float baseHealth;
        public float baseDamage;
        public float baseSpeed;
        public float baseDefense;
        
        // Visual
        public string colorTheme;
        public string weaponDescription;
        public string postureDescription;
        public string visualStyle;
        
        // Audio
        public string musicTheme;
        public string ultimateSoundEffect;
        
        // Abilities
        public string specialAbilityName;
        public string specialAbilityDescription;
        public string ultimateAttackName;
        public string ultimateAttackDescription;
    }

    public enum CharacterFaction
    {
        Archangels,
        Demons,
        Boss
    }

    [CreateAssetMenu(fileName = "CharacterDatabase", menuName = "God vs Devil/Character Database")]
    public class CharacterDatabase : ScriptableObject
    {
        public List<CharacterData> allCharacters = new List<CharacterData>();

        #region Character Definitions
        public void InitializeDefaultCharacters()
        {
            allCharacters = new List<CharacterData>
            {
                // ========== ARCÁNGELES ==========
                new CharacterData
                {
                    characterID = "MIGUEL",
                    characterName = "MIGUEL",
                    faction = CharacterFaction.Archangels,
                    description = "Líder de los arcángeles. Guerrero equilibrado con dominio de espada flamígera.",
                    baseHealth = 100f,
                    baseDamage = 15f,
                    baseSpeed = 5f,
                    baseDefense = 10f,
                    colorTheme = "Azul eléctrico y plateado",
                    weaponDescription = "Espada flamígera de llama azul",
                    postureDescription = "Postura de esgrima medieval, alas desplegadas simétricamente",
                    visualStyle = "Armadura de placas azul brillante con grabados celestiales. Alas funcionales de plumas metálicas. Halo pulsante.",
                    musicTheme = "Metal Sinfónico (guitarras + orquesta)",
                    ultimateSoundEffect = "Coro celestial + trueno",
                    specialAbilityName = "Juicio Divino",
                    specialAbilityDescription = "Sus ataques críticos tienen 20% más de probabilidad",
                    ultimateAttackName = "Ira de los Cielos",
                    ultimateAttackDescription = "Invoca una lluvia de espadas flamígeras que golpean en área"
                },

                new CharacterData
                {
                    characterID = "JOFIEL",
                    characterName = "JOFIEL",
                    faction = CharacterFaction.Archangels,
                    description = "Ángel de la sabiduría. Usa báculo solar y levita constantemente.",
                    baseHealth = 85f,
                    baseDamage = 18f,
                    baseSpeed = 6f,
                    baseDefense = 8f,
                    colorTheme = "Dorado y amarillo radiante",
                    weaponDescription = "Báculo solar con cristal en la punta",
                    postureDescription = "Levitando 1 metro del suelo, postura de meditación activa",
                    visualStyle = "Túnicas doradas fluidas, alas de luz pura (sin plumas), corona de rayos solares",
                    musicTheme = "Orquestal con arpas y coros femeninos",
                    ultimateSoundEffect = "Campanillas cristalinas + explosión solar",
                    specialAbilityName = "Iluminación",
                    specialAbilityDescription = "Gana energía un 25% más rápido",
                    ultimateAttackName = "Nova Solar",
                    ultimateAttackDescription = "Explota en luz cegadora que daña y ciega temporalmente al rival"
                },

                new CharacterData
                {
                    characterID = "CHAMUEL",
                    characterName = "CHAMUEL",
                    faction = CharacterFaction.Archangels,
                    description = "Velocista extremo. Maestro del kickboxing angélico.",
                    baseHealth = 90f,
                    baseDamage = 12f,
                    baseSpeed = 8f,
                    baseDefense = 7f,
                    colorTheme = "Rosa violáceo y blanco",
                    weaponDescription = "Puños desnudos con aura rosa",
                    postureDescription = "Stance de kickboxing, constantemente en movimiento",
                    visualStyle = "Armadura ligera tipo traje ajustado, alas pequeñas tipo colibrí, vendas en manos brillantes",
                    musicTheme = "Drum & Bass etéreo (ritmo frenético)",
                    ultimateSoundEffect = "Ráfaga de viento + golpes sónicos",
                    specialAbilityName = "Velocidad Divina",
                    specialAbilityDescription = "Aumenta velocidad de ataque un 30%",
                    ultimateAttackName = "Mil Golpes Sagrados",
                    ultimateAttackDescription": "Ráfaga de 20 golpes ultrarrápidos"
                },

                new CharacterData
                {
                    characterID = "GABRIEL",
                    characterName = "GABRIEL",
                    faction = CharacterFaction.Archangels,
                    description = "El mensajero. Su trompeta destruye con ondas sónicas.",
                    baseHealth = 95f,
                    baseDamage = 17f,
                    baseSpeed = 5f,
                    baseDefense = 9f,
                    colorTheme = "Blanco puro y dorado",
                    weaponDescription = "Trompeta dorada gigante usada como arma",
                    postureDescription = "Postura de músico guerrero, trompeta al frente",
                    visualStyle = "Túnica blanca militar, hombreras doradas, alas de cisne, casco alado",
                    musicTheme = "Fanfarria militar intensa (trompetas y percusión)",
                    ultimateSoundEffect = "Nota musical devastadora sostenida",
                    specialAbilityName = "Resonancia Sónica",
                    specialAbilityDescription = "Sus ataques empujan al rival hacia atrás",
                    ultimateAttackName = "Trompeta del Apocalipsis",
                    ultimateAttackDescription = "Toca una nota que causa daño masivo y aturde"
                },

                new CharacterData
                {
                    characterID = "RAFAEL",
                    characterName = "RAFAEL",
                    faction = CharacterFaction.Archangels,
                    description = "El sanador convertido en asesino. Usa dagas de energía quirúrgica.",
                    baseHealth = 85f,
                    baseDamage = 20f,
                    baseSpeed = 7f,
                    baseDefense = 6f,
                    colorTheme = "Verde esmeralda y plata",
                    weaponDescription = "Dobles dagas de energía verde brillante",
                    postureDescription = "Stance sigiloso de asesino, agazapado",
                    visualStyle = "Armadura tipo médico futurista, símbolo de caduceo en pecho, alas con plumas de bisturí metálico",
                    musicTheme = "Ambient tenso con pulsos electrónicos",
                    ultimateSoundEffect = "Cortes de bisturí amplificados",
                    specialAbilityName = "Golpes Críticos",
                    specialAbilityDescription = "20% de probabilidad de causar doble daño",
                    ultimateAttackName = "Disección Divina",
                    ultimateAttackDescription = "Serie de cortes precisos que drenan vida"
                },

                new CharacterData
                {
                    characterID = "URIEL",
                    characterName = "URIEL",
                    faction = CharacterFaction.Archangels,
                    description = "Tanque de magma. Lento pero devastador.",
                    baseHealth = 120f,
                    baseDamage = 22f,
                    baseSpeed = 3f,
                    baseDefense = 15f,
                    colorTheme = "Rojo rubí y oro fundido",
                    weaponDescription = "Puños gigantes de magma solidificado",
                    postureDescription = "Stance de luchador pesado, planta firme",
                    visualStyle = "Armadura de placas masiva roja-dorada, grietas con lava, alas de obsidiana, casco con cuernos flamígeros",
                    musicTheme = "Doom Metal lento y pesado",
                    ultimateSoundEffect = "Erupción volcánica",
                    specialAbilityName = "Piel de Roca",
                    specialAbilityDescription = "Reduce daño recibido en 20%",
                    ultimateAttackName = "Puño del Infierno",
                    ultimateAttackDescription = "Golpe de área que causa quemadura continua"
                },

                new CharacterData
                {
                    characterID = "ZADKIEL",
                    characterName = "ZADKIEL",
                    faction = CharacterFaction.Archangels,
                    description = "Mago arcano. Teletransporte y ataques de energía pura.",
                    baseHealth = 80f,
                    baseDamage = 19f,
                    baseSpeed = 6f,
                    baseDefense = 5f,
                    colorTheme = "Violeta y azul eléctrico",
                    weaponDescription = "Esferas de energía en las manos, sin arma física",
                    postureDescription = "Flotando, manos extendidas canalizando energía",
                    visualStyle = "Cuerpo semi-traslúcido, túnicas de energía violeta, halo triple rotatorio, ojos sin pupilas",
                    musicTheme = "Electrónica psicodélica (synthwave oscuro)",
                    ultimateSoundEffect = "Distorsión espacial",
                    specialAbilityName = "Fase",
                    specialAbilityDescription = "Puede esquivar ataques al teletransportarse",
                    ultimateAttackName = "Dimensión del Vacío",
                    ultimateAttackDescription = "Abre portal que arrastra y daña al rival"
                },

                // ========== DEMONIOS ==========
                new CharacterData
                {
                    characterID = "VULDROK",
                    characterName = "VULDROK (Avaricia)",
                    faction = CharacterFaction.Demons,
                    description = "Esqueleto dorado con 4 brazos. Roba vida del rival.",
                    baseHealth = 90f,
                    baseDamage = 16f,
                    baseSpeed = 5f,
                    baseDefense = 8f,
                    colorTheme = "Oro corrupto y negro",
                    weaponDescription = "Bolsa de oro pesada y huesos afilados",
                    postureDescription = "Encorvado, garras extendidas, cadenas de oro arrastrándose",
                    visualStyle = "Esqueleto recubierto de oro, 4 brazos, ojos verdes brillantes, monedas incrustadas en huesos",
                    musicTheme = "Industrial Metal con sonidos de cadenas",
                    ultimateSoundEffect = "Cascada de monedas + grito metálico",
                    specialAbilityName = "Sed de Oro",
                    specialAbilityDescription = "Roba 5% de la vida que causa como daño",
                    ultimateAttackName = "Hambre Eterna",
                    ultimateAttackDescription = "Drena gran cantidad de vida y la convierte en energía"
                },

                new CharacterData
                {
                    characterID = "XYPHORA",
                    characterName = "XYPHORA (Lujuria)",
                    faction = CharacterFaction.Demons,
                    description = "Ser andrógino con látigos de neón. Invierte los controles del rival.",
                    baseHealth = 85f,
                    baseDamage = 14f,
                    baseSpeed = 7f,
                    baseDefense = 7f,
                    colorTheme = "Rosa neón y púrpura oscuro",
                    weaponDescription = "Látigos de energía rosa brillante",
                    postureDescription = "Movimientos sinuosos tipo serpiente, nunca parada",
                    visualStyle = "Cuerpo esbelto andrógino, piel negra brillante, marcas de neón rosa, cola prensil, sin rasgos faciales definidos",
                    musicTheme = "Dark Synthwave sensual",
                    ultimateSoundEffect = "Susurros + chasquido de látigo",
                    specialAbilityName = "Seducción",
                    specialAbilityDescription = "Al golpear, 15% chance de invertir controles 2 segs",
                    ultimateAttackName = "Abrazo del Pecado",
                    ultimateAttackDescription = "Inmoviliza al rival con látigos e invierte controles"
                },

                new CharacterData
                {
                    characterID = "RAGNOR",
                    characterName = "RAGNOR (Ira)",
                    faction = CharacterFaction.Demons,
                    description = "Bestia berserker. Más daño con menos vida.",
                    baseHealth = 110f,
                    baseDamage = 18f,
                    baseSpeed = 6f,
                    baseDefense = 10f,
                    colorTheme = "Rojo sangre y negro carbón",
                    weaponDescription = "Cadenas espinadas envueltas en brazos",
                    postureDescription = "Postura agresiva de gorila, cadenas arrastrándose",
                    visualStyle = "Humanoide bestial musculoso, piel roja, cuernos rotos sangrantes, cicatrices por todo el cuerpo, ojos blancos ciegos",
                    musicTheme = "Death Metal brutal",
                    ultimateSoundEffect = "Rugido bestial + metal retorciéndose",
                    specialAbilityName = "Furia Sangrienta",
                    specialAbilityDescription = "Gana 2% de daño por cada 10% de vida perdida",
                    ultimateAttackName = "Muerte Roja",
                    ultimateAttackDescription = "Combo devastador que aumenta con baja vida"
                },

                new CharacterData
                {
                    characterID = "VORAKH",
                    characterName = "VORAKH (Gula)",
                    faction = CharacterFaction.Demons,
                    description = "Obeso grotesco. Su boca estomacal devora y cura.",
                    baseHealth = 130f,
                    baseDamage = 20f,
                    baseSpeed = 2f,
                    baseDefense = 12f,
                    colorTheme = "Verde pútrido y marrón carne",
                    weaponDescription = "Garras de grasa y boca gigante en estómago",
                    postureDescription = "Tambalea al caminar, boca estomacal siempre abierta",
                    visualStyle = "Criatura obesa sin ojos, boca gigante con dientes en el estómago, piel cubierta de baba, lengua larga",
                    musicTheme = "Drone industrial nauseabundo",
                    ultimateSoundEffect = "Masticación amplificada + eructo",
                    specialAbilityName = "Hambre Insaciable",
                    specialAbilityDescription = "Los agarres curan 15% del daño causado",
                    ultimateAttackName = "Festín",
                    ultimateAttackDescription = "Devora al rival, causando gran daño y curándose"
                },

                new CharacterData
                {
                    characterID = "SKARN",
                    characterName = "SKARN (Envidia)",
                    faction = CharacterFaction.Demons,
                    description = "Hecho de espejos rotos. Copia ataques enemigos.",
                    baseHealth = 85f,
                    baseDamage = 15f,
                    baseSpeed = 6f,
                    baseDefense = 9f,
                    colorTheme = "Plateado reflectante y sombra líquida",
                    weaponDescription = "Fragmentos de espejo afilados flotantes",
                    postureDescription = "Forma humanoide inestable, partes se separan y recomponen",
                    visualStyle = "Cuerpo de cristales de espejo rotos conectados por sombra líquida negra, refleja al rival distorsionado",
                    musicTheme = "Glitch Hop oscuro",
                    ultimateSoundEffect = "Cristales rompiéndose + eco distorsionado",
                    specialAbilityName = "Reflejo Maligno",
                    specialAbilityDescription = "Copia el último ataque especial que recibió",
                    ultimateAttackName = "Espejo del Alma",
                    ultimateAttackDescription = "Copia toda la apariencia y stats del rival temporalmente"
                },

                new CharacterData
                {
                    characterID = "THULGAT",
                    characterName = "THUL-GAT (Pereza)",
                    faction = CharacterFaction.Demons,
                    description = "Flota en trono oxidado. Ralentiza a sus enemigos.",
                    baseHealth = 100f,
                    baseDamage = 16f,
                    baseSpeed = 1f,
                    baseDefense = 14f,
                    colorTheme = "Gris óxido y verde tóxico",
                    weaponDescription = "Drones mecánicos oxidados que atacan por él",
                    postureDescription = "Sentado en trono flotante, apenas se mueve",
                    visualStyle = "Humanoide demacrado en trono mecánico flotante oxidado, tubos conectados al cuerpo, ojos cerrados, drones circulando",
                    musicTheme = "Ambient industrial lento",
                    ultimateSoundEffect = "Maquinaria oxidada + suspiro largo",
                    specialAbilityName = "Aura de Letargo",
                    specialAbilityDescription = "El rival se mueve 10% más lento cerca de él",
                    ultimateAttackName = "Éxtasis del Olvido",
                    ultimateAttackDescription = "Crea campo que ralentiza masivamente y daña con el tiempo"
                },

                // ========== JEFES ==========
                new CharacterData
                {
                    characterID = "LUCIFER",
                    characterName = "LUCIFER (Soberbia)",
                    faction = CharacterFaction.Boss,
                    description = "Ángel caído. Jefe de la ruta de luz.",
                    baseHealth = 200f,
                    baseDamage = 25f,
                    baseSpeed = 7f,
                    baseDefense = 15f,
                    colorTheme = "Oro corrupto y negro abismal",
                    weaponDescription = "Espada de luz corrupta negra con filo dorado",
                    postureDescription = "Postura real arrogante, alas desplegadas dramáticamente",
                    visualStyle = "Ex-arcángel. Armadura dorada oxidada/corrupta, alas negras quemadas pero majestuosas, corona rota, halo invertido",
                    musicTheme = "Coros gregorianos distorsionados + órgano",
                    ultimateSoundEffect = "Voz profunda divina + vacío",
                    specialAbilityName = "Estrella Caída",
                    specialAbilityDescription = "Todos sus stats aumentan en Fase 2",
                    ultimateAttackName = "Rayo del Vacío",
                    ultimateAttackDescription = "Rayo de oscuridad que atraviesa toda la pantalla"
                },

                new CharacterData
                {
                    characterID = "ELOHIM",
                    characterName = "ELOHIM (Dios Supremo)",
                    faction = CharacterFaction.Boss,
                    description = "Entidad final. Jefe de la ruta oscura.",
                    baseHealth = 250f,
                    baseDamage = 30f,
                    baseSpeed = 4f,
                    baseDefense = 20f,
                    colorTheme = "Luz cegadora blanca y geometría sagrada",
                    weaponDescription = "Rayos de luz pura, sin arma física",
                    postureDescription = "Entidad flotante sin forma humana clara",
                    visualStyle = "Geometría sagrada (poliedros, fractales) con luz cegadora, sin rostro, símbolos divinos rotando, ocupa 70% de la pantalla",
                    musicTheme = "Ruido blanco orquestal + gritos angelicales",
                    ultimateSoundEffect = "Palabra divina que rompe audio",
                    specialAbilityName = "Omnipresencia",
                    specialAbilityDescription = "No puede ser agarrado, inmune a ciertos ataques",
                    ultimateAttackName = "Logos",
                    ultimateAttackDescription = "Palabra divina que causa daño absoluto ignorando defensa"
                }
            };
        }
        #endregion

        #region Public Methods
        public CharacterData GetCharacterByID(string id)
        {
            return allCharacters.Find(c => c.characterID == id);
        }

        public List<CharacterData> GetCharactersByFaction(CharacterFaction faction)
        {
            return allCharacters.FindAll(c => c.faction == faction);
        }
        #endregion
    }
}
