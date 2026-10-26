# Dựng lại video AR trang 4

Cần Python 3 (Pillow, numpy), ffmpeg và font Be Vietnam Pro (ExtraBold, Bold, SemiBold) đặt trong một thư mục `fonts/`.

```
python3 render.py ../../assets/comic_page4.jpg fonts video-khong-tieng.mp4
python3 audio.py am-thanh.wav
ffmpeg -i video-khong-tieng.mp4 -i am-thanh.wav -vf scale=720:964 -c:v libx264 -profile:v main -crf 23 -pix_fmt yuv420p -c:a aac -b:a 128k -af loudnorm=I=-16:TP=-1.5 -movflags +faststart -shortest ../../assets/video/trang4.mp4
ffmpeg -i video-khong-tieng.mp4 -i am-thanh.wav -vf scale=720:964 -c:v libvpx-vp9 -crf 35 -b:v 0 -c:a libopus -b:a 96k -af loudnorm=I=-16:TP=-1.5 -shortest ../../assets/video/trang4.webm
```

Toạ độ khung tranh, bong bóng thoại, mạng nơ-ron và ô cửa méo nằm ở đầu `render.py`. Nếu vẽ lại trang 4 thì phải đo lại các toạ độ này và biên dịch lại `assets/trang4.mind`.
