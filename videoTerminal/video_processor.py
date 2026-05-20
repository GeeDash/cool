import os
import cv2
import yt_dlp

class VideoProcessor:
    def __init__(self):
        # Lista de caracteres ordenados por densidad visual.
        # Los caracteres más densos (@, #) representan zonas oscuras, y los ligeros (., ) zonas claras.
        self.ascii_chars = ["@", "#", "S", "%", "?", "*", "+", ";", ":", ",", "."]

    def download_video(self, url):
        """
        Descarga un video desde una URL de YouTube o TikTok de forma segura.
        """
        output_file = "temp_video.mp4"
        
        # Configuración avanzada para el motor de descarga (yt-dlp)
        ydl_opts = {
            'format': 'mp4/best',     # Descarga el mejor formato disponible que sea MP4
            'outtmpl': output_file,   # Nombre del archivo temporal de salida
            'overwrites': True,       # Si el archivo ya existe, lo sobrescribe para no llenar el disco
            'noplaylist': True        # ¡CRUCIAL! Si el link es un Mix o Playlist, descarga SOLO el video actual
        }
        
        # Abre el descargador, procesa la URL y guarda el archivo en la carpeta del proyecto
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            
        return output_file

    def frame_to_ascii(self, frame, width, mode="gui"):
        """
        Toma un fotograma (frame) de OpenCV, calcula su proporción exacta para 
        evitar recortes de pantalla y lo convierte en una cadena de texto ASCII.
        """
        # 1. Obtener las dimensiones originales del video (Alto, Ancho, Canales de color)
        height, w, _ = frame.shape
        
        # 2. Calcular la proporción exacta (Aspect Ratio) del video original
        aspect_ratio = height / w
        
        # 3. Ajustar el alto del texto según dónde se va a reproducir.
        # Las letras son más altas que anchas. Usamos un multiplicador (0.55 o 0.50)
        # para que la imagen final no se vea estirada ni recortada en los bordes.
        if mode == "gui":
            new_height = int(width * aspect_ratio * 0.55)  # Optimizado para la fuente Courier de la UI
        else:
            new_height = int(width * aspect_ratio * 0.50)  # Optimizado para la fuente de la Consola

        # Evitar errores matemáticos si el alto da cero
        if new_height <= 0: 
            new_height = 1
        
        # 4. Redimensionar el fotograma COMPLETO a la nueva escala de caracteres
        resized = cv2.resize(frame, (width, new_height))
        
        # 5. Convertir a escala de grises (eliminamos colores, solo nos interesan brillos del 0 al 255)
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

        ascii_rows = []
        # 6. Recorrer cada fila de píxeles del fotograma
        for row in gray:
            # Traducir cada píxel numérico (0-255) a un caracter de nuestra lista
            line = "".join([self.ascii_chars[int((pixel / 255) * (len(self.ascii_chars) - 1))] for pixel in row])
            ascii_rows.append(line)
        
        # 7. Unir todas las filas con un salto de línea para formar la imagen de texto completa
        return "\n".join(ascii_rows)