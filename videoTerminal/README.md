````markdown
# ASCII Video Player 🎬🍿

¡Bienvenido al proyecto **ASCII Video Player**! Esta aplicación en Python es capaz de capturar videos locales o descargarlos directamente desde internet (YouTube/TikTok) para transformarlos en **arte ASCII en tiempo real**.

El proyecto documenta la evolución del software, desde un script lineal único hasta una arquitectura profesional, moderna y modular con interfaz gráfica.

---

## 📂 Estructura del Proyecto

El repositorio está dividido según las fases de desarrollo del reproductor:

```text
videoTerminal/
├── basico/
│   └── videoTerminal.py      # Versión original (todo en un solo archivo, solo consola)
│
└── conGUI/                   # ¡VERSIÓN PREMIUM FINAL MODULAR!
    ├── video_processor.py    # El "cerebro" (lógica matemática y descargas con yt-dlp)
    └── main_gui.py           # La "cara" (interfaz gráfica con CustomTkinter)
```

---

## 🛠️ Descripción de las Carpetas

### 1. `basico/`

Contiene el prototipo inicial del proyecto (`videoTerminal.py`). Es un script único y lineal diseñado exclusivamente para reproducir videos locales de manera rústica directamente desde la consola de comandos. No cuenta con interfaz gráfica ni soporte avanzado para enlaces de internet.

### 2. `conGUI/` (Recomendado)

Esta es la **versión definitiva y profesional**. El código fue rediseñado bajo el principio de **Separación de Responsabilidades**, dividiéndose en dos archivos interconectados:

- **`video_processor.py`**  
  Contiene toda la lógica pesada. Se encarga de descargar videos usando `yt-dlp` (corregido para ignorar listas de reproducción infinitas que traban el programa) y procesa los fotogramas píxel por píxel con OpenCV sin recortar los bordes de la imagen.

- **`main_gui.py`**  
  Es la aplicación principal que debes ejecutar. Despliega una ventana moderna en modo oscuro usando `CustomTkinter`, con controles interactivos.

### ⭐ Característica Especial de la Versión Final

A través del menú desplegable de la interfaz, puedes elegir dinámicamente el **Destino del Video**:

1. **Interfaz Gráfica:**  
   El video se dibuja fluidamente dentro de la misma ventana de la aplicación.

2. **Consola de Comandos:**  
   La ventana de la app entra en espera y el video se reproduce directamente en tu terminal (VS Code / PowerShell) a máxima velocidad.

---

## 🚀 Requisitos e Instalación

Para ejecutar la versión final necesitas tener **Python 3.10 o superior** instalado.

Abre tu terminal e instala las librerías necesarias con el siguiente comando:

```bash
pip install opencv-python customtkinter yt-dlp
```

> **Nota de solución de problemas (PATH):**  
> Si tienes múltiples versiones de Python instaladas y el sistema no detecta los módulos, utiliza el instalador apuntando directamente a tu ejecutable de Python. Por ejemplo:
>
> ```powershell
> & C:\Users\PC\AppData\Local\Microsoft\WindowsApps\python3.11.exe -m pip install customtkinter yt-dlp
> ```

---

## 💻 Cómo Ejecutar el Programa

1. Abre tu terminal o consola de comandos en la raíz del proyecto (`GeeDash`).

2. Navega hasta la carpeta de la versión final:

```bash
cd cool/videoTerminal/conGUI
```

3. Ejecuta el archivo de la interfaz gráfica usando Python 3.11:

```powershell
& C:\Users\PC\AppData\Local\Microsoft\WindowsApps\python3.11.exe main_gui.py
```

---

## ⚙️ Características Destacadas

- **Descarga Web Inteligente:**  
  Pega enlaces de YouTube o TikTok. El sistema filtrará automáticamente enlaces tipo *Mix* o *Playlist* para descargar únicamente el video seleccionado.

- **Carga Local:**  
  Abre formatos comunes de video (`.mp4`, `.avi`, `.mkv`, `.mov`) almacenados en tu computadora.

- **Resolución Dinámica:**  
  Usa el *slider* del panel izquierdo para aumentar o disminuir el ancho de caracteres del video en tiempo real.  
  ¡A mayor resolución, mayor definición del arte ASCII!

- **Multihilo (Threading):**  
  Las descargas y reproducciones se ejecutan en procesos independientes. La interfaz gráfica nunca se congelará ni mostrará el molesto mensaje de *“No responde”*.

---

## 📌 Estado del Proyecto

El proyecto representa una evolución completa desde un prototipo experimental en consola hasta una aplicación modular con interfaz gráfica moderna, procesamiento optimizado y soporte híbrido entre GUI y terminal.

---
```
````
