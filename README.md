# Mapa de Policía - Puebla

Aplicación React + Vite que muestra oficinas, casetas y drones móviles en Puebla usando Leaflet/OpenStreetMap y TailwindCSS.

## Scripts
- `npm run dev`: entorno de desarrollo
- `npm run build`: compilar a `dist/`
- `npm run preview`: previsualizar build

## Variables de entorno
No se requiere API Key para Leaflet/OSM. Si más adelante integras Google Maps, usa `VITE_GOOGLE_MAPS_API_KEY` en `.env`.

## Despliegue (GitHub Pages)
Este repo usa GitHub Actions para publicar en Pages. La base pública está configurada en `vite.config.js` con `base: '/mapa-policia-puebla/'`. Si cambias el nombre del repo o usas dominio personalizado, actualiza ese valor.

## Stack
- React 18, Vite 5
- Leaflet y react-leaflet
- TailwindCSS

## Notas
- Para grandes volúmenes de marcadores, considera clustering.
- Para animaciones más suaves, se recomienda actualizar posiciones vía APIs de Leaflet y evitar renders por frame.
