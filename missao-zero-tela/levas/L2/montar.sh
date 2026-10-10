#!/usr/bin/env bash
# Leva L2: variações do L1V10 (vencedor). Gancho G2 e corpo C5 são os MESMOS segmentos do L1
# (mesmas cenas, mesma voz); muda só o CTA. Os CTAs ficam em _trabalho/ctaN.{mp4,wav}.
# Uso: bash montar.sh [N ...]   (sem argumento monta os 5)
set -e
cd "$(dirname "$0")"
L1=../L1/_trabalho
MUSICA=../L1/musicas/m03.m4a
VOL=0.14
for n in ${@:-1 2 3 4 5}; do
  t=_trabalho
  dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }
  total=$(python3 -c "print($(dur $L1/g2.wav)+$(dur $L1/c5.wav)+$(dur $t/cta$n.wav))")
  fade=$(python3 -c "print(max(0.0,$total-1.2))")
  printf "file '%s'\nfile '%s'\nfile '%s'\n" "$PWD/$L1/g2.mp4" "$PWD/$L1/c5.mp4" "$PWD/$t/cta$n.mp4" > $t/L2V$n.txt
  ffmpeg -y -v error -f concat -safe 0 -i $t/L2V$n.txt -i $L1/g2.wav -i $L1/c5.wav -i $t/cta$n.wav \
    -stream_loop -1 -i $MUSICA -filter_complex \
    "[1:a][2:a][3:a]concat=n=3:v=0:a=1,highpass=f=80,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100,aformat=sample_rates=44100:channel_layouts=stereo[voz];[4:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:$total,volume=$VOL,afade=t=out:st=$fade:d=1.2[m];[voz][m]amix=inputs=2:duration=first:normalize=0[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -map_metadata -1 -movflags +faststart videos/L2V$n.mp4
  echo "ok L2V$n"
done
