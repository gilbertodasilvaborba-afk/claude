import json, os, subprocess, sys, re
R="/home/user/claude/levas/L1"; M=R+"/mix"
AUDIO=[p for p in os.listdir("/root/.claude/uploads/548fd3a2-23ae-5d69-aba4-95b69ba9a437") if "MiniMax" in p][0]
AUDIO="/root/.claude/uploads/548fd3a2-23ae-5d69-aba4-95b69ba9a437/"+AUDIO
WORDS=json.load(open("/tmp/claude-0/-home-user-claude/548fd3a2-23ae-5d69-aba4-95b69ba9a437/scratchpad/words.json"))
DUR=50.4
FOCUS={43916:0.4,50031:0.16,50025:0.92,24906:0.45}
def path(i):
    for d in ("hd","clips"):
        p=f"{M}/{d}/{i}.mp4"
        if os.path.exists(p): return p
def cdur(p): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]))
BEATS=[(3.0,6.3,[21018,29357,6948,6787]),(6.3,10.8,[42466,42467,24906,43028,50050]),(10.8,13.4,[43171,45646,4866,43916]),
(13.4,23.3,[24906,45646,4866,43916,21310]),(23.3,27.7,[24693,50032,48054,50050,42466]),(27.7,34.4,[46333,43039,29357,21931,15883]),
(34.4,42.1,[34585,3797,3799,24693,46330,26332]),(42.1,DUR,[21310,43916,6948,46330,21018])]
V=[
 dict(hook=[(50031,2.7),(50025,4.4)],t=["PÃO SEM GLÚTEN","SEM CULPA"],cap="yellow"),
 dict(hook=[(50031,2.7),(6787,6.0),(50025,4.4)],t=["SEM TRIGO","SEM AÇÚCAR"],cap="box"),
 dict(hook=[(29357,3.0),(46333,6.0),(50031,2.7)],t=["PÃO DE VERDADE","SEM GLÚTEN"],cap="white"),
 dict(hook=[(24906,2.0),(50031,2.7)],t=["A RECEITA","DA VOVÓ"],cap="yellow"),
 dict(hook=[(6948,5.0),(50025,4.4),(50031,2.7)],t=["+200 RECEITAS","SEM GLÚTEN"],cap="box"),
 dict(hook=[(43916,0.6,2.0),(21310,3.0,1.0)],t=["PÃO NA MESA","SEM CULPA"],cap="white"),
]
def pieces(v,i):
    out=[]; hk=v["hook"]; L=3.0/len(hk)
    for h in hk: out.append((h[0],h[1],h[2] if len(h)>2 else L))
    for bi,(a,b,pool) in enumerate(BEATS):
        n=max(1,round((b-a)/2.6)); L=(b-a)/n
        for k in range(n): out.append((pool[(i*2+bi+k)%len(pool)],1.0+0.7*((i+k)%3),L))
    return out
def ts(t):
    h=int(t//3600); m=int(t%3600//60); s=t%60
    return f"{h}:{m:02d}:{s:05.2f}"
FIX={"costumida":"costume","testar...":"testar"}
def caps(style):
    ws=[[FIX.get(w,w),s,e] for w,s,e in WORDS]
    for k,w in enumerate(ws):
        if w[0]=="a" and k>0 and ws[k-1][0]=="costume": w[0]="da"
    ch=[];cur=[]
    for w in ws:
        cur.append(w)
        nxt=sum(len(x[0])+1 for x in cur)
        if len(cur)>=3 or nxt>=14 or re.search(r"[.,!?]$",w[0]): ch.append(cur);cur=[]
    if cur: ch.append(cur)
    ev=[]
    for c in ch:
        for k,(w,s,e) in enumerate(c):
            gi=ws.index([w,s,e]); nx=ws[gi+1][1] if gi+1<len(ws) else DUR
            end=min(max(nx,s+0.12),e+0.3) if k+1==len(c) else max(nx,s+0.12)
            end=min(end,nx) if nx>s+0.1 else end
            txt=" ".join((("{\\c&H00E5FF&}" if style in("yellow","box") and j==k else ("{\\c&H00E5FF&}" if style=="white" and j==k else "{\\c&HFFFFFF&}"))+re.sub(r"[.,!?]+$","",x[0]).upper()+"{\\c&HFFFFFF&}") for j,x in enumerate(c))
            ev.append((s,end,txt))
    return ev
def ass(v):
    st=v["cap"]
    if st=="box": style="Style: Cap,DejaVu Sans,70,&H00FFFFFF,&H00FFFFFF,&HB0000000,&HB0000000,-1,0,0,0,100,100,0,0,3,18,0,2,60,60,560,1"
    elif st=="white": style="Style: Cap,DejaVu Sans,76,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,8,3,2,60,60,520,1"
    else: style="Style: Cap,DejaVu Sans,80,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,9,4,2,50,50,600,1"
    h=f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
{style}
Style: Title,DejaVu Sans,104,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,10,5,8,40,40,330,1
Style: Title2,DejaVu Sans,118,&H0000E5FF,&H0000E5FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,10,5,8,40,40,330,1
Style: Badge,DejaVu Sans,56,&H00FFFFFF,&H00FFFFFF,&H0040A020,&H0040A020,-1,0,0,0,100,100,0,0,3,22,0,8,40,40,230,1
Style: CTA,DejaVu Sans,68,&H00FFFFFF,&H00FFFFFF,&H0040A020,&H0040A020,-1,0,0,0,100,100,0,0,3,26,0,2,40,40,260,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""
    e=[]
    for s,en,t in caps(st): e.append(f"Dialogue: 1,{ts(s)},{ts(en)},Cap,,0,0,0,,{{\\fad(0,0)\\t(0,80,\\fscx108\\fscy108)\\t(80,160,\\fscx100\\fscy100)}}{t}")
    e.append(f"Dialogue: 2,{ts(0.0)},{ts(3.0)},Title,,0,0,0,,{{\\fad(120,200)}}{v['t'][0]}")
    e.append(f"Dialogue: 2,{ts(0.0)},{ts(3.0)},Title2,,0,0,{430},,{{\\fad(120,200)}}{v['t'][1]}")
    e.append(f"Dialogue: 2,{ts(39.4)},{ts(42.1)},Badge,,0,0,0,,{{\\fad(150,150)}} +200 RECEITAS TESTADAS ")
    e.append(f"Dialogue: 2,{ts(44.2)},{ts(50.4)},CTA,,0,0,0,,{{\\fad(150,0)}} CLIQUE NO BOTÃO\\NDO WHATSAPP E\\NMANDE \"QUERO\" ")
    return h+"\n".join(e)+"\n"
def build(i):
    v=V[i-1]; tmp=f"{R}/build/v{i}"; os.makedirs(tmp,exist_ok=True); lst=[]
    for k,(c,ss,L) in enumerate(pieces(v,i)):
        p=path(c); d=cdur(p); ss=min(ss,max(0,d-L-0.05)); o=f"{tmp}/p{k:02d}.mp4"
        z=1.0 if c==50031 else (1.14 if k%2==0 else 1.20)
        vf=f"scale=-2:{int(1920*z)}:flags=lanczos,crop=1080:1920:x='max(0,min(iw-1080,(iw-1080)*{FOCUS.get(c,0.5)}+({1 if k%2 else -1})*(t/{L:.3f}-0.5)*40))':y='(ih-1920)/2',fps=30,format=yuv420p,eq=saturation=1.12:contrast=1.04"
        subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",f"{ss:.2f}","-t",f"{L:.3f}","-i",p,"-an","-vf",vf,"-c:v","libx264","-preset","veryfast","-crf","19",o],check=True)
        lst.append(f"file '{o}'")
    open(f"{tmp}/l.txt","w").write("\n".join(lst))
    open(f"{tmp}/c.ass","w").write(ass(v))
    out=f"{R}/videos/L1V{i}.mp4"
    subprocess.run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",f"{tmp}/l.txt","-i",AUDIO,"-vf",f"ass={tmp}/c.ass","-map","0:v","-map","1:a","-c:v","libx264","-preset","medium","-crf","20","-c:a","aac","-b:a","160k","-t",str(DUR),"-shortest","-movflags","+faststart","-map_metadata","-1",out],check=True)
    print("ok",out)
for i in map(int,sys.argv[1:]): build(i)
