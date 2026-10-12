// Conteúdo dos bônus 3 (guia) e 4 (desafio 30 dias)
export const guiaBirra = {
  intro: 'Tirar a tela é o momento mais difícil do dia para muitas famílias. Este guia reúne o que mais ajuda essa troca a acontecer com menos choro, menos negociação e mais conexão.',
  porque: [
    'Desenhos e jogos são feitos para prender a atenção: cores, sons e recompensas rápidas o tempo todo. Perto disso, qualquer outra coisa parece lenta.',
    'Parar de repente é, para a criança, como ser acordada no meio de um sonho bom. A transição brusca é o que mais gera choro.',
    'A parte do cérebro que controla impulsos e frustrações ainda está se desenvolvendo. A criança está aprendendo a parar, e precisa da sua ajuda para isso.',
  ],
  tempo: [
    'Menores de 2 anos: evitar telas.',
    'De 2 a 5 anos: no máximo 1 hora por dia, sempre com supervisão.',
    'De 6 a 10 anos: de 1 a 2 horas por dia, sempre com supervisão.',
    'Sem telas durante as refeições e de 1 a 2 horas antes de dormir.',
    'Fonte: Sociedade Brasileira de Pediatria, manual "Menos Telas, Mais Saúde" (2019).',
  ],
  ideia: 'Desligar fica muito mais fácil quando existe algo concreto e divertido esperando. O vazio depois da tela é o que transforma a troca em briga. Por isso, tenha a missão escolhida antes de desligar.',
  passos: [
    ['A', 'Avise antes', 'Nada de desligar de surpresa. Avise com 5 minutos e com 1 minuto de antecedência. Um relógio de cozinha ou alarme ajuda: quem "manda desligar" é o relógio, não você.', '"Quando o relógio tocar, a gente desliga e começa a missão."'],
    ['V', 'Valide o sentimento', 'Reconheça que é chato parar. Validar não é ceder: é mostrar que você entende, e isso baixa a defesa da criança.', '"Eu sei, é difícil parar quando está legal."'],
    ['I', 'Instigue com um convite', 'Ofereça a missão como algo especial, com voz de aventura. Leia a frase-convite da missão ou deixe a criança sortear do pote.', '"Chegou uma missão secreta da Central só para você!"'],
    ['S', 'Sustente o combinado', 'Se vier o protesto, não negocie no calor do momento. Repita a mesma frase curta, com calma e voz baixa.', '"Eu entendo. E o combinado era desligar agora."'],
    ['E', 'Elogie a transição', 'Quando a criança conseguir desligar, elogie o esforço de forma específica. Isso reforça o comportamento para a próxima vez.', '"Você desligou quando o relógio tocou. Que orgulho!"'],
  ],
  dica: 'Escolha a missão antes de avisar que a tela vai acabar e deixe os materiais separados. Quando o relógio tocar, a criança já vê a cabana montada ou o papel e o giz na mesa. A curiosidade puxa ela para a brincadeira.',
  evitar: [
    'Ameaças: "Se não desligar agora, vai ficar de castigo." A tela vira prêmio disputado e a missão vira castigo.',
    'Rótulos: "Você só quer saber de celular." A criança passa a acreditar nisso.',
    'Falsos limites: "Só mais um, hein" e depois deixar mais três. A criança aprende que sempre dá para negociar.',
    'Desligar no meio da cena, sem aviso. Espere o fim do episódio ou da fase sempre que possível.',
  ],
  frases: [
    ['Para avisar', 'gold', ['Faltam 5 minutos. Quando o relógio tocar, a gente desliga.', 'Mais este episódio e depois tem missão secreta.', 'Você escolhe: desligamos agora ou daqui a 2 minutos?', 'Quando essa fase terminar, você salva e a gente vai brincar.']],
    ['Para validar', 'lav', ['Eu sei, é difícil parar quando está divertido.', 'Você queria muito continuar, né? Eu entendo.', 'Tudo bem ficar triste com isso. Eu estou aqui.', 'Eu também acho difícil parar o que eu gosto.']],
    ['Para convidar', 'mint', ['Chegou uma missão da Central só para você!', 'Preciso de um agente para uma tarefa muito importante.', 'Você escolhe: Cabana do Explorador ou Mapa do Tesouro?', 'Vamos sortear a missão de hoje no pote?']],
    ['Para elogiar', 'coral', ['Você desligou quando o relógio tocou. Que orgulho!', 'Valeu por cumprir o nosso combinado!', 'Foi difícil e mesmo assim você conseguiu parar.', 'Adorei brincar com você hoje.']],
  ],
  birra: [
    ['🧘', 'Fique calmo primeiro', 'Respire fundo antes de falar. A sua calma é o que ajuda a criança a se acalmar.'],
    ['🤗', 'Fique por perto', 'Diga "Estou aqui" e ofereça um abraço, sem forçar. Garanta que ela esteja em segurança.'],
    ['🔁', 'Não volte atrás', 'Se a tela volta por causa do choro, a criança aprende que chorar funciona. Mantenha o combinado com carinho.'],
    ['🤫', 'Fale pouco', 'No meio da birra, explicações longas não funcionam. Uma frase curta e repetida basta.'],
    ['💬', 'Converse depois', 'Quando tudo passar, conversem: "O que você sentiu? Da próxima vez, o que pode ajudar?"'],
  ],
  profissional: 'Se as crises forem muito frequentes ou intensas, se a criança se machucar ou machucar outras pessoas, ou se o uso de telas estiver atrapalhando o sono, a alimentação ou a escola, converse com o pediatra. Este material traz ideias de brincadeiras e não substitui a orientação de um profissional de saúde.',
  combinados: ['Podemos usar telas nestes dias e horários:', 'Por quanto tempo:', 'Em quais lugares da casa:', 'Nunca usamos telas durante:', 'Antes de desligar, a gente:', 'Depois da tela, a gente:', 'Quando cumprimos o combinado:'],
};

// Uma missão por dia; null = dia livre (sortear do pote)
export const desafio30 = [18, 48, 5, 58, 40, null, 35, 14, 29, 46, 25, 43, null, 13, 24, 21, 63, 49, 67, null, 47, 60, 65, 93, 10, null, 1, 36, 4, 100];

export const recompensas = [
  ['⭐', 'Dia 7', 'A criança escolhe o cardápio do jantar.', 'gold'],
  ['🏕️', 'Dia 15', 'Noite de acampamento na sala, com cabana e lanterna.', 'lav'],
  ['🏆', 'Dia 30', 'Piquenique especial e entrega do Certificado de Agente.', 'mint'],
];
