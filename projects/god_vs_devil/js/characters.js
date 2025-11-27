export const CHARACTERS = {
    ANGELS: [
        {
            name: "MIGUEL",
            id: "miguel",
            color: "#0077ff",
            title: "El Líder",
            ray: "Rayo Azul",
            visual: "Armadura completa de platino y zafiro que emite un pulso azul. Alas blancas enormes con puntas metálicas.",
            weapon: "Gran espada flamígera azul a dos manos. Postura de combate firme y equilibrada (estilo caballero).",
            music: "Metal sinfónico rápido con trompetas heroicas y doble bombo.",
            stats: { speed: 8, power: 8, defense: 8, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "JOFIEL",
            id: "jofiel",
            color: "#ffd700",
            title: "Sabiduría",
            ray: "Rayo Amarillo",
            visual: "Túnicas doradas blindadas que flotan. Su cabeza está rodeada por un halo de luz intensa que oculta sus ojos.",
            weapon: "Báculo largo con un sol en la punta. Postura levitando ligeramente del suelo, báculo en guardia.",
            music: "Melodía orquestal majestuosa, uso intensivo de campanas tubulares y arpas.",
            stats: { speed: 7, power: 9, defense: 6, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "CHAMUEL",
            id: "chamuel",
            color: "#ff69b4",
            title: "Fuerza del Amor",
            ray: "Rayo Rosa",
            visual: "Armadura ligera y ajustada de color cuarzo rosa y plata. Físico muy atlético, diseñado para la velocidad. Alas más cortas y rápidas.",
            weapon: "Guanteletes de energía rosa en sus puños. Postura de kickboxing, en constante movimiento.",
            music: "Ritmo electrónico acelerado (Drum & Bass) mezclado con coros femeninos etéreos.",
            stats: { speed: 10, power: 6, defense: 7, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "GABRIEL",
            id: "gabriel",
            color: "#ffffff",
            title: "El Mensajero",
            ray: "Rayo Blanco",
            visual: "Armadura de mármol blanco pulido y nácar. Aspecto andrógino y puro.",
            weapon: "Una trompeta larga plateada que usa como arma sónica y contundente. Postura elegante, una mano en la cadera, la otra con la trompeta.",
            music: "Fanfarria solemne y potente que se rompe en ritmos de percusión militar intensos.",
            stats: { speed: 9, power: 7, defense: 7, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "RAFAEL",
            id: "rafael",
            color: "#00ff00",
            title: "Sanación",
            ray: "Rayo Verde",
            visual: "Túnica blindada verde esmeralda con viales de líquido brillante integrados en el diseño. Capucha que cubre parcialmente su rostro.",
            weapon: "Dos dagas curvas de energía verde (estilo quirúrgico). Postura baja de asesino, listo para emboscar.",
            music: "Música ambiental tensa con sonidos de \"latidos de corazón\" y sintetizadores líquidos.",
            stats: { speed: 8, power: 6, defense: 9, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "URIEL",
            id: "uriel",
            color: "#ff4500",
            title: "Fuego Divino",
            ray: "Rayo Rubí",
            visual: "Armadura masiva y pesada de oro rojo y rubí que parece magma solidificado. Muy alto y ancho.",
            weapon: "Sus propios puños envueltos en fuego sagrado. Postura inmóvil, pesada, como una estatua a punto de cobrar vida.",
            music: "Metal industrial lento y pesado (Doom Metal), con sonidos de yunques y fuego crepitante.",
            stats: { speed: 5, power: 10, defense: 10, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "ZADKIEL",
            id: "zadkiel",
            color: "#8a2be2",
            title: "Transmutación",
            ray: "Rayo Violeta",
            visual: "Armadura de amatista cristalina que refracta la luz. Su cuerpo parece estar en fase, medio transparente a veces.",
            weapon: "Orbes de energía violeta que flotan alrededor de sus manos. Postura mística, manos haciendo gestos arcanos.",
            music: "Música electrónica experimental y psicodélica con cánticos procesados con efectos de eco.",
            stats: { speed: 9, power: 8, defense: 6, level: 1, xp: 0, skillPoints: 0 }
        }
    ],
    DEMONS: [
        {
            name: "VULDROK",
            id: "vuldrok",
            color: "#daa520",
            title: "Avaricia",
            sin: "Codicia",
            visual: "Esqueleto cubierto de piel dorada fundida y monedas incrustadas en su carne. Tiene cuatro brazos delgados, dedos largos como garras. Lleva una corona rota.",
            weapon: "Sus garras y una bolsa pesada llena de almas/oro que usa como mazo. Postura encorvada, protegiendo su \"tesoro\".",
            music: "Sonidos metálicos de monedas cayendo mezclados con un bajo funk oscuro y sucio.",
            stats: { speed: 7, power: 7, defense: 9, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "XYPHORA",
            id: "xyphora",
            color: "#ff1493",
            title: "Lujuria",
            sin: "Deseo",
            visual: "Demonio andrógino de piel morada brillante y cuero negro ajustado. Movimientos serpenteantes y antinaturales. Rostro cubierto por una máscara de placer/dolor.",
            weapon: "Látigos de energía de neón rosa que salen de sus muñecas. Postura seductora pero amenazante, caderas desplazadas.",
            music: "Techno oscuro y pulsante con gemidos y suspiros procesados como instrumentos de percusión.",
            stats: { speed: 10, power: 6, defense: 5, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "RAGNOR",
            id: "ragnor",
            color: "#8b0000",
            title: "Ira",
            sin: "Furia",
            visual: "Berserker masivo de piel roja volcánica, músculos desgarrados y cuernos rotos. Tiene cadenas de hierro clavadas en su propia carne. Echa humo por la nariz.",
            weapon: "Sus puños gigantes y cabezazos. Postura agresiva, inclinado hacia adelante, respirando pesadamente, listo para cargar.",
            music: "Thrash metal puro, extremadamente rápido, guitarras distorsionadas y gritos guturales constantes.",
            stats: { speed: 9, power: 9, defense: 4, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "VORAKH",
            id: "vorakh",
            color: "#808080",
            title: "Gula",
            sin: "Voracidad",
            visual: "Enormemente obeso, piel pálida y húmeda con manchas de moho. Su característica principal es una boca vertical gigante en su estómago llena de dientes de tiburón.",
            weapon: "Usa su peso corporal y agarres para comer al oponente. Postura inestable, tambaleándose, babeando.",
            music: "Sonidos de gorgoteos, masticación y bajos profundos y nauseabundos. Ritmo lento y pesado.",
            stats: { speed: 4, power: 9, defense: 10, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "SKARN",
            id: "skarn",
            color: "#556b2f",
            title: "Envidia",
            sin: "Celos",
            visual: "Criatura hecha de fragmentos de espejo roto y sombras líquidas verdosas. No tiene rostro fijo, refleja distorsionadamente al oponente.",
            weapon: "Puede transformar sus extremidades en púas de vidrio. Postura imitativa, copia sutilmente la postura del rival.",
            music: "Música disonante, sonidos de cristal rompiéndose y melodías que parecen estar \"al revés\".",
            stats: { speed: 8, power: 7, defense: 8, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "THUL-GAT",
            id: "thul_gat",
            color: "#2f4f4f",
            title: "Pereza",
            sin: "Apatía",
            visual: "Un cuerpo atrofiado y pálido conectado permanentemente a un tronto mecánico oxidado con patas de araña que se mueve por él. Sus ojos están siempre medio cerrados.",
            weapon: "Invocaciones de pequeños demonios y ataques a distancia desde el trono. Postura sentada, apática, manejando controles con desgana.",
            music: "Ambient drone muy lento, casi sin ritmo, con sonidos de maquinaria vieja chirriando.",
            stats: { speed: 3, power: 10, defense: 8, level: 1, xp: 0, skillPoints: 0 }
        },
        {
            name: "LUCIFER",
            id: "lucifer_fallen",
            color: "#000000",
            title: "Soberbia",
            sin: "Orgullo",
            visual: "Ángel caído definitivo. Hermoso pero aterrador. Armadura negra carbón con grietas por donde sale luz roja corrupta. Posee 6 alas negras quemadas.",
            weapon: "Flota ligeramente sobre el suelo con los brazos cruzados, mirando al oponente con desprecio. Solo descruza los brazos para atacar.",
            music: "Fusión épica de Coros Gregorianos oscuros y Black Metal sinfónico. Órgono de iglesia distorsionado.",
            stats: { speed: 9, power: 10, defense: 7, level: 1, xp: 0, skillPoints: 0 }
        }
    ],
    BOSSES: {
        GOD: {
            name: "ELOHIM",
            id: "god",
            color: "#ffffff",
            title: "DIOS SUPREMO",
            visual: "Entidad de luz blanca cegadora y geometría sagrada imposible (anillos concéntricos, ojos con alas). Ocupa gran parte de la pantalla.",
            weapon: "Estática en el centro, irradiando poder. Sus ataques surgen de todas partes.",
            music: "Ruido blanco orquestal abrumador. Voces angelicales agudas que casi duelen al oído, sin ritmo discernible.",
            stats: { speed: 12, power: 12, defense: 12 }
        },
        LUCIFER: {
            name: "LUCIFER",
            id: "lucifer_boss",
            color: "#ff0000",
            title: "EL CAÍDO",
            visual: "Ángel caído definitivo, armadura negra carbón con grietas y luz roja corrupta. 6 alas negras quemadas.",
            weapon: "Flota ligeramente, brazos cruzados, ataques devastadores de pantalla completa.",
            music: "Fusión épica de Coros Gregorianos oscuros y Black Metal sinfónico. Órgano distorsionado.",
            stats: { speed: 11, power: 11, defense: 11 }
        }
    }
};
