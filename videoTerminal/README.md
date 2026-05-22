# ASCII Video Player 🎬🍿

¡Bienvenido a **ASCII Video Player**!  
Este proyecto forma parte del repositorio **Cool**, una colección de proyectos creativos, visuales y experimentales desarrollados principalmente en Python.

La carpeta `videoTerminal/` documenta la evolución de un reproductor capaz de transformar videos normales en **arte ASCII en tiempo real**, tanto desde archivos locales como desde enlaces de internet (YouTube/TikTok).

El proyecto muestra el paso desde un prototipo básico ejecutado en consola hasta una arquitectura modular moderna con interfaz gráfica.

---

## 📂 Estructura de la Carpeta

```text
videoTerminal/
├── basico/
│   └── videoTerminal.py      # Versión original (todo en un solo archivo, solo consola)
│
└── conGUI/                   # Versión modular moderna con interfaz gráfica
    ├── video_processor.py    # Procesamiento y lógica principal
    └── main_gui.py           # Interfaz gráfica con CustomTkinter
```

---

## 🛠️ Descripción

### 📁 `basico/`

Contiene la primera versión funcional del proyecto.

Características:

- Script único y lineal
- Reproducción ASCII en consola
- Compatible únicamente con videos locales
- Sin interfaz gráfica
- Arquitectura experimental inicial

Archivo principal:

```text
videoTerminal.py
```

---

### 🖥️ `conGUI/`

Contiene la versión moderna y modular del reproductor.

El proyecto fue reorganizado utilizando separación de responsabilidades:

#### 📌 `video_processor.py`

Se encarga de:

- Descargar videos mediante `yt-dlp`
- Filtrar automáticamente playlists y enlaces tipo *Mix*
- Procesar frames con OpenCV
- Convertir video a ASCII en tiempo real
- Gestionar reproducción y procesamiento

---

#### 📌 `main_gui.py`

Interfaz gráfica desarrollada con `CustomTkinter`.

Incluye:

- Modo oscuro
- Controles interactivos
- Slider de resolución
- Selector de modo de reproducción
- Integración con procesamiento multihilo

---

## ⭐ Característica Especial

La versión moderna permite elegir dinámicamente dónde reproducir el video:

### 🖼️ Interfaz Gráfica

El video ASCII se renderiza dentro de la ventana de la aplicación.

### 💻 Consola

La interfaz entra en espera y la reproducción ocurre directamente en la terminal para maximizar velocidad y rendimiento.

---

## 🚀 Requisitos

- Python 3.10 o superior
- Pip actualizado

Instalar dependencias:

```bash
pip install opencv-python customtkinter yt-dlp pillow
```

---

## ⚠️ Problemas con Python PATH

Si el sistema no detecta correctamente las librerías debido a múltiples instalaciones de Python:

```powershell
& C:\Users\PC\AppData\Local\Microsoft\WindowsApps\python3.11.exe -m pip install customtkinter yt-dlp opencv-python pillow
```

---

## 💻 Ejecución

Desde esta carpeta:

```text
videoTerminal/conGUI/
```

Ejecutar:

```powershell
& C:\Users\PC\AppData\Local\Microsoft\WindowsApps\python3.11.exe main_gui.py
```

---

## ⚙️ Características

- Conversión de video a ASCII en tiempo real
- Descarga inteligente desde YouTube/TikTok
- Compatibilidad con videos locales
- Resolución ajustable dinámicamente
- Renderizado en GUI o terminal
- Arquitectura modular
- Procesamiento multihilo
- Interfaz moderna en modo oscuro

---

## 🧠 Tecnologías Utilizadas

- Python
- OpenCV
- CustomTkinter
- yt-dlp
- Pillow
- Threading

---

## 🎥 Resultado

El sistema convierte cualquier video en una experiencia visual estilo terminal retro/cyberpunk utilizando caracteres ASCII renderizados frame por frame en tiempo real.

Porque los videos normales no tienen suficiente personalidad.
