import threading
import time
import os
import cv2
import customtkinter as ctk
from tkinter import filedialog, messagebox
from video_processor import VideoProcessor

# Estética moderna en modo oscuro
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class AsciiAppPro(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("ASCII Multi-Player Pro")
        self.geometry("1100x800")
        
        self.processor = VideoProcessor()
        self.is_playing = False
        self.current_video = None

        # --- Distribución de la Ventana (Grid) ---
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # Panel Izquierdo: Controles
        self.sidebar = ctk.CTkFrame(self, width=220, corner_radius=0)
        self.sidebar.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)

        # Título
        self.lbl_title = ctk.CTkLabel(self.sidebar, text="ASCII Control", font=ctk.CTkFont(size=18, weight="bold"))
        self.lbl_title.pack(pady=20, padx=10)

        # Cargar Video desde tu PC
        self.btn_load = ctk.CTkButton(self.sidebar, text="📁 Cargar Video Local", command=self.load_local_video)
        self.btn_load.pack(pady=15, padx=15, fill="x")

        # Entrada de Links de Internet
        self.lbl_url = ctk.CTkLabel(self.sidebar, text="Pegar Link (TikTok/YouTube):")
        self.lbl_url.pack(pady=(10, 0))
        self.url_entry = ctk.CTkEntry(self.sidebar, placeholder_text="https://www.youtube.com...")
        self.url_entry.pack(pady=5, padx=15, fill="x")
        
        self.btn_net = ctk.CTkButton(self.sidebar, text="🌐 Descargar y Ver", fg_color="#1f9254", hover_color="#15663a", command=self.load_url_video)
        self.btn_net.pack(pady=5, padx=15, fill="x")

        # NUEVO: Selector de Modo de Reproducción (GUI o Consola)
        self.lbl_mode = ctk.CTkLabel(self.sidebar, text="🎬 Destino del Video:")
        self.lbl_mode.pack(pady=(20, 0))
        self.mode_menu = ctk.CTkOptionMenu(self.sidebar, values=["Interfaz Gráfica", "Consola de Comandos"])
        self.mode_menu.pack(pady=5, padx=15, fill="x")

        # Control Deslizante de Resolución (Ancho de caracteres)
        self.res_slider = ctk.CTkSlider(self.sidebar, from_=40, to=180, number_of_steps=14, command=self.update_resolution_label)
        self.res_slider.set(100)
        self.res_slider.pack(pady=(25, 0), padx=15)
        
        self.res_label = ctk.CTkLabel(self.sidebar, text="Resolución Ancho: 100")
        self.res_label.pack(pady=5)

        # Botón para detener todo
        self.btn_stop = ctk.CTkButton(self.sidebar, text="🛑 Detener", fg_color="#c0392b", hover_color="#962d22", command=self.stop_playback)
        self.btn_stop.pack(pady=30, padx=15, fill="x")

        # Panel Derecho: La pantalla del reproductor integrado
        self.screen = ctk.CTkTextbox(self, font=("Courier New", 8), fg_color="black", text_color="#22c55e", wrap="none")
        self.screen.grid(row=0, column=1, sticky="nsew", padx=10, pady=10)
        self.screen.insert("1.0", "\n\n\tSISTEMA LISTO\n\tSelecciona un video para comenzar...")

    def update_resolution_label(self, val):
        self.res_label.configure(text=f"Resolución Ancho: {int(val)}")

    def load_local_video(self):
        path = filedialog.askopenfilename(filetypes=[("Archivos de Video", "*.mp4 *.avi *.mkv *.mov")])
        if path:
            self.execute_playback_thread(path)

    def load_url_video(self):
        url = self.url_entry.get().strip()
        if url:
            self.btn_net.configure(text="⏳ Descargando...", state="disabled")
            # Hilo de descarga para que la app no se cuelgue mientras ytdl trabaja
            threading.Thread(target=self.async_download, args=(url,), daemon=True).start()
        else:
            messagebox.showwarning("Atención", "Por favor ingresa un enlace primero.")

    def async_download(self, url):
        try:
            path = self.processor.download_video(url)
            self.execute_playback_thread(path)
        except Exception as e:
            messagebox.showerror("Error de Descarga", f"No se pudo procesar el enlace:\n{e}")
        finally:
            self.btn_net.configure(text="🌐 Descargar y Ver", state="normal")

    def execute_playback_thread(self, path):
        self.stop_playback()
        self.is_playing = True
        self.current_video = path
        # Hilo de reproducción dinámico
        threading.Thread(target=self.core_video_loop, daemon=True).start()

    def stop_playback(self):
        self.is_playing = False

    def core_video_loop(self):
        cap = cv2.VideoCapture(self.current_video)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        delay = 1 / fps

        # Detectar el destino seleccionado en el menú desplegable
        selected_mode = "gui" if self.mode_menu.get() == "Interfaz Gráfica" else "console"

        if selected_mode == "console":
            self.screen.delete("1.0", "end")
            self.screen.insert("1.0", "\n\n\t🎬 REPRODUCIENDO EN CONSOLA...\n\tMira tu terminal de comandos.")

        while cap.isOpened() and self.is_playing:
            start_time = time.time()
            ret, frame = cap.read()
            if not ret: 
                break

            # Leer resolución del slider en tiempo real
            resolution = int(self.res_slider.get())
            
            # Procesar el cuadro actual
            ascii_text = self.processor.frame_to_ascii(frame, resolution, mode=selected_mode)

            # Renderizar según el modo elegido
            if selected_mode == "gui":
                self.screen.delete("1.0", "end")
                self.screen.insert("1.0", ascii_text)
            else:
                # Modo Consola: Limpia pantalla de comandos e imprime
                os.system("cls" if os.name == "nt" else "clear")
                print(ascii_text)

            # Sincronización exacta de velocidad de fotogramas
            elapsed_time = time.time() - start_time
            sleep_time = delay - elapsed_time
            if sleep_time > 0: 
                time.sleep(sleep_time)

        cap.release()
        if selected_mode == "console":
            os.system("cls" if os.name == "nt" else "clear")
            print("--- Reproducción finalizada ---")
        
        self.screen.delete("1.0", "end")
        self.screen.insert("1.0", "\n\n\tSISTEMA LISTO\n\tSelecciona un video para comenzar...")
        self.is_playing = False

if __name__ == "__main__":
    app = AsciiAppPro()
    app.mainloop()