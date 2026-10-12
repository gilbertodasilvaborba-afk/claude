# Criativo L5 com imagens reais

Mesmo roteiro, voz e legenda do L5V1. Três versões:

| Versão | Imagens | Comando |
|---|---|---|
| L5V1 | ilustrações (pronta) | `python3 src/criativo-l5/build.py` |
| L5V2-pexels | fotos de banco Pexels (uso comercial liberado) | `python3 src/criativo-l5/fotos.py pexels` e depois `python3 src/criativo-l5/build.py pexels` |
| L5V3-ia | imagens geradas por IA | `python3 src/criativo-l5/fotos.py ia` e depois `python3 src/criativo-l5/build.py ia` |

Chaves (variáveis de ambiente da sessão, nunca no chat): `PEXELS_API_KEY`; para IA, `REPLICATE_API_TOKEN` (Flux 1.1 Pro) ou `OPENAI_API_KEY` (gpt-image-1).

No Pexels, cada cena baixa até 6 candidatas e a escolhida fica em `videos/criativos/L5/_trab/fotos/pexels/escolhas.json`.

## Gerar as imagens por fora

Se preferir gerar em outra ferramenta (Midjourney, ChatGPT, Gemini…), use os prompts abaixo em formato **vertical 9:16** e salve cada imagem com o nome da cena (`choro-noite.jpg` etc.). Depois me envie os arquivos.

Estilo para acrescentar no fim de todos os prompts: *photorealistic, cinematic warm lighting, shallow depth of field, cozy Brazilian family home, natural candid moment, 35mm photo, vertical 9:16 composition, no text, no watermark*

### choro-noite.jpg
Frase: Gancho: "Se o seu filho chora toda vez que você tira a chupeta…"

> a 3-year-old toddler sitting in bed at night crying and reaching out with one arm, dim warm night lamp, messy blanket, emotional close-up

### quarto-noite.jpg
Frase: "Antes, a noite aqui era sempre igual."

> a child's bedroom at night, small crib bed, soft warm night lamp, moonlight through the window, quiet and calm

### acorda-chorando.jpg
Frase: "…ele acordava chorando às três da manhã"

> a toddler waking up crying in the middle of the night, a digital alarm clock on the nightstand showing 3:12 in red, dark room lit by a small lamp

### mae-cansada.jpg
Frase: "…morta de cansaço, acabava devolvendo."

> an exhausted young mother sitting on the edge of a toddler bed at 3am, hand on her forehead, messy hair, dim light from the hallway, tired and resigned

### pede-chupeta.jpg
Frase: "Durante o dia, era me dá a chupeta toda hora."

> a toddler pulling his mother's shirt asking for something in a bright living room during the day, mother looking tired, natural light

### culpa.jpg
Frase: "E no fim do dia vinha a culpa."

> a young mother alone in a dim kitchen at night, leaning on the counter with her hand on her chin, thoughtful and guilty expression, warm practical lights

### chupeta-close.jpg
Frase: "…a chupeta usada por muito tempo…"

> close-up of a baby pacifier on a soft white blanket, morning light, minimal, shallow depth of field

### dentista.jpg
Frase: "…pode mexer nos dentinhos…"

> a friendly pediatric dentist gently looking at a smiling 3-year-old's teeth with a small mirror, bright colorful clinic, mother holding the child's hand

### janela-tchau.jpg
Frase: "Ele ensina a criança a se despedir dela."

> a mother kneeling next to her toddler at a bedroom window at night, both waving goodbye to the full moon, view from behind, magical warm and blue light

### leitura.jpg
Frase: "Tudo começa com uma historinha antes de dormir."

> a mother reading a colorful picture book to her toddler in bed, warm bedside lamp, child smiling and pointing at the page, cozy blanket

### desenho.jpg
Frase: "Ela escolhe o dia, faz um desenho…"

> a toddler drawing with crayons at a small table, mother beside him smiling, colorful paper, soft daylight

### caixinha.jpg
Frase: "…coloca a chupeta na caixinha e dá tchau."

> small child hands placing a pacifier inside a little decorated gift box with a ribbon, close-up, warm light, tender moment

### dormindo.jpg
Frase: "…ele dormindo tranquilo…"

> a toddler sleeping peacefully in bed hugging a teddy bear, no pacifier, soft moonlight, calm and serene

### abraco.jpg
Frase: "E você terminando o dia sem briga e sem culpa." (também é o fundo da tela final)

> a happy mother hugging her toddler and smiling, warm golden morning light in a cozy bedroom, joyful and relieved
