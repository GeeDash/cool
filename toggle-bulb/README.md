# 💡 Toggle Bulb — Interaction Effect

**Toggle Bulb** es un mini proyecto interactivo inspirado en un concepto visual popularizado en TikTok por `@meowish.dev`.

Forma parte del repositorio **Cool**, una colección de proyectos creativos, experimentos visuales e interfaces interactivas desarrolladas con distintas tecnologías web y de programación.

Este proyecto recrea el efecto de una bombilla que puede encenderse o apagarse jalando una cuerda con física elástica simulada utilizando únicamente tecnologías web nativas.

---

## 🎯 Descripción

La interacción principal consiste en arrastrar una cuerda hacia abajo usando mouse o gestos táctiles.

Cuando el usuario supera cierto umbral de arrastre:

- La bombilla cambia de estado
- El ambiente cambia entre claro y oscuro
- Se activa un resplandor dinámico
- La cuerda vuelve con una animación elástica tipo *snap*

Todo el efecto está desarrollado sin frameworks externos.

---

## 🚀 Características

### 🪢 Efecto de Cuerda Elástica

La cuerda puede:

- Arrastrarse físicamente
- Tener límite de extensión
- Regresar con rebote dinámico usando `cubic-bezier`

Compatible con:
- Mouse
- Touch móvil

---

### 💡 Cambio Dinámico de Ambiente

El proyecto alterna entre estados:

- Encendido
- Apagado

mediante:
- Variables CSS
- Transiciones suaves
- Manipulación dinámica de clases

---

### 🎨 Diseño SVG Responsivo

La bombilla fue creada completamente con SVG, permitiendo:

- Escalado perfecto
- Alta nitidez
- Adaptabilidad a cualquier resolución

---

### 📱 Soporte Mobile

Incluye soporte para:

- `touchstart`
- `touchmove`
- `touchend`

garantizando funcionamiento correcto en smartphones y tablets.

---

## 🛠️ Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript Vanilla (ES6)
- SVG
- CSS Variables
- CSS Animations

---

## 📂 Estructura del Proyecto

```text
toggleBulb/
├── index.html   # Estructura principal y SVG de la bombilla
├── style.css    # Variables, animaciones y estilos visuales
└── script.js    # Lógica de interacción y física del arrastre
```

---

## 💻 Ejecución

No necesitas:

- Dependencias
- Frameworks
- Node.js
- Compiladores
- Servidores locales

Simplemente:

1. Descarga o clona el repositorio
2. Abre la carpeta del proyecto
3. Ejecuta:

```text
index.html
```

en cualquier navegador moderno.

---

## 🧠 Funcionamiento Interno

### 📌 1. Sistema de Arrastre

El script calcula la distancia vertical recorrida desde que el usuario comienza a jalar la cuerda.

Ejemplo:

```javascript
if (deltaY > 0 && deltaY < maxPull) {
    cord.style.transform =
        `translateX(-50%) translateY(${deltaY}px)`;
}
```

Esto limita el estiramiento máximo para mantener una sensación física más natural.

---

### 📌 2. Cambio de Estado (Toggle)

Cuando el usuario supera cierto umbral de arrastre:

- Se activa/desactiva `.is-on`
- La escena cambia visualmente
- La cuerda vuelve con animación elástica

```javascript
cord.style.transition =
    'transform 0.3s cubic-bezier(0.57, 1.83, 0.43, 0.88)';

cord.style.transform =
    'translateX(-50%) translateY(0px)';
```

---

### 📌 3. Resplandor Dinámico

Cuando el sistema entra en estado activo:

```css
.toggle-scene.is-on .bulb__glass {
    fill: var(--bulb-glass-on);
    filter: drop-shadow(
        0 0 25px rgba(245, 224, 163, 0.8)
    );
}
```

Esto genera:
- iluminación ambiental
- efecto glow
- transición suave entre estados

---

## ⚙️ Conceptos Aplicados

Este proyecto implementa conceptos importantes de frontend moderno:

- Manipulación del DOM
- Eventos táctiles y de mouse
- Animaciones CSS
- Física visual básica
- Variables CSS dinámicas
- SVG interactivo
- UI micro-interactions

---

## 🎥 Resultado

El resultado es una interacción minimalista, fluida y visualmente satisfactoria inspirada en interfaces modernas y animaciones virales de redes sociales.

Una bombilla.
Una cuerda.
Y suficiente dopamina visual para perder 20 minutos jalándola sin razón.

---

## 📝 Créditos

Inspirado en contenido visual compartido por la comunidad frontend y conceptos interactivos vistos en TikTok.

Proyecto adaptado y recreado con fines educativos y experimentales.

---

## 📄 Licencia

Uso libre para aprendizaje, práctica y experimentación personal.