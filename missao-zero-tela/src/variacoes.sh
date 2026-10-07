#!/usr/bin/env bash
# 5 variações do criativo 9:16: mesmo layout, mesma lista e mesmo mockup; muda o ângulo
# (título, apoio e bilhete) e a foto, escolhida para combinar com o ângulo.
# Uso: bash src/variacoes.sh [formato] (com FOTO_UNICA=1, todas usam a mesma foto: teste só de copy)
cd "$(dirname "$0")/.."
FMT="${1:-9x16-completo}"
FOTO=fotos/modelo-02.jpg
foto() { [ -n "$FOTO_UNICA" ] && echo "$FOTO" || echo "$1"; }
gera() { TEXTO="$2" node src/modelo.mjs "${3:-$FOTO}" "$1-$FMT" curto "$FMT" | tail -1; }

# 1. A cena da birra
gera var-01-birra '{"l1":"Tirou o celular","l2":"e veio a","l3":"birra?","icone":{"left":440,"top":250},
 "apoio1":"Não é falta de pulso!","apoio2":"Na hora de desligar, <i>falta o que oferecer no lugar.</i>",
 "apoio3":"Ofereça uma missão!","bilhete":"Troque a birra por uma missão! ♡",
 "bilheteBaixo":true,"foto":{"size":"auto 125%","pos":"-59px 0"},
 "fade":"#FBF7F0 0%,rgba(251,247,240,.92) 24%,rgba(251,247,240,0) 40%"}' "$(foto fotos/var-01.jpg)"

# 2. A crença errada
gera var-02-nao-e-a-tela '{"l1":"O problema não é a tela.","s1":54,"l2":"É o vazio","l3":"de ideias.","s3":128,"icone":false,
 "apoio1":"Ele quer um convite!","apoio2":"Uma historinha em que <i>ele é o herói e aceita a missão.</i>",
 "apoio3":"O convite vem pronto!","bilhete":"“Tem uma missão secreta para você!” ♡",
 "bilheteBaixo":true,"foto":{"size":"auto 135%","pos":"-16px 0"}}' "$(foto fotos/var-02.jpg)"

# 3. A fala do filho
gera var-03-so-mais-um-video '{"l1":"Cansada de ouvir","l2":"“só mais um","l3":"vídeo”?","icone":{"left":600,"top":250},
 "apoio1":"Você não está sozinha!","apoio2":"Do café ao banho… e quando desliga, vem o <i>“tô entediado”</i>.",
 "apoio3":"Tenha uma missão pronta!","bilhete":"Na próxima vez, ofereça uma missão! ♡"}' "$(foto fotos/modelo-02.jpg)"

# 4. O momento (dia de chuva)
gera var-04-dia-de-chuva '{"l1":"Dia de chuva e","l2":"ele grudado","l3":"na tela?","icone":{"left":600,"top":250},
 "apoio1":"Tem missão para tudo!","apoio2":"Chuva, jantar, viagem, hora de dormir: <i>sempre tem ideia pronta.</i>",
 "apoio3":"Brincadeira pronta em 5 minutos!","bilhete":"Hoje tem cabana de lençol! ♡"}' "$(foto fotos/modelo-01.jpg)"

# 5. A oferta
gera var-05-oferta '{"l1":"100 brincadeiras","l2":"sem tela por","l3":"R$ 27,90","s3":132,"icone":false,
 "apoio1":"Menos de R$ 0,28/missão!","apoio2":"Para imprimir ou usar no celular, <i>com 4 bônus e garantia de 7 dias.</i>",
 "apoio3":"Acesso imediato no e-mail!","bilhete":"Uma missão por dia no Desafio 30 Dias! ♡","bilheteTop":430}' "$(foto fotos/var-05.jpg)"
