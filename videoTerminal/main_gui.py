#### 2. Archivo: `main_gui.py` (La Interfaz)
import customtkinter as ctk
from tkinter import filedialog, messagebox
import threading
import time
import cv2
from video_processor import VideoProcessor # <--- IMPORTAMOS TU OTRO ARCHIVO

class AsciiApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("ASCII Player Modular Pro")
        self.geometry("1000x800")
        
        self.processor = VideoProcessor()
        self.is_playing = False
        self.current_video = None

        # --- Interfaz ---
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.sidebar = ctk.CTkFrame(self, width=200)
        self.sidebar.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)

        self.btn_load = ctk.CTkButton(self.sidebar, text="Video Local", command=self.load_local)
        self.btn_load.pack(pady=20, padx=10)

        self.url_entry = ctk.CTkEntry(self.sidebar, placeholder_text="Link TikTok/YouTube")
        self.url_entry.pack(pady=5, padx=10)
        
        self.btn_net = ctk.CTkButton(self.sidebar, text="Descargar y Ver", fg_color="green", command=self.load_url)
        self.btn_net.pack(pady=5, padx=10)

        self.res_slider = ctk.CTkSlider(self.sidebar, from_=50, to=200, command=self.update_label)
        self.res_slider.set(100)
        self.res_slider.pack(pady=20)
        
        self.res_label = ctk.CTkLabel(self.sidebar, text="Resolución: 100")
        self.res_label.pack()

        self.btn_stop = ctk.CTkButton(self.sidebar, text="Detener", fg_color="red", command=self.stop)
        self.btn_stop.pack(pady=20)

        self.screen = ctk.CTkTextbox(self, font=("Courier New", 8), fg_color="black", text_color="white", wrap="none")
        self.screen.grid(row=0, column=1, sticky="nsew", padx=10, pady=10)

    def update_label(self, val):
        self.res_label.configure(text=f"Resolución: {int(val)}")

    def load_local(self):
        path = filedialog.askopenfilename()
        if path:
            self.start_thread(path)

    def load_url(self):
        url = self.url_entry.get()
        if url:
            self.btn_net.configure(text="Bajando...", state="disabled")
            threading.Thread(target=self.download_and_play, args=(url,), daemon=True).start()

    def download_and_play(self, url):
        try:
            path = self.processor.download_video(url)
            self.start_thread(path)
        except Exception as e:
            messagebox.showerror("Error", f"Fallo descarga: {e}")
        finally:
            self.btn_net.configure(text="Descargar y Ver", state="normal")

    def start_thread(self, path):
        self.stop()
        self.is_playing = True
        self.current_video = path
        threading.Thread(target=self.play_loop, daemon=True).start()

    def stop(self):
        self.is_playing = False

    def play_loop(self):
        cap = cv2.VideoCapture(self.current_video)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        delay = 1/fps

        while cap.isOpened() and self.is_playing:
            t1 = time.time()
            ret, frame = cap.read()
            if not ret: break

            res = int(self.res_slider.get())
            ascii_txt = self.processor.frame_to_ascii(frame, res)

            # Actualización de UI
            self.screen.delete("1.0", "end")
            self.screen.insert("1.0", ascii_txt)

            t2 = time.time()
            wait = delay - (t2 - t1)
            if wait > 0: time.sleep(wait)

        cap.release()

if __name__ == "__main__":
    app = AsciiApp()
    app.mainloop()

