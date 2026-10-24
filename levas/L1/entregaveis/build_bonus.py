from lib import *
from menu import *
recs=allrec(parse(sorted(glob.glob(D+'/data/0*.txt')),'R'))
rmap={r['name']:r for r in recs}
bcats=parse([D+'/data/10_bebidas.txt'],'B'); brecs=allrec(bcats); bmap={r['name']:r for r in brecs}
def ref(name):
    if name in rmap: return f'<a class="lk" href="#"></a>'
def lab(name):
    n=name.strip()
    if n in rmap: return f'{esc(n)} <span class="lk">R{rmap[n]["n"]}</span>'
    if n in bmap: return f'{esc(n)} <span class="lk">B{bmap[n]["n"]}</span>'
    raise SystemExit('NOME NÃO ENCONTRADO: '+n)

# ---------- 1. SUBSTITUIÇÕES ----------
def rn(n): return rmap[n]['n']
s=cover('Guia de<br>Substituições','Troque certo e a receita dá certo de primeira','Bônus 1')
s+=f'''<div class="pg"><div class="h1">Como trocar sem errar</div><div class="rule"></div>
<p>O maior motivo de uma receita sem glúten dar errado é a troca mal feita. Este guia mostra o que usar no lugar da farinha de trigo, do açúcar, do leite e dos outros ingredientes, e por quê.</p>
<div class="box"><b>Regra de ouro:</b> nas receitas do Guia de Receitas, as trocas já estão prontas. Use este guia quando quiser adaptar uma receita sua ou quando faltar um ingrediente.</div>
<div class="h2">1. No lugar da farinha de trigo</div>
<table><tr><th>Troque por</th><th>Para que serve</th><th>Dica</th></tr>
<tr><td><b>Farinha de arroz</b></td><td>Base de pães, bolos e massas</td><td>Sozinha fica seca. Misture com polvilho ou amido.</td></tr>
<tr><td><b>Polvilho doce</b></td><td>Maciez e elasticidade</td><td>Dá liga em pães e massas de pizza.</td></tr>
<tr><td><b>Polvilho azedo</b></td><td>Biscoitos, pão de queijo e crocância</td><td>Escalde com óleo quente para ficar macio.</td></tr>
<tr><td><b>Amido de milho</b></td><td>Leveza em bolos e biscoitos</td><td>Também engrossa cremes e molhos.</td></tr>
<tr><td><b>Farinha de amêndoas</b></td><td>Bolos e cookies úmidos</td><td>Absorve menos líquido. Use em tortas e biscoitos.</td></tr>
<tr><td><b>Farinha de coco</b></td><td>Pães e bolos densos</td><td>Absorve muito líquido. Use pouco e deixe hidratar.</td></tr>
<tr><td><b>Farinha de grão-de-bico</b></td><td>Pães, pizzas e massas salgadas</td><td>Tem sabor marcante. Combine com ervas.</td></tr>
<tr><td><b>Aveia certificada sem glúten</b></td><td>Cookies, barras e bolos</td><td>Compre só a que tem selo de sem glúten.</td></tr>
<tr><td><b>Fubá</b></td><td>Bolos, broas e biscoitos</td><td>Confira o rótulo: precisa ser livre de contaminação.</td></tr>
<tr><td><b>Mandioca, batata-doce, inhame</b></td><td>Pães, nhoques e bolinhos</td><td>Cozidos e amassados, dão umidade e liga.</td></tr></table>
<div class="h2">Mix de farinhas para bolos</div>
<p>Misture <b>2 partes de farinha de arroz</b>, <b>1 parte de polvilho doce</b> e <b>1 parte de amido de milho</b>. Guarde em pote fechado e use no lugar da farinha de trigo em bolos e bolinhos. Veja a receita nº {rn('Bolo de cenoura')} (Bolo de cenoura) como exemplo.</p>
<div class="h2">Mix de farinhas para pães</div>
<p>Misture <b>2 partes de farinha de arroz</b>, <b>1 parte de polvilho doce</b> e acrescente <b>2 colheres de sopa de casca de psyllium</b> para cada 3 xícaras de farinha. O psyllium faz o papel do glúten e dá liga. Veja a receita nº {rn('Pão de forma macio')} (Pão de forma macio).</p></div>
<div class="pg"><div class="h2" style="margin-top:0">2. No lugar do açúcar</div>
<table><tr><th>Troque por</th><th>Como usar</th><th>Cuidados</th></tr>
<tr><td><b>Eritritol</b></td><td>Em pó ou granulado. É o usado no guia.</td><td>Menos doce que o açúcar. Ajuste ao gosto. Pode dar sensação de frescor.</td></tr>
<tr><td><b>Xilitol</b></td><td>Pode substituir o eritritol.</td><td>Tóxico para cães. Mantenha longe dos animais.</td></tr>
<tr><td><b>Estévia culinária</b></td><td>Em poucas gotas ou pitadas.</td><td>É muito concentrada. Use pouco para não amargar.</td></tr>
<tr><td><b>Banana madura</b></td><td>Amasse e use em bolos e cookies.</td><td>Tem açúcar natural. Dá umidade.</td></tr>
<tr><td><b>Tâmaras</b></td><td>Em pasta, para doces e barras. Veja a pasta nº {rn('Pasta de tâmara')}.</td><td>Têm açúcar natural.</td></tr></table>
<div class="box"><b>Atenção:</b> “sem açúcar” aqui significa sem açúcar refinado ou mascavo adicionado. Frutas e tâmaras têm açúcar natural. Quem controla a glicemia deve conversar com o médico ou o nutricionista.</div>
<div class="h2">3. No lugar do leite e derivados</div>
<table><tr><th>Em vez de</th><th>Use</th></tr>
<tr><td>Leite</td><td>Bebida vegetal sem açúcar (amêndoas, arroz, coco, castanha-de-caju). Veja as receitas de leites vegetais no Guia de Bebidas.</td></tr>
<tr><td>Creme de leite</td><td>Creme de coco gelado, que também vira chantilly (nº {rn('Chantilly de coco')}).</td></tr>
<tr><td>Leite condensado</td><td>Doce de coco cremoso (nº {rn('Doce de coco cremoso')}) ou brigadeiro de cacau (nº {rn('Brigadeiro de cacau')}).</td></tr>
<tr><td>Manteiga</td><td>Óleo de coco ou azeite.</td></tr>
<tr><td>Iogurte</td><td>Iogurte vegetal sem açúcar.</td></tr>
<tr><td>Queijo</td><td>Pode deixar de fora. Para dar sabor, use ervas, azeite e cebola dourada.</td></tr></table>
<div class="h2">4. Fermentos</div>
<ul><li><b>Fermento químico:</b> procure o que informa “sem glúten” no rótulo.</li>
<li><b>Fermento biológico seco:</b> usado nos pães. A água deve estar morna, nunca quente.</li>
<li><b>Bicarbonato com limão ou vinagre:</b> alternativa em bolos. Use 1/2 colher de chá de bicarbonato com 1 colher de sopa de suco de limão para cada xícara de farinha.</li></ul></div>
<div class="pg"><div class="h2" style="margin-top:0">5. No lugar dos ovos</div>
<p>Muitas receitas do guia usam ovos, que dão liga e leveza. Se quiser tentar sem ovos em bolos e cookies, use <b>1 colher de sopa de linhaça moída com 3 colheres de sopa de água</b> por ovo. Deixe descansar 5 minutos. Funciona melhor em bolos e biscoitos do que em pães.</p>
<div class="h2">6. Dicas de textura</div>
<ul><li><b>Massas sem glúten pedem repouso.</b> Deixe descansar 10 a 15 minutos para a farinha hidratar.</li>
<li><b>Mexa pouco bolos e muito pães.</b> Bolos: só até misturar. Pães com psyllium: sove até a massa soltar das mãos.</li>
<li><b>Forno bem pré-aquecido.</b> Ligue com 15 minutos de antecedência.</li>
<li><b>Deixe esfriar antes de cortar.</b> Pães sem glúten terminam de firmar fora do forno.</li>
<li><b>Guarde bem.</b> Pães e bolos caseiros duram 2 a 3 dias fora da geladeira. Fatie e congele para durar mais.</li></ul>
<div class="h2">7. Erros comuns e como corrigir</div>
<table><tr><th>Problema</th><th>Provável causa</th><th>Solução</th></tr>
<tr><td>Bolo seco</td><td>Farinha de arroz demais ou forno quente</td><td>Misture com polvilho. Reduza 10 °C.</td></tr>
<tr><td>Pão que murcha</td><td>Massa líquida demais</td><td>Reduza a água em 2 a 3 colheres.</td></tr>
<tr><td>Miolo úmido</td><td>Cortou quente</td><td>Espere esfriar por completo.</td></tr>
<tr><td>Massa esfarela</td><td>Faltou liga</td><td>Junte 1 colher de psyllium ou 1 ovo.</td></tr>
<tr><td>Biscoito duro</td><td>Tempo de forno longo</td><td>Retire quando as bordas dourarem.</td></tr>
<tr><td>Gosto amargo</td><td>Estévia demais ou cacau sem açúcar</td><td>Reduza a estévia. Junte uma pitada de sal.</td></tr></table>
<div class="h2">8. Rótulos e contaminação cruzada</div>
<ul><li>Leia o rótulo de tudo que é industrializado: aveia, amidos, fermento, chocolate, temperos, caldos e molhos.</li>
<li>No Brasil, o rótulo informa se o produto contém ou não glúten.</li>
<li>Em casa com celíaco, separe utensílios, tábuas e peneiras. Lave bem antes de usar.</li>
<li>Use chocolate meio amargo (70% ou mais) que não leve leite.</li></ul>
<div class="box"><b>Importante.</b> Este guia é informativo e não substitui a orientação de médico ou nutricionista.</div></div>'''
s_css='<style>table{font-size:8pt}td,th{padding:1.2mm 2mm}p{margin-bottom:1.6mm}.h2{margin:3mm 0 1.4mm}.box{margin:2mm 0;padding:2mm 3mm}</style>'
open(D+'/out_subs.html','w',encoding='utf-8').write(page(s_css+s,'Mesa Sem Culpa - Guia de Substituições'))

# ---------- 2. CARDÁPIO ----------
m=cover('Cardápio<br>da Semana','4 semanas montadas com as receitas do guia','Bônus 2')
m+='''<div class="pg"><div class="h1">Como usar o cardápio</div><div class="rule"></div>
<p>São <b>4 semanas</b> prontas, com café da manhã, lanche da manhã, almoço, lanche da tarde e jantar. Cada item mostra o número da receita:</p>
<ul><li><b>R12</b> = receita nº 12 do <b>Guia de Receitas</b>.</li><li><b>B5</b> = bebida nº 5 do <b>Guia de Bebidas</b>.</li></ul>
<div class="box"><b>Dica:</b> no almoço e no jantar, as sugestões do guia combinam com o acompanhamento da sua casa, como salada, legumes e proteínas. Troque os dias de lugar à vontade.</div>
<div class="box"><b>Para economizar tempo:</b> faça os pães e os bolos no fim de semana, fatie e congele. Veja a Lista de Compras (Bônus 3) com os ingredientes de cada semana.</div>
<p class="note">Este cardápio é uma sugestão de organização de receitas e não substitui a orientação de médico ou nutricionista.</p></div>'''
for w,week in enumerate(WEEKS,1):
    m+=f'<div class="pg"><div class="h1">Semana {w}</div><div class="rule"></div>'
    for d,day in enumerate(week):
        slots=[x.strip() for x in day.split('|')]
        assert len(slots)==5,(w,d)
        rows=''
        for ref_,sl in zip(REF,slots):
            rows+=f'<tr><td>{ref_}</td><td>{" + ".join(lab(x) for x in sl.split(" + "))}</td></tr>'
        m+=f'<div class="day"><div class="dh">{DIAS[d]}</div><table style="margin:0">{rows}</table></div>'
        if d==3: m+=f'</div><div class="pg"><div class="h1">Semana {w} (continuação)</div><div class="rule"></div>'
    m+='</div>'
m_css='<style>.day td{padding:.55mm 1.8mm!important;font-size:7.3pt;line-height:1.28}.day td:first-child{width:19mm}.day{margin-bottom:1.8mm}.day .dh{padding:.8mm 3mm;font-size:8.2pt}.day table{margin:0}.h1{font-size:19pt}.rule{margin:1mm 0 2.4mm}</style>'
open(D+'/out_menu.html','w',encoding='utf-8').write(page(m_css+m,'Mesa Sem Culpa - Cardápio da Semana'))

# ---------- 3. LISTA DE COMPRAS ----------
import re
DESC=r'\b(picad[oa]s?|cozid[oa]s?|ralad[oa]s?|fatiad[oa]s?|espremid[oa]s?|amassad[oa]s?|derretid[oa]s?|temperad[oa]s?|refogad[oa]s?|escorrid[oa]s?|dourad[oa]s?|torrad[oa]s?|trituradas?|hidratad[oa]s?|congelad[oa]s?|média|médias|maduro|maduros|madura|maduras|quente|morna|morno|gelada|gelado|aquecido|batida|variad[oa]s?|moíd[oa]s?|secas?|escaldad[oa]s?)\b'
CANON={'abobrinhas':'abobrinha','cenouras':'cenoura','bananas':'banana','bananas-verdes':'banana-verde','batatas':'batata','batata':'batata','tomates':'tomate','laranjas':'laranja','limões':'limão','abacates':'abacate','berinjelas':'berinjela','mirtilos':'mirtilos','morangos':'morangos','dentes de alho':'alho','dente de alho':'alho','alho':'alho','cravos':'cravo','cravo':'cravo','ovo':'ovos','paus de canela':'pau de canela','batatas-doces':'batata-doce','nozess':'nozes','castanhass':'castanhas','castanhas':'castanhas','frutass':'frutas','frutas':'frutas','legumess':'legumes','legumes':'legumes','tomatess':'tomate','maçãs':'maçã','maçãss':'maçã','abacaxi':'abacaxi','suco de limão':'limão','polpa de maracujá':'maracujá','sementes de chia':'chia','tâmaras sem caroço':'tâmaras','linhaça dourada':'linhaça','linhaça dourada moída':'linhaça','coco':'coco ralado sem açúcar','coco ralado':'coco ralado sem açúcar','coco sem açúcar':'coco ralado sem açúcar','coco em lascas':'coco ralado sem açúcar','coco ralado sem açúcar':'coco ralado sem açúcar','flocão de milho':'flocão de milho','milho-verde':'milho-verde','farinha de arroz branca':'farinha de arroz','aveia em flocos certificada sem glúten':'aveia certificada sem glúten','aveia em flocos finos certificada sem glúten':'aveia certificada sem glúten','leite de coco light':'leite de coco','leite de coco ou bebida vegetal':'leite de coco','creme de coco gelado':'creme de coco','sachês de camomila':'chá de camomila (sachê)','uvas-passas ou nozes':'uvas-passas','passas':'uvas-passas','essência de baunilha':'baunilha','baunilha':'baunilha','castanha-de-caju ou amêndoa':'castanha-de-caju ou amêndoa','avelãs ou amêndoas':'avelãs ou amêndoas','abacate maduro':'abacate','laranja com casca, sem sementes':'laranja','abobrinha no sentido do comprimento':'abobrinha','abobrinhas no sentido do comprimento':'abobrinha','couve-flor':'couve-flor','mandioca':'mandioca','mandioquinha':'mandioquinha','inhame':'inhame','aipim':'aipim','batata-doce':'batata-doce','pepino':'pepino','espinafre':'espinafre','frango':'frango desfiado','frango desfiado':'frango desfiado','recheio de frango':'frango desfiado','recheio de frango desfiado':'frango desfiado','recheio de frango cremoso':'frango desfiado','carne moída':'carne moída','atum':'atum','feijão-preto':'feijão-preto','grão-de-bico':'grão-de-bico','arroz':'arroz','macarrão de arroz':'macarrão de arroz','café forte':'café','café forte frio':'café','chá preto':'chá preto','flores de hibisco':'flores de hibisco','folhas de erva-cidreira':'folhas de erva-cidreira','pau de canela':'pau de canela','gengibre fatiado':'gengibre','gengibre ralado':'gengibre','manteiga':'manteiga','bebida vegetal sem açúcar':'bebida vegetal','sementes de gergelim':'gergelim','melancia sem sementes':'melancia','mamão papaia':'mamão','óleo':'óleo (neutro)','avelãs ou amêndoas':'avelãs ou amêndoas'}
SYN={'molho de tomate':'Molho de tomate caseiro','patê de frango':'Patê de frango cremoso','pão de forma sem glúten':'Pão de forma macio','panquecas de arroz':'Panqueca de arroz','massa de pão de hambúrguer':'Pão de hambúrguer','massa de pizza de polvilho':'Massa de pizza de polvilho','massa base de torta':'Massa base de torta','bolo de cenoura':'Bolo de cenoura','creme de abacate':'Creme de abacate','geleia de morango sem açúcar':'Geleia de morango com chia'}
SKIP={'a gosto','gelo','água','água de coco','pitada'}
def norm(i):
    i=i.lower()
    i=re.sub(r'\(.*?\)','',i)
    i=re.sub(DESC,'',i)
    i=re.sub(r'\b(sem pele|torrada?s?)\b','',i)
    i=re.sub(r'\s+',' ',i).strip(' .,')
    i=re.sub(r'( e| ou)$','',i).strip()
    i=re.sub(r'^(e|ou) ','',i).strip()
    return CANON.get(i,i)
GROUPS=[('Farinhas, amidos e fermentos',['farinha','polvilho','amido','psyllium','fermento','tapioca','fubá','flocão','aveia','macarrão','massa','linhaça','chia']),
 ('Hortifruti',['abobrinha','abóbora','cenoura','batata','mandioca','aipim','inhame','mandioquinha','tomate','cebola','alho','brócolis','couve','espinafre','berinjela','pepino','banana','maçã','laranja','limão','morango','mirtilo','frutas','abacate','abacaxi','mamão','manga','maracujá','melancia','pêssego','palmito','milho','legumes','salsinha','cheiro-verde','coentro','manjericão','hortelã','gengibre','alface','folhas','cebolinha','uvas','cravo']),
 ('Proteínas e ovos',['ovos','frango','carne','atum']),
 ('Óleos, gorduras e laticínios vegetais',['óleo','azeite','leite','creme de coco','bebida','iogurte','tahine','pasta de','coco']),
 ('Castanhas, sementes e doces naturais',['castanha','amêndoa','amêndoas','nozes','avelã','amendoim','gergelim','girassol','tâmara','eritritol','cacau','chocolate','passas','coco ralado','baunilha']),
 ('Temperos e outros',[])]
def group(i):
    for g,keys in GROUPS[:-1]:
        if any(k in i for k in keys): return g
    return GROUPS[-1][0]
def expand(r,seen=None,out=None):
    out=out if out is not None else []
    seen=seen or set()
    if r['name'] in seen: return out
    seen.add(r['name'])
    for q,i in r['ing']:
        ni=norm(i)
        hit=None
        key=i.lower().strip()
        if key in SYN: hit=rmap[SYN[key]]
        for nm in rmap:
            if nm.lower()==key: hit=rmap[nm]
        if hit and hit['name']!=r['name']:
            expand(hit,seen,out)
        else: out.append((ni,r['n']))
    return out
L=cover('Lista de<br>Compras','Tudo o que você precisa para as 4 semanas','Bônus 3')
L+='''<div class="pg"><div class="h1">Como usar a lista</div><div class="rule"></div>
<p>Cada semana do Cardápio tem a sua lista, dividida por seção do mercado. Marque o que você já tem em casa e compre só o que falta.</p>
<ul><li>Os números ao lado de cada item (<b>R12</b>) mostram em quais receitas ele é usado.</li>
<li>As quantidades estão em cada receita do Guia de Receitas. Some quando o item aparecer em mais de uma.</li>
<li>Comece pela <b>despensa base</b>: são itens que duram e servem para quase todas as receitas.</li></ul>
<div class="h2">Despensa base (compre uma vez)</div>
<div class="cols2">'''
for it in ['Farinha de arroz branca','Farinha de arroz integral','Polvilho doce','Polvilho azedo','Amido de milho','Goma de tapioca','Casca de psyllium','Fermento biológico seco','Fermento químico sem glúten','Eritritol (granulado e em pó)','Cacau em pó 100%','Óleo de coco','Azeite','Leite de coco (lata)','Creme de coco (lata)','Bebida vegetal sem açúcar','Coco ralado sem açúcar','Aveia certificada sem glúten','Chia','Linhaça dourada','Farinha de amêndoas','Chocolate 70% sem leite','Tâmaras','Castanhas variadas','Sal, orégano, canela, erva-doce']:
    L+=f'<div><span class="ck"></span>{esc(it)}</div>'
L+='</div></div>'
for w,week in enumerate(WEEKS,1):
    items={}
    for day in week:
        for sl in day.split('|'):
            for nm in [x.strip() for x in sl.split(' + ')]:
                if nm in rmap:
                    for ni,rn_ in expand(rmap[nm]): items.setdefault(ni,set()).add(rn_)
                elif nm in bmap:
                    for q,i in bmap[nm]['ing']: items.setdefault(norm(i),set()).add('B'+str(bmap[nm]['n']))
    g={}
    for ni,ns in items.items():
        if not ni or ni in SKIP or ni.startswith('água'): continue
        g.setdefault(group(ni),[]).append((ni,ns))
    L+=f'<div class="pg"><div class="h1">Lista da semana {w}</div><div class="rule"></div>'
    for gn,_ in GROUPS:
        if gn not in g: continue
        L+=f'<div class="h2" style="margin:3mm 0 1mm">{gn}</div><div class="cols2">'
        for ni,ns in sorted(g[gn]):
            nums=', '.join(sorted((('R'+str(x)) if isinstance(x,int) else x) for x in ns)[:6])
            L+=f'<div style="break-inside:avoid;font-size:8.2pt"><span class="ck"></span>{esc(ni[0].upper()+ni[1:])} <span class="lk">{nums}</span></div>'
        L+='</div>'
    L+='</div>'
open(D+'/out_lista.html','w',encoding='utf-8').write(page(L,'Mesa Sem Culpa - Lista de Compras'))

# ---------- 4. BEBIDAS ----------
nm_guia={r['name']:r['n'] for r in recs}
B=cover('Guia de<br>Bebidas','Para acompanhar seus pães e bolos',f'Bônus 4 • {len(brecs)} bebidas')
B+=f'''<div class="pg"><div class="h1">Bebidas para acompanhar</div><div class="rule"></div>
<p>São <b>{len(brecs)} bebidas</b> sem glúten, sem açúcar e sem lactose, para combinar com os pães, bolos e lanches do Guia de Receitas.</p>
<p>Cada bebida indica uma receita do guia que combina com ela, com o número para você encontrar rápido.</p>
<div class="box"><b>Atenção:</b> se usar aveia, compre a certificada sem glúten. Chás industrializados e aromatizantes: leia o rótulo.</div>
<p class="note">Este material é informativo e não substitui a orientação de médico ou nutricionista.</p></div>'''
for k,c in enumerate(bcats,1):
    B+=f'<div class="catpg"><div class="n">PARTE {k}</div><div class="c">{esc(c["name"])}</div><div class="q">{len(c["items"])} bebidas</div></div>'
    B+=''.join(rec_html(r,nm_guia) for r in c['items'])
open(D+'/out_bebidas.html','w',encoding='utf-8').write(page(B,'Mesa Sem Culpa - Guia de Bebidas'))
print('ok')
