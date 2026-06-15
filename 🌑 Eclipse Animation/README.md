# 🌑 Eclipse Animation

Una animación minimalista creada únicamente con HTML y CSS que recrea un eclipse solar mediante el movimiento de dos círculos superpuestos.

El proyecto utiliza posicionamiento absoluto, sombras (`box-shadow`) y animaciones CSS (`@keyframes`) para generar una transición suave entre eclipse parcial y eclipse total.

## ✨ Demo

La luna se desplaza horizontalmente sobre el sol simulando las distintas fases de un eclipse:

* ☀️ Sol visible
* 🌘 Eclipse parcial
* 🌑 Eclipse total
* 🌒 Eclipse parcial inverso

## 🚀 Tecnologías

* HTML5
* CSS3
* CSS Animations
* Flexbox

## 📂 Estructura

```text
eclipse-animation/
│
├── index.html
├── style.css
└── README.md
```

## 🎨 Características

* Diseño minimalista.
* Sin JavaScript.
* Animación fluida y ligera.
* Responsive.
* Fácil de personalizar.

## ⚙️ Cómo ejecutar

1. Clona el repositorio:

```bash
git clone https://github.com/TU-USUARIO/eclipse-animation.git
```

2. Entra al proyecto:

```bash
cd eclipse-animation
```

3. Abre `index.html` en tu navegador.

No requiere instalación ni dependencias.

## 🔧 Personalización

### Tamaño del eclipse

```css
.container{
    width:250px;
    height:250px;
}
```

### Velocidad de animación

```css
animation:eclipse 3.5s ease-in-out infinite alternate;
```

### Intensidad del brillo

```css
box-shadow:
    0 0 15px rgba(255,255,255,.8),
    0 0 35px rgba(255,255,255,.5),
    0 0 80px rgba(255,255,255,.25);
```

## 📚 Conceptos Practicados

* Posicionamiento absoluto
* Transformaciones CSS
* Keyframes
* Sombras y efectos visuales
* Composición de elementos circulares

## 🎯 Objetivo

Este proyecto forma parte de una colección de experimentos visuales enfocados en aprender animaciones CSS, recrear efectos vistos en redes sociales y explorar técnicas modernas de interacción web.

---

Desarrollado como práctica de animación y efectos visuales para Proyecto COOL.
