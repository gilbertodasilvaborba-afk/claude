import re, glob, html, os
D=os.path.dirname(os.path.abspath(__file__))
def esc(s): return html.escape(s, quote=False)

def parse(files, prefix):
    cats=[]; n=0
    for f in files:
        cur=None; r=None
        for raw in open(f, encoding='utf-8'):
            l=raw.rstrip('\n')
            if not l.strip(): continue
            if l.startswith('# '):
                cur={'name':l[2:].strip(),'items':[]}; cats.append(cur)
            elif l.startswith('@'):
                n+=1; p=[x.strip() for x in l[1:].split('|')]
                r={'n':n,'id':f'{prefix}{n}','name':p[0],'time':p[1],'yield':p[2],'ing':[],'steps':[],'pair':None}
                cur['items'].append(r)
            elif l.startswith('I:'):
                for it in l[2:].split(';'):
                    it=it.strip()
                    if not it: continue
                    if '|' in it:
                        q,i=[x.strip() for x in it.split('|',1)]
                    else: q,i='',it
                    r['ing'].append((q,i))
            elif l.startswith('M:'):
                r['steps']=[s.strip() for s in l[2:].split('||') if s.strip()]
            elif l.startswith('P:'):
                r['pair']=l[2:].strip()
    return cats

def allrec(cats): return [r for c in cats for r in c['items']]

CSS = """
@page{size:148mm 210mm;margin:14mm 12mm 16mm;@bottom-center{content:"Mesa Sem Culpa • página " counter(page);font-size:7pt;color:#7a4a26;font-family:'Inter',sans-serif}}
@page:first{margin:0;@bottom-center{content:none}}
:root{--cream:#f6ecd9;--cream2:#efe0c3;--brown:#4a2c17;--brown2:#7a4a26;--gold:#b98a4a;--yellow:#ffd400}
*{box-sizing:border-box}
html{font-family:'Inter','DejaVu Sans',sans-serif;color:#3a2210;font-size:9.4pt;line-height:1.42}
body{margin:0;background:#fffaf0}
h1,h2,h3,.serif{font-family:'Caladea','Liberation Serif',serif;color:var(--brown)}
.cover{width:148mm;height:210mm;page-break-after:always;background:radial-gradient(circle at 50% 35%,#fbf4e4,#f1e2c2 70%,#e6cf9f);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:14mm;position:relative}
.cover img{width:78mm;height:78mm;border-radius:50%;box-shadow:0 8px 30px rgba(74,44,23,.25)}
.cover .t{font-family:'Caladea',serif;font-weight:700;font-size:30pt;line-height:1.05;margin-top:11mm;color:var(--brown)}
.cover .s{font-size:12.5pt;margin-top:4mm;color:var(--brown2);font-family:'Caladea',serif}
.cover .tag{margin-top:9mm;background:var(--yellow);color:#3a2210;font-weight:700;border:2.2pt solid #3a2210;border-radius:30pt;padding:2.2mm 7mm;font-size:11pt}
.cover .ft{position:absolute;bottom:9mm;font-size:8pt;color:var(--brown2)}
.pg{page-break-before:always}
.h1{font-family:'Caladea',serif;font-weight:700;font-size:22pt;color:var(--brown);margin:0 0 3mm;line-height:1.1}
.h2{font-family:'Caladea',serif;font-weight:700;font-size:14pt;color:var(--brown2);margin:5mm 0 2mm}
.rule{height:1.6pt;background:var(--gold);margin:2mm 0 4mm;width:26mm}
p{margin:0 0 2.4mm}
.box{background:#fff3cf;border:1.2pt solid var(--gold);border-radius:3mm;padding:3mm 4mm;margin:3mm 0}
.box b{color:var(--brown)}
.note{font-size:8.2pt;color:#6b5238}
ul{margin:0 0 2.4mm;padding-left:5mm}li{margin-bottom:1mm}
table{width:100%;border-collapse:collapse;margin:2mm 0 4mm;font-size:8.6pt}
th{background:var(--brown);color:#fff;text-align:left;padding:1.8mm 2.4mm;font-weight:600}
td{padding:1.8mm 2.4mm;border-bottom:.6pt solid #dcc79c;vertical-align:top}
tr:nth-child(even) td{background:#fbf3df}
.catpg{page-break-before:always;height:170mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.catpg .n{font-size:11pt;color:var(--gold);letter-spacing:3pt;font-weight:700}
.catpg .c{font-family:'Caladea',serif;font-size:30pt;font-weight:700;color:var(--brown);line-height:1.08;margin:3mm 8mm}
.catpg .q{font-size:11pt;color:var(--brown2);margin-top:3mm}
.rec{break-inside:avoid;page-break-inside:avoid;border:1pt solid #dcc79c;border-radius:3mm;background:#fffdf7;margin:0 0 3mm}
.rh{display:flex;align-items:center;background:var(--cream2);padding:1.4mm 3mm;gap:2.4mm}
.num{background:var(--brown);color:#fff;border-radius:50%;min-width:8mm;height:8mm;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:9pt}
.rn{font-family:'Caladea',serif;font-weight:700;font-size:12pt;color:var(--brown);line-height:1.1}
.meta{font-size:7.6pt;color:var(--brown2);margin-top:.6mm}
.rb{padding:1.6mm 3.2mm 2mm}
.rb h4{margin:1mm 0 .6mm;font-size:8pt;letter-spacing:1pt;color:var(--gold);text-transform:uppercase}
.rb{font-size:8.6pt;line-height:1.34}.rb ul{margin:0;padding-left:4.2mm;columns:2;column-gap:5mm}.rb li{margin-bottom:.2mm;break-inside:avoid}
.rb ol{margin:0;padding-left:4.6mm}.rb ol li{margin-bottom:.4mm}
.q{font-weight:600;color:var(--brown)}
.pair{margin-top:1.6mm;font-size:8pt;background:#fff3cf;border-radius:2mm;padding:1.2mm 2.4mm}
.tags{display:flex;gap:1.4mm;margin-top:1.4mm;flex-wrap:wrap}
.tags span{font-size:6.8pt;background:#e8f1dc;color:#37591f;border-radius:20pt;padding:.5mm 2mm;font-weight:600}
.idx a{color:inherit;text-decoration:none}
.idx .row{display:flex;gap:2mm;border-bottom:.5pt dotted #c9b184;padding:.5mm 0;font-size:8.4pt}
.idx .row b{min-width:7mm;color:var(--brown2)}
.idx h3{margin:3mm 0 1mm;font-size:12pt}
.cols2{columns:2;column-gap:6mm}
.ck{display:inline-block;width:3mm;height:3mm;border:.9pt solid var(--brown2);border-radius:.8mm;margin-right:1.6mm;vertical-align:-.5mm}
.day{break-inside:avoid;border:1pt solid #dcc79c;border-radius:3mm;margin-bottom:3mm;overflow:hidden;background:#fffdf7}
.day .dh{background:var(--brown);color:#fff;font-weight:700;padding:1.4mm 3mm;font-size:9pt}
.day td{font-size:8.2pt}.day td:first-child{width:23mm;font-weight:700;color:var(--brown2)}
.lk{color:var(--brown2);font-weight:700;font-size:7.4pt;white-space:nowrap}
"""

def tags(): return '<div class="tags"><span>sem glúten</span><span>sem açúcar</span><span>sem lactose</span></div>'

def rec_html(r, namemap=None, pairlabel='Combina com o Guia de Receitas'):
    ing=''.join(f'<li>{"<span class=q>"+esc(q)+"</span> " if q else ""}{esc(i)}</li>' for q,i in r['ing'])
    st=''.join(f'<li>{esc(s)}</li>' for s in r['steps'])
    pair=''
    if r['pair'] and namemap and r['pair'] in namemap:
        pair=f'<div class="pair"><b>Combina com:</b> {esc(r["pair"])} <span class="lk">(receita nº {namemap[r["pair"]]})</span></div>'
    return f'''<div class="rec" id="{r['id']}"><div class="rh"><div class="num">{r['n']}</div><div><div class="rn">{esc(r['name'])}</div><div class="meta">⏱ {esc(r['time'])} &nbsp;•&nbsp; rende {esc(r['yield'])}</div></div></div>
<div class="rb"><h4>Ingredientes</h4><ul>{ing}</ul><h4>Modo de preparo</h4><ol>{st}</ol>{pair}{tags()}</div></div>'''

def cover(title, sub, tag, logo='logo.png'):
    return f'''<div class="cover"><img src="{logo}"><div class="t">{title}</div><div class="s">{sub}</div><div class="tag">{tag}</div><div class="ft">Mesa Sem Culpa • Sem glúten • Sem açúcar • Sem lactose</div></div>'''

def page(body, title='Mesa Sem Culpa'):
    return f'<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>{title}</title><style>{CSS}</style><body>{body}</body></html>'
