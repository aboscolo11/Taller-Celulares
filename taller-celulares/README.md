# 📱 Taller de Celulares — Guía de instalación

## Estructura del proyecto

```
taller-celulares/
├── index.html              ← HTML base (punto de entrada)
├── package.json            ← Dependencias del proyecto
├── vite.config.js          ← Configuración de Vite + PWA
├── public/
│   ├── manifest.json       ← Config para instalar como app
│   ├── icon-192.png        ← Ícono de la app (192x192px)
│   └── icon-512.png        ← Ícono de la app (512x512px)
└── src/
    ├── main.jsx            ← Arranca React
    ├── App.jsx             ← Todo el código de la app (JSX)
    ├── storage.js          ← Guarda datos en el celular
    └── index.css           ← Estilos globales
```

---

## Lenguajes que usás

| Archivo | Lenguaje | Para qué sirve |
|---------|----------|----------------|
| `index.html` | HTML | Estructura base de la página |
| `index.css` | CSS | Estilos globales (fuentes, reset) |
| `App.jsx` | JSX (JavaScript + React) | Toda la lógica y visual de la app |
| `storage.js` | JavaScript | Guardar datos en el celular |
| `vite.config.js` | JavaScript | Configurar el proyecto |
| `manifest.json` | JSON | Datos para instalar como app |

---

## PASO A PASO: Configurar en VS Code

### 1. Instalar Node.js
- Entrá a https://nodejs.org
- Bajá la versión **LTS** (la recomendada)
- Instalala normalmente

### 2. Abrir el proyecto en VS Code
- Descomprimí la carpeta `taller-celulares`
- Abrí VS Code → Archivo → Abrir Carpeta → seleccioná `taller-celulares`

### 3. Instalar dependencias
- En VS Code abrí la terminal: **Ver → Terminal** (o Ctrl+ñ)
- Escribí:
```bash
npm install
```
- Esperá que termine (descarga React y Vite)

### 4. Agregar íconos
- Creá o bajate dos imágenes PNG cuadradas:
  - `icon-192.png` (192x192 píxeles)
  - `icon-512.png` (512x512 píxeles)
- Poné ambas dentro de la carpeta `public/`
- Podés usar cualquier imagen de celular o herramienta

### 5. Probar en tu PC
```bash
npm run dev
```
- Abrí el navegador en: http://localhost:5173
- Ya podés usar la app en tu PC

---

## PASO A PASO: Subir a internet gratis (Netlify)

Como la PC no va a estar siempre encendida, subís la app a Netlify
para accederla desde el celular en cualquier momento.

### 1. Crear cuenta en Netlify
- Entrá a https://netlify.com
- Creá una cuenta gratis (podés usar tu mail o GitHub)

### 2. Construir la app
En la terminal de VS Code:
```bash
npm run build
```
- Esto crea una carpeta llamada `dist/` con la app lista para subir

### 3. Subir a Netlify
- En Netlify, hacé clic en **"Add new site" → "Deploy manually"**
- Arrastrá la carpeta `dist/` al área que dice "Drag and drop"
- En segundos te da una URL tipo: `https://tu-taller.netlify.app`

### 4. Cada vez que modifiques algo
```bash
npm run build
```
Y volvés a arrastrar la carpeta `dist/` a Netlify.

---

## PASO A PASO: Instalar en el celular como app (Android)

1. Abrí **Chrome** en tu celular
2. Entrá a tu URL de Netlify (ej: `https://tu-taller.netlify.app`)
3. Tocá los **3 puntos** arriba a la derecha
4. Tocá **"Agregar a pantalla de inicio"**
5. Confirmá el nombre → **Agregar**
6. ¡Listo! Aparece en tu pantalla como una app normal 🎉

## En iPhone (Safari)

1. Abrí **Safari** (no Chrome) en el iPhone
2. Entrá a tu URL de Netlify
3. Tocá el botón **Compartir** (el cuadradito con flecha)
4. Tocá **"Añadir a pantalla de inicio"**
5. Confirmá → **Añadir**

---

## Características de la app instalada
- ✅ Funciona sin internet (offline) gracias al Service Worker
- ✅ Los datos se guardan en el celular (no se borran)
- ✅ Se ve como app nativa, sin barra del navegador
- ✅ Ícono propio en la pantalla de inicio

---

## ¿Problemas frecuentes?

**"npm no se reconoce"** → Reiniciá VS Code después de instalar Node.js

**"La app no aparece para instalar"** → La URL debe ser HTTPS (Netlify lo hace automático)

**"Los datos se borraron"** → No borres los datos del navegador/app. Si desinstalás la app, los datos se pierden.
