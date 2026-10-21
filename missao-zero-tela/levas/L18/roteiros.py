"""Roteiros da L18 (México, fe y familia): 5 criativos no modelo do L12V1, cenas Mixkit."""
import json
V = [
 dict(tecnica="Nostalgia y familia", titulo=["¿Y NUESTROS", "NIÑOS?"],
  gancho=[("Antes los niños crecían jugando en el patio", [84], ""), ("y escuchando historias de la abuela.", [75], ""), ("¿Y los nuestros?", [85], "")],
  corpo=[("Hoy el celular hace de niñera.", [2], ""), ("Llegas cansada, el día no alcanza,", [49], ""), ("y la pantalla parece la única salida.", [4], ""),
         ("Pero en la noche, mamá... ¿no te pesa el corazón?", [45], "pergunta"),
         ("Por eso creamos Misión Cero Pantallas:", [88], "virada"),
         ("cien misiones para jugar en familia,", [36], ""), ("con lo que tienes en casa,", [25], ""),
         ("y con historias de la Biblia que enseñan valores mientras se divierten.", [74], "")]),
 dict(tecnica="La fe", titulo=["¿VIDEOS O", "LA BIBLIA?"],
  gancho=[("Tu hijo se sabe de memoria los videos del celular...", [1], ""), ("¿y cuántas historias de la Biblia conoce?", [72], "")],
  corpo=[("Y no es tu culpa: esos videos están hechos para atraparlos.", [57], ""),
         ("Pero cuando lo ves tan pegado, mamá... ¿no te preguntas qué valores está aprendiendo?", [3], "pergunta"),
         ("Por eso creamos Misión Cero Pantallas.", [88], "virada"),
         ("Cada misión es un juego con una historia de la Biblia:", [82], ""),
         ("construir el arca de Noé,", [33], ""), ("ser valiente como David,", [84], ""), ("ayudar como el buen samaritano.", [52], ""),
         ("Fe y diversión, sin pantallas.", [66], "")]),
 dict(tecnica="La noche", titulo=["10 DE LA NOCHE", "Y EN LA TABLETA"],
  gancho=[("Son las diez de la noche y tu chiquito sigue pegado a la tableta.", [5], "")],
  corpo=[("Le pides que la apague y empieza el berrinche.", [12], ""), ("Tú cedes, porque ya no puedes más.", [50], ""),
         ("Pero cuando por fin se duerme, mamá... ¿no te queda esa culpa?", [45], "pergunta"),
         ("Por eso creamos Misión Cero Pantallas:", [88], "virada"),
         ("misiones cortitas para hacer juntos antes de dormir,", [53], ""), ("con una historia de la Biblia", [73], ""),
         ("y una oración sencilla.", [68], ""), ("La noche termina con abrazo, no con pleito.", [43], "")]),
 dict(tecnica="El deseo", titulo=["EL ARCA DE NOÉ", "CON UNA CAJA"],
  gancho=[("Imagina a tu hijo construyendo el Arca de Noé con una caja,", [89], ""), ("en lugar de ver la tableta.", [7], "")],
  corpo=[("Hoy parece imposible, lo sé.", [47], ""), ("La pantalla lo atrapa", [57], ""), ("y tú ya no tienes energía.", [21], ""),
         ("Y cuando llora, mamá... ¿no te dan ganas de rendirte?", [18], "pergunta"),
         ("Por eso creamos Misión Cero Pantallas:", [88], "virada"),
         ("cien misiones con cajas, sábanas, papel y colores,", [30], ""), ("inspiradas en historias de la Biblia.", [74], ""),
         ("Él se convierte en el héroe,", [31], ""), ("y tú en su compañera de aventura.", [36], "")]),
 dict(tecnica="La promesa", titulo=["CON FE Y", "SIN PANTALLAS"],
  gancho=[("Criar hijos con fe en un mundo lleno de pantallas", [71], ""), ("sí es posible. Mira cómo.", [83], "")],
  corpo=[("Lo que siembras hoy, él lo cosecha mañana.", [76], ""), ("Pero entre el trabajo y la casa,", [48], ""), ("la tableta siempre gana.", [85], ""),
         ("Y en la noche, mamá... ¿no te queda esa culpa?", [14], "pergunta"),
         ("Por eso creamos Misión Cero Pantallas:", [88], "virada"),
         ("juegos con lo que tienes en casa,", [56], ""), ("historias de la Biblia", [72], ""), ("y valores para toda la vida.", [78], ""),
         ("Unos minutos al día, y tu casa cambia.", [65], "")]),
]
for v in V:
    ns = [n for _, c, _ in v["gancho"] + v["corpo"] for n in c]
    assert len(ns) == len(set(ns)), (v["tecnica"], ns)
item = lambda tr: [{"texto": t, "cena": c, **({"marca": m} if m else {})} for t, c, m in tr]
cfg = {"leva": "L18", "produto": "Misión Cero Pantallas", "cta_tela": "TOCA EN MÁS INFO",
       "voz": {"id": "edge:es-MX-DaliaNeural", "velocidade": 1.0},
       "legenda_estilo": "amarela", "legenda_posicao": "meio", "musica": "",
       "ganchos": [{"titulo": v["titulo"], "fala": " ".join(t for t, *_ in v["gancho"]), "corte_max": 99, "roteiro": item(v["gancho"]), "tecnica": v["tecnica"]} for v in V],
       "corpos": [{"fala": " ".join(t for t, *_ in v["corpo"]), "corte_max": 99, "roteiro": item(v["corpo"])} for v in V],
       "cta": {"fala": "Toca en más información y conoce las misiones."},
       "cenas": {"excluir": [n for n in range(1, 90) if n not in (8, 9, 80)]}}
json.dump(cfg, open("L18/leva.json", "w"), ensure_ascii=False, indent=1)
print("ok")
