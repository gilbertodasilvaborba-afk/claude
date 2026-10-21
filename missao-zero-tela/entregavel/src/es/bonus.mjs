// Contenido de los bonos 3 (guía) y 4 (reto de 30 días), edición en español
export const guiaBirra = {
  intro: 'Quitar la pantalla es el momento más difícil del día para muchas familias. Esta guía reúne lo que más ayuda a que ese cambio suceda con menos llanto, menos negociación y más conexión.',
  porque: [
    'Las caricaturas y los juegos están hechos para atrapar la atención: colores, sonidos y recompensas rápidas todo el tiempo. Junto a eso, cualquier otra cosa parece lenta.',
    'Para el niño, parar de golpe es como despertar en medio de un sueño bonito. La transición brusca es lo que más provoca llanto.',
    'La parte del cerebro que controla los impulsos y la frustración todavía se está desarrollando. El niño está aprendiendo a parar y necesita tu ayuda para lograrlo.',
  ],
  tempo: [
    'Menores de 2 años: evitar las pantallas.',
    'De 2 a 5 años: máximo 1 hora al día, siempre con supervisión.',
    'De 6 a 10 años: de 1 a 2 horas al día, siempre con supervisión.',
    'Sin pantallas durante las comidas ni de 1 a 2 horas antes de dormir.',
    'Fuente: Sociedad Brasileña de Pediatría, manual "Menos pantallas, más salud" (2019). Las recomendaciones de la OMS (2019) para menores de 5 años van en la misma línea.',
  ],
  ideia: 'Apagar es mucho más fácil cuando hay algo concreto y divertido esperando. El vacío después de la pantalla es lo que convierte el cambio en pelea. Por eso, ten la misión elegida antes de apagar.',
  passos: [
    ['A', 'Avisa antes', 'Nada de apagar por sorpresa. Avisa con 5 minutos y con 1 minuto de anticipación. Un reloj de cocina o una alarma ayudan: quien "manda apagar" es el reloj, no tú.', '"Cuando suene el reloj, apagamos y empezamos la misión."'],
    ['V', 'Valida lo que siente', 'Reconoce que es aburrido parar. Validar no es ceder: es mostrar que entiendes, y eso baja la defensa del niño.', '"Lo sé, es difícil parar cuando está divertido."'],
    ['I', 'Invita con una aventura', 'Ofrece la misión como algo especial, con voz de aventura. Lee la frase-invitación de la misión o deja que el niño la saque del frasco.', '"¡Llegó una misión secreta de la Central solo para ti!"'],
    ['S', 'Sostén el acuerdo', 'Si llega la protesta, no negocies en caliente. Repite la misma frase corta, con calma y en voz baja.', '"Te entiendo. Y el acuerdo era apagar ahora."'],
    ['E', 'Elogia la transición', 'Cuando el niño logre apagar, elogia su esfuerzo de forma específica. Eso refuerza la conducta para la próxima vez.', '"Apagaste cuando sonó el reloj. ¡Qué orgullo!"'],
  ],
  dica: 'Elige la misión antes de avisar que la pantalla se va a acabar y deja los materiales listos. Cuando suene el reloj, el niño ya ve la cabaña armada o el papel y los crayones en la mesa. La curiosidad lo lleva al juego.',
  evitar: [
    'Amenazas: "Si no apagas ahora, te castigo." La pantalla se vuelve un premio disputado y la misión se vuelve castigo.',
    'Etiquetas: "Tú solo quieres celular." El niño termina creyéndolo.',
    'Falsos límites: "Solo uno más, ¿eh?" y después dejar tres más. El niño aprende que siempre se puede negociar.',
    'Apagar en medio de la escena, sin aviso. Espera al final del episodio o del nivel siempre que se pueda.',
  ],
  frases: [
    ['Para avisar', 'gold', ['Faltan 5 minutos. Cuando suene el reloj, apagamos.', 'Este episodio y después hay misión secreta.', 'Tú eliges: ¿apagamos ahora o en 2 minutos?', 'Cuando termine este nivel, guardas y nos vamos a jugar.']],
    ['Para validar', 'lav', ['Lo sé, es difícil parar cuando está divertido.', 'Tenías muchas ganas de seguir, ¿verdad? Te entiendo.', 'Está bien sentirse triste por eso. Aquí estoy.', 'A mí también me cuesta dejar lo que me gusta.']],
    ['Para invitar', 'mint', ['¡Llegó una misión de la Central solo para ti!', 'Necesito un agente para una tarea muy importante.', 'Tú eliges: ¿Cabaña del Explorador o Mapa del Tesoro?', '¿Sacamos la misión de hoy del frasco?']],
    ['Para elogiar', 'coral', ['Apagaste cuando sonó el reloj. ¡Qué orgullo!', '¡Gracias por cumplir nuestro acuerdo!', 'Fue difícil y aun así lograste parar.', 'Me encantó jugar contigo hoy.']],
  ],
  birra: [
    ['🧘', 'Mantén la calma primero', 'Respira hondo antes de hablar. Tu calma es lo que ayuda al niño a calmarse.'],
    ['🤗', 'Quédate cerca', 'Di "Aquí estoy" y ofrece un abrazo, sin forzar. Asegúrate de que esté a salvo.'],
    ['🔁', 'No te eches para atrás', 'Si la pantalla vuelve por el llanto, el niño aprende que llorar funciona. Mantén el acuerdo con cariño.'],
    ['🤫', 'Habla poco', 'En pleno berrinche, las explicaciones largas no sirven. Basta una frase corta y repetida.'],
    ['💬', 'Platiquen después', 'Cuando todo pase, platiquen: "¿Qué sentiste? La próxima vez, ¿qué te puede ayudar?"'],
  ],
  profissional: 'Si las crisis son muy frecuentes o intensas, si el niño se lastima o lastima a otros, o si el uso de pantallas está afectando el sueño, la alimentación o la escuela, habla con el pediatra. Este material ofrece ideas de juegos y no sustituye la orientación de un profesional de la salud.',
  combinados: ['Podemos usar pantallas estos días y horarios:', 'Por cuánto tiempo:', 'En qué lugares de la casa:', 'Nunca usamos pantallas durante:', 'Antes de apagar, nosotros:', 'Después de la pantalla, nosotros:', 'Cuando cumplimos el acuerdo:'],
};

// Una misión por día; null = día libre (sacar del frasco)
export const desafio30 = [18, 48, 5, 58, 40, null, 35, 14, 29, 46, 25, 43, null, 13, 24, 21, 63, 49, 67, null, 47, 60, 65, 93, 10, null, 1, 36, 4, 100];

export const recompensas = [
  ['⭐', 'Día 7', 'El niño elige el menú de la cena.', 'gold'],
  ['🏕️', 'Día 15', 'Noche de campamento en la sala, con cabaña y linterna.', 'lav'],
  ['🏆', 'Día 30', 'Pícnic especial y entrega del Certificado de Agente.', 'mint'],
];
