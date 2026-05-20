import cv2
import yt_dlp
import os

class VideoProcessor:
    def __init__(self):
        self.ascii_chars = ["@", "#", "S", "%", "?", "*", "+", ";", ":", ",", "."]

    def download_video(self, url):
        """Descarga un video desde un link y devuelve la ruta del archivo."""
        output_file = "temp_video.mp4"
        ydl_opts = {
            'format': 'mp4/best',
            'outtmpl': output_file,
            'overwrites': True
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        return output_file

    def frame_to_ascii(self, frame, width):
        """Convierte un solo frame de OpenCV a texto ASCII."""
        height, w, _ = frame.shape
        aspect_ratio = height / w
        # 0.43 compensa que los caracteres son más altos que anchos
        new_height = int(width * aspect_ratio * 0.43)
        
        if new_height <= 0: new_height = 1
        
        resized = cv2.resize(frame, (width, new_height))
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

        ascii_rows = []
        for row in gray:
            # Mapeo rápido de píxeles a caracteres
            line = "".join([self.ascii_chars[int((pixel / 255) * (len(self.ascii_chars) - 1))] for pixel in row])
            ascii_rows.append(line)
        
        return "\n".join(ascii_rows)

