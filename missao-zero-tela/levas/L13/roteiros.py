"""Roteiros da L13: 5 variações no formato do L12 (tensão até a virada, alívio depois).
Cada trecho: (texto, cenas, marca) com marca "pergunta" (tom sobe na última palavra) ou "virada" (troca a música)."""
import json
V = [
 # 1. PAS (Problema, Agitação, Solução) com quebra de padrão
 dict(tecnica="PAS com quebra de padrão", titulo=["SEU FILHO CHORA", "QUANDO TIRA A TELA?"],
  gancho=[("Mãe, se o seu filho chora", [5], ""), ("toda vez que você tira o celular,", [4], ""), ("presta atenção nisso.", [8], "")],
  corpo=[("Não é birra à toa.", [9], ""),
         ("Desenho e joguinho são feitos pra prender a atenção,", [6], ""),
         ("e perto deles qualquer outra coisa parece sem graça.", [53], ""),
         ("Aí você cede,", [1], ""), ("porque está exausta.", [3], ""),
         ("Mas no fim do dia, mãezinha... você não fica com aquela culpa?", [61], "pergunta"),
         ("Foi por isso que criamos o Missão Zero Tela.", [34], "virada"),
         ("Em vez de só tirar a tela, você oferece uma missão.", [10], ""),
         ("São cem historinhas", [37], ""), ("em que o seu filho é o herói,", [29], ""), ("com o que você já tem em casa.", [17], ""),
         ("E a hora de desligar deixa de ser briga", [22], ""), ("e vira aventura.", [28], "")]),
 # 2. Storytelling (cena do dia a dia na segunda pessoa) e contraste antes/depois
 dict(tecnica="Storytelling com antes e depois", titulo=["SEIS DA TARDE.", "VOCÊ CONHECE ESSA CENA"],
  gancho=[("Seis da tarde. Você chega cansada,", [3], ""), ("e ele já está com o celular na mão.", [1], "")],
  corpo=[("Ainda tem o jantar, a casa, mil coisas pra fazer.", [48], ""),
         ("Então você deixa. Só mais um pouquinho.", [6], ""),
         ("Quando vê, já passaram duas horas.", [6], ""),
         ("E na hora de dormir, mãezinha... não bate aquela culpa?", [61], "pergunta"),
         ("Agora imagina outra cena.", [28], "virada"),
         ("Seis da tarde, e ele vem correndo:", [47], ""), ("mãe, qual é a missão de hoje?", [10], ""),
         ("Ele monta um foguete de papelão", [32], ""), ("enquanto você faz o jantar.", [29], ""),
         ("Isso é o Missão Zero Tela:", [34], ""), ("cem missões prontas", [37], ""),
         ("pra trocar a tela por brincadeira de verdade.", [21], "")]),
 # 3. Mecanismo único com nome próprio (como fazer X sem Y)
 dict(tecnica="Mecanismo único com nome", titulo=["O TRUQUE DAS", "HISTORINHAS-MISSÃO"],
  gancho=[("O truque das historinhas-missão:", [35], ""), ("como fazer seu filho largar a tela", [1], ""), ("sem precisar brigar.", [2], "")],
  corpo=[("Toda mãe já tentou tirar o celular na marra.", [4], ""),
         ("E toda mãe sabe como termina:", [8], ""), ("choro, grito e negociação.", [5, 9], ""),
         ("E depois, mãezinha... você não fica com aquela culpa?", [61], "pergunta"),
         ("O truque é não tirar a tela. É trocar por uma missão.", [10], "virada"),
         ("Você lê um convite curtinho: agente, a cidade sumiu, e só você pode construir uma nova.", [38], ""),
         ("Pronto. Ele aceita a missão", [30], ""), ("e vai brincar com papel,", [15], ""), ("giz", [16], ""), ("e caixa.", [17], ""),
         ("São cem missões assim no Missão Zero Tela,", [37], ""), ("pra crianças de três a oito anos.", [22], "")]),
 # 4. Tirar a culpa e apontar o inimigo comum
 dict(tecnica="Tirar a culpa e apontar o inimigo", titulo=["NÃO É CULPA", "SUA, MÃE"],
  gancho=[("Não é culpa sua", [3], ""), ("que o seu filho não larga o celular.", [1], "")],
  corpo=[("Os desenhos e joguinhos são feitos pra prender a atenção dele.", [6], ""),
         ("Cores, sons e recompensa o tempo todo.", [6], ""),
         ("Perto disso, qualquer brinquedo parece sem graça.", [53], ""),
         ("Mas mesmo assim, mãezinha... você não sente aquela culpa no fim do dia?", [61], "pergunta"),
         ("A saída não é brigar com a tela.", [10], "virada"), ("É dar pra ele algo mais emocionante.", [28], ""),
         ("Uma missão secreta,", [29], ""), ("em que ele é o herói da história.", [30], ""),
         ("No Missão Zero Tela são cem missões assim,", [34], ""), ("com o que você já tem em casa.", [17], ""),
         ("E você deixa de ser a mãe que só diz não.", [14], "")]),
 # 5. Projeção do futuro e identidade
 dict(tecnica="Projeção do futuro e identidade", titulo=["DO QUE ELE", "VAI LEMBRAR?"],
  gancho=[("Daqui a vinte anos, do que o seu filho vai lembrar?", [27], ""), ("Do celular,", [1], ""), ("ou de você?", [13], "")],
  corpo=[("Hoje a rotina é corrida, eu sei.", [48], ""),
         ("E o celular vira a babá mais fácil da casa.", [6], ""),
         ("Mas quando ele dorme, mãezinha... não fica aquela culpa no peito?", [3], "pergunta"),
         ("Foi pra essas mães que criamos o Missão Zero Tela.", [34], "virada"),
         ("Cem missões rápidas pra fazer junto,", [11], ""), ("com papel,", [15], ""), ("giz,", [16], ""), ("caixa", [17], ""), ("e lençol.", [18], ""),
         ("Cinco minutos pra começar,", [10], ""), ("e uma memória que ele vai levar pra vida.", [14], ""),
         ("Porque infância boa não se assiste.", [22], ""), ("Se vive.", [23], "")]),
]
for v in V:
    ns = [n for _, c, _ in v["gancho"] + v["corpo"] for n in c]
    seq = [n for i, n in enumerate(ns) if i == 0 or n != ns[i - 1]]
    assert len(seq) == len(set(seq)), (v["tecnica"], ns)
    assert sum(m == "virada" for *_, m in v["corpo"]) == 1 and sum(m == "pergunta" for *_, m in v["corpo"]) == 1
item = lambda tr: [{"texto": t, "cena": c, **({"marca": m} if m else {})} for t, c, m in tr]
cfg = {"leva": "L13", "produto": "Missão Zero Tela", "cta_tela": "VEJA COMO FUNCIONA",
       "voz": {"id": "edge:pt-BR-ThalitaMultilingualNeural", "velocidade": 1.05},
       "legenda_estilo": "amarela", "legenda_posicao": "meio", "musica": "",
       "ganchos": [{"titulo": v["titulo"], "fala": " ".join(t for t, *_ in v["gancho"]), "corte_max": 99, "roteiro": item(v["gancho"]), "tecnica": v["tecnica"]} for v in V],
       "corpos": [{"fala": " ".join(t for t, *_ in v["corpo"]), "corte_max": 99, "roteiro": item(v["corpo"])} for v in V],
       "cta": {"fala": "Toque em saiba mais e veja como funciona."},
       "cenas": {"excluir": [n for n in range(1, 67) if n not in (25, 26, 33)]}}
json.dump(cfg, open("L13/leva.json", "w"), ensure_ascii=False, indent=1)
print("ok")
