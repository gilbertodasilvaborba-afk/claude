from lib import *
cats=parse(sorted(glob.glob(D+'/data/0*.txt')),'R')
recs=allrec(cats); total=len(recs)
namemap={r['name']:r['n'] for r in recs}
b=cover('Guia de<br>Receitas','Receitas sem glúten, sem açúcar e sem lactose',f'+{total//10*10} receitas fáceis')
b+=f'''<div class="pg"><div class="h1">Seja bem-vinda à sua mesa</div><div class="rule"></div>
<p>Este guia reúne <b>{total} receitas</b> sem glúten, sem açúcar e sem lactose: pães, bolos, tortas, massas, biscoitos, caldas, recheios e lanches para levar na bolsa.</p>
<p>A ideia é simples: ninguém precisa ficar de fora da mesa. Cada receita foi escrita para ser fácil, com ingredientes que você encontra no mercado e passos curtos.</p>
<div class="h2">Como usar o guia</div>
<ul><li>Veja o <b>índice</b> e toque no nome da receita para ir direto a ela.</li>
<li>Cada receita tem um <b>número</b>. Os bônus (Cardápio da Semana, Lista de Compras e Guia de Bebidas) usam esses números.</li>
<li>Antes da primeira receita, leia o bônus <b>Guia de Substituições</b>: ele explica as trocas e evita os erros mais comuns.</li></ul>
<div class="h2">Medidas usadas</div>
<table><tr><th>Sigla</th><th>Significa</th></tr>
<tr><td>xíc.</td><td>xícara de chá (240 ml)</td></tr><tr><td>cs</td><td>colher de sopa</td></tr><tr><td>cc</td><td>colher de chá</td></tr>
<tr><td>pitada</td><td>o que cabe entre dois dedos</td></tr></table></div>'''
b+='''<div class="pg"><div class="h1">Antes de começar</div><div class="rule"></div>
<div class="box"><b>Rótulos e contaminação cruzada.</b> Leia sempre o rótulo. No Brasil, os alimentos industrializados informam se contêm ou não glúten. Atenção especial para aveia (use só a certificada sem glúten), amidos, fermento, chocolate, temperos e caldos prontos. Se alguém da casa tem doença celíaca, use utensílios e tábuas separados.</div>
<div class="box"><b>O que significa “sem açúcar” aqui.</b> As receitas não levam açúcar refinado nem mascavo. Usamos adoçante culinário tipo eritritol e o doce natural das frutas e das tâmaras. Frutas e tâmaras têm açúcar natural.</div>
<div class="box"><b>Adoçantes.</b> Ajuste o doce ao seu gosto. Se usar xilitol, mantenha longe de cães: ele é tóxico para eles.</div>
<div class="box"><b>Importante.</b> Este material é informativo e não substitui a orientação de médico ou nutricionista. Quem tem diabetes, doença celíaca, alergia ou outra condição deve seguir a orientação do seu profissional de saúde.</div>
<div class="h2">Seu kit básico</div>
<p class="note">Farinha de arroz • polvilho doce e azedo • amido de milho • goma de tapioca • casca de psyllium • fermento biológico seco • fermento químico sem glúten • eritritol • cacau em pó 100% • óleo de coco • azeite • leite de coco • bebida vegetal • coco ralado sem açúcar • aveia certificada sem glúten • chia e linhaça.</p></div>'''
idx='<div class="pg idx"><div class="h1">Índice</div><div class="rule"></div>'
for c in cats:
    idx+=f'<h3 class="serif">{esc(c["name"])}</h3><div class="cols2">'
    for r in c['items']:
        idx+=f'<div class="row"><b>{r["n"]}</b><a href="#{r["id"]}">{esc(r["name"])}</a></div>'
    idx+='</div>'
b+=idx+'</div>'
for k,c in enumerate(cats,1):
    b+=f'<div class="catpg"><div class="n">CAPÍTULO {k}</div><div class="c">{esc(c["name"])}</div><div class="q">{len(c["items"])} receitas</div></div>'
    b+=''.join(rec_html(r) for r in c['items'])
b+='''<div class="catpg"><div class="n">OBRIGADA</div><div class="c">Que a sua mesa<br>seja cheia de gosto<br>e sem culpa</div><div class="q">Mesa Sem Culpa</div></div>'''
open(D+'/out_guia.html','w',encoding='utf-8').write(page(b,'Mesa Sem Culpa - Guia de Receitas'))
print(total,'receitas')
