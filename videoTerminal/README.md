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

---

### 2. `conGUI/` (Recomendado)

Esta es la **versión definitiva y profesional**. El código fue rediseñado bajo el principio de **Separación de Responsabilidades**, dividiéndose en dos archivos interconectados:

#### 📌 `video_processor.py`

Contiene toda la lógica pesada. Se encarga de:

- Descargar videos usando `yt-dlp`
- Ignorar automáticamente playlists infinitas o enlaces tipo *Mix*
- Procesar fotogramas píxel por píxel usando OpenCV
- Convertir video en arte ASCII sin recortar bordes

#### 📌 `main_gui.py`

Es la aplicación principal que debes ejecutar. Proporciona:

- Interfaz moderna en modo oscuro
- Controles interactivos
- Selector de resolución
- Selector de salida de reproducción
- Integración total con el procesador de video

---

## ⭐ Característica Especial de la Versión Final

A través del menú desplegable de la interfaz, puedes elegir dinámicamente el **Destino del Video**:

### 🖥️ Interfaz Gráfica

El video se dibuja fluidamente dentro de la misma ventana de la aplicación.

### 💻 Consola de Comandos

La ventana gráfica entra en espera y el video se reproduce directamente en tu terminal (VS Code / PowerShell) a máxima velocidad.

---

## 🚀 Requisitos e Instalación

Para ejecutar la versión final necesitas tener instalado:

- Python 3.10 o superior
- Pip actualizado

Instala las librerías necesarias ejecutando:

```bash
pip install opencv-python customtkinter yt-dlp
```

---

## ⚠️ Solución de Problemas (PATH de Python)

Si tienes múltiples versiones de Python instaladas y el sistema no detecta correctamente los módulos, ejecuta el instalador apuntando directamente a tu versión de Python:

```powershell
& C:\Users\PC\AppData\Local\Microsoft\WindowsApps\python3.11.exe -m pip install customtkinter yt-dlp
```

---

## 💻 Cómo Ejecutar el Programa

### 1️⃣ Abrir la terminal en la raíz del proyecto

Ejemplo:

```text
cool/
```

---

### 2️⃣ Navegar hasta la carpeta de la interfaz gráfica

```bash
cd cool/videoTerminal/conGUI
```

---

### 3️⃣ Ejecutar el programa

```powershell
& C:\Users\PC\AppData\Local\Microsoft\WindowsApps\python3.11.exe main_gui.py
```

---

## ⚙️ Características Destacadas

### 🌐 Descarga Web Inteligente

Pega enlaces de YouTube o TikTok. El sistema filtrará automáticamente playlists o enlaces tipo *Mix* para descargar únicamente el video seleccionado.

---

### 📁 Carga de Videos Locales

Compatible con formatos comunes:

- `.mp4`
- `.avi`
- `.mkv`
- `.mov`

---

### 🎚️ Resolución Dinámica

Usa el *slider* del panel izquierdo para aumentar o disminuir el ancho de caracteres del video en tiempo real.

A mayor resolución:
- Más definición
- Más detalle
- Más carga de procesamiento 😈

---

### ⚡ Multihilo (Threading)

Las descargas y reproducciones se ejecutan en procesos independientes.

Esto evita:
- Congelamientos
- Bloqueos de interfaz
- El legendario mensaje:
  > “La aplicación no responde”

---

## 📌 Estado del Proyecto

El proyecto representa una evolución completa desde un prototipo experimental en consola hasta una aplicación modular moderna con:

- Arquitectura limpia
- Procesamiento optimizado
- Interfaz gráfica avanzada
- Reproducción híbrida GUI/Terminal
- Descarga inteligente desde internet

---

## 🧠 Tecnologías Utilizadas

- Python
- OpenCV
- CustomTkinter
- yt-dlp
- Threading
- PIL / Pillow

---

## 🎥 Resultado

El programa transforma cualquier video en una experiencia visual retro estilo terminal cyberpunk usando caracteres ASCII renderizados en tiempo real.

Porque ver videos normales está sobrevalorado.
