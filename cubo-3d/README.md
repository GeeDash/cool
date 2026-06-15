# 🧊 Cubo 3D con CSS

Una animación creada únicamente con HTML5 y CSS3 que recrea un cubo tridimensional girando de forma continua mediante transformaciones 3D y animaciones CSS.

El proyecto utiliza `transform-style: preserve-3d`, `perspective`, `rotateX()`, `rotateY()` y `translateZ()` para construir las seis caras del cubo y generar una ilusión tridimensional sin necesidad de JavaScript.

## ✨ Demo

El cubo rota constantemente sobre los ejes X e Y mostrando sus seis caras en un entorno 3D.

- 🧊 Cubo construido completamente con CSS
- 🔄 Rotación infinita y fluida
- 🌌 Efecto tridimensional real
- ⚡ Sin JavaScript

## 🚀 Tecnologías

- HTML5
- CSS3
- CSS Animations
- CSS 3D Transforms

## 📂 Estructura

```text
3d-cube/
│
├── index.html
├── style.css
└── README.md
```

## 🎨 Características

- Diseño minimalista.
- Animación suave y ligera.
- Sin JavaScript.
- Fácil de personalizar.
- Responsive.
- Excelente práctica para comprender transformaciones 3D.

## ⚙️ Cómo ejecutar

1. Clona el repositorio:

```bash
git clone https://github.com/TU-USUARIO/3d-cube.git
```

2. Accede al proyecto:

```bash
cd 3d-cube
```

3. Abre `index.html` en tu navegador.

No requiere instalación ni dependencias.

## 🔧 Personalización

### Tamaño del cubo

```css
.scene{
    width:200px;
    height:200px;
}
```

### Velocidad de rotación

```css
animation: spin 10s infinite linear;
```

### Color de las caras

```css
background: rgba(212, 0, 255, 0.8);
```

### Perspectiva

```css
perspective: 800px;
```

## 📚 Conceptos Practicados

- Perspectiva CSS
- Transformaciones 3D
- RotateX y RotateY
- TranslateZ
- Preserve-3D
- Keyframes
- Posicionamiento absoluto

## 🎯 Objetivo

Este proyecto forma parte de una colección de experimentos visuales enfocados en aprender animaciones CSS, comprender el funcionamiento del espacio tridimensional en la web y explorar técnicas modernas de diseño visual sin utilizar JavaScript.

---

Desarrollado como práctica de transformaciones 3D y animaciones CSS para Proyecto COOL.