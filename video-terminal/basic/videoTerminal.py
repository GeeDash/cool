import os
import time
import cv2

# 1. Definir la lista de caracteres ASCII ordenados por "densidad" de color
# Desde el más oscuro/denso (para zonas oscuras) al más ligero (para zonas claras)
ASCII_CHARS = ["@", "#", "S", "%", "?", "*", "+", ";", ":", ",", "."]


def frame_to_ascii(frame, width=100):
    """Convierte un fotograma de video en una cadena de texto ASCII."""
    # Obtener las dimensiones originales del fotograma
    height, w, _ = frame.shape

    # Calcular la nueva altura manteniendo la relación de aspecto
    # Se multiplica por 0.45 porque los caracteres de la terminal son más altos que anchos
    aspect_ratio = height / w
    new_height = int(width * aspect_ratio * 0.45)

    if new_height == 0:
        new_height = 1

    # Redimensionar el fotograma a la resolución de la terminal
    resized = cv2.resize(frame, (width, new_height))

    # Convertir la imagen a escala de grises (valores de 0 a 255)
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

    # Construir las filas de caracteres
    ascii_rows = []
    for row in gray:
        pixel_row = []
        for pixel_value in row:
            # Mapear el valor del píxel (0-255) al índice de nuestra lista ASCII_CHARS
            index = int((pixel_value / 255) * (len(ASCII_CHARS) - 1))
            pixel_row.append(ASCII_CHARS[index])
        ascii_rows.append("".join(pixel_row))

    return "\n".join(ascii_rows)


def play_ascii_video(video_path, width=120):
    """Carga el video y lo reproduce en la terminal."""
    # Abrir el archivo de video
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("Error: No se pudo abrir el video.")
        return

    # Obtener los FPS (fotogramas por segundo) para calcular el retraso entre frames
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0:
        fps = 30  # Valor por defecto si no se detecta
    frame_delay = 1 / fps

    try:
        while cap.isOpened():
            start_time = time.time()

            ret, frame = cap.read()
            if not ret:
                break  # Fin del video

            # Convertir el fotograma actual a ASCII
            ascii_frame = frame_to_ascii(frame, width=width)

            # Limpiar la pantalla de la terminal según el sistema operativo
            # 'cls' para Windows, 'clear' para Linux/Mac
            os.system("cls" if os.name == "nt" else "clear")

            # Imprimir el cuadro en la terminal
            print(ascii_frame)

            # Controlar el tiempo de reproducción para mantener la velocidad original
            elapsed_time = time.time() - start_time
            sleep_time = frame_delay - elapsed_time
            if sleep_time > 0:
                time.sleep(sleep_time)

    except KeyboardInterrupt:
        print("\nReproducción detenida por el usuario.")

    finally:
        cap.release()


if __name__ == "__main__":
    # REEMPLAZA ESTO con la ruta de tu propio archivo de video (ej. .mp4)
    VIDEO_PATH = "tu_video.mp4"

    # Nota: Asegúrate de tener la ventana de la terminal maximizada o con una fuente pequeña.
    # El ancho por defecto de 120 caracteres funciona bien en pantallas medianas.
    play_ascii_video(VIDEO_PATH, width=120)