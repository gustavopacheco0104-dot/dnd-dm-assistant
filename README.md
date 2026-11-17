# 🐉 DM Assistant - D&D 5e

Herramienta interactiva para asistir a un Dungeon Master durante sus partidas de Dungeons & Dragons 5e. Funciona en navegador (diseño responsivo Mobile-First) y como aplicación Android (.apk) mediante CapacitorJS.

## 🔗 Enlaces

- 🌐 **Aplicación web (Vercel):** [PEGAR_AQUÍ_EL_ENLACE_DE_VERCEL]
- 📱 **Descargar APK (Release v1.0.0):** https://github.com/gustavopacheco0104-dot/dnd-dm-assistant/releases

## ✨ Funcionalidades

### 1. Bestiario y enemigos
- Listado y búsqueda de monstruos consumiendo `/api/monsters`.
- Tarjeta genérica y reutilizable con: nombre, Clase de Armadura (AC), Puntos de Golpe (HP) y Nivel de Desafío (CR).

### 2. Generador de Loot
- Selección del nivel de desafío del monstruo derrotado.
- Generación aleatoria de monedas y objetos reales obtenidos de `/api/equipment` y `/api/magic-items`.
- La cantidad y calidad del botín escalan con el nivel de desafío.

### 3. Bandeja de dados
- Dados d4, d6, d8, d10, d12, d20 y d100.
- Resultado aleatorio dentro del rango de cada dado, mostrado de forma destacada.

## 🛠️ Tecnologías

- React
- Vite
- JavaScript
- CSS (Mobile-First)
- [D&D 5e API](https://www.dnd5eapi.co/api/) (pública, sin API Key)
- CapacitorJS (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`)
- Vercel (despliegue continuo)
- Git y GitHub (ramas, commits y Releases)

## 📁 Estructura del proyecto

```
src/
├── components/   # Componentes reutilizables (Navbar, Card, etc.)
├── pages/        # Módulos: Bestiary, LootGenerator, DiceTray
├── services/     # Consumo de la API (api.js)
├── App.jsx
├── main.jsx
└── index.css
```

## 🚀 Instalación y ejecución local

```bash
# Clonar el repositorio
git clone https://github.com/gustavopacheco0104-dot/dnd-dm-assistant.git
cd dnd-dm-assistant

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Generar build de producción (carpeta dist/)
npm run build
```

## 📱 Generar el APK (Android)

```bash
npm run build
npx cap sync
npx cap open android
```

Luego, en Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

## 🌿 Flujo de ramas

- `main`: versión estable, lista para producción.
- `develop`: integración del desarrollo.
- `feature/*`: una rama por funcionalidad (`feature/estructura-base`, `feature/dados`, `feature/bestiario`, `feature/loot`).

## 👤 Autores

**Gustavo Pacheco y Juan Sebastian Rios**
GitHub: [@gustavopacheco0104-dot](https://github.com/gustavopacheco0104-dot)

---
Proyecto académico desarrollado de forma individual.