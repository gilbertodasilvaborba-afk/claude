#!/usr/bin/env bash
# Feed 4:5 com a foto do menino com o celular (var-03) e 5 variações de gancho.
# Mesmo layout e mesma foto em todas; muda só o título e o bilhete. Uso: bash src/feed-menino.sh
cd "$(dirname "$0")/.."
FOTO=fotos/modelo-02.jpg
gera() { TEXTO="$2" node src/modelo.mjs "$FOTO" "$1" curto 4x5 | tail -1; }

gera feed-menino-01-so-mais-um-video '{"l1":"Cansada de ouvir","l2":"“só mais um","l3":"vídeo”?","icone":{"left":600,"top":250},
 "bilhete":"Na próxima vez, ofereça uma missão! ♡"}'
gera feed-menino-02-quer-saber-de-tela '{"bilhete":"Menos tela, mais brincadeira de verdade! ♡"}'
gera feed-menino-03-birra '{"l1":"Tirou o celular","l2":"e veio a","l3":"birra?","icone":{"left":440,"top":250},
 "bilhete":"Troque a birra por uma missão! ♡"}'
gera feed-menino-04-cabeca-branco '{"l1":"Desligou a tela e","l2":"a cabeça deu","l3":"branco?","icone":false,
 "bilhete":"Tenha 100 missões prontas na mão! ♡"}'
gera feed-menino-05-trocar-por-missao '{"l1":"E se ele trocasse","l2":"o celular por","l3":"uma missão?","s3":100,"icone":false,
 "bilhete":"“Tem uma missão secreta para você!” ♡"}'
gera feed-menino-06-oferta '{"l1":"100 brincadeiras","l2":"sem tela por","l3":"R$ 27,90","s3":132,"icone":false,
 "bilhete":"Garantia de 7 dias e acesso imediato! ♡"}'
