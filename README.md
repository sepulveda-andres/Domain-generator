# 🌐 Domain Generator

Una aplicación web moderna construida con Astro y React para ayudarte a encontrar el dominio perfecto para tu proyecto.

## ✨ Características

- 🔍 **Búsqueda instantánea** de disponibilidad de dominios
- 🌍 **Soporte multiidioma** - Combina palabras en español e inglés
- 📚 **Diccionarios extensos** - Más de 1300 palabras organizadas por categorías
- 🎯 **Múltiples TLDs** - .com, .es, .org, .net, .io, .dev y más
- 🤖 **Combinaciones inteligentes** - Genera automáticamente variaciones de palabras clave
- ⚡ **Rendimiento optimizado** - Carga rápida con Astro y React Islands
- 🎨 **Interfaz moderna** - Diseño responsive con Tailwind CSS
- 📈 **SEO optimizado** - Meta tags completos y sitemap automático

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ 
- npm, yarn o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>

# Navegar al directorio
cd Domain-generator

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:4321`

## 📦 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye el proyecto para producción
npm run preview  # Previsualiza la construcción de producción
npm run astro    # Ejecuta comandos de Astro CLI
```

## 🏗️ Estructura del Proyecto

```
/
├── public/              # Archivos estáticos
│   ├── favicon.svg
│   ├── robots.txt
│   └── manifest.json
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── SEO.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── DomainSearch.tsx  # Componente React
│   │   ├── PopularKeywords.astro
│   │   ├── Stats.astro
│   │   └── DomainTips.astro
│   ├── data/           # Diccionarios de palabras
│   │   ├── spanish-words.ts  # ~600 palabras en español
│   │   └── english-words.ts  # ~700 palabras en inglés
│   ├── layouts/         # Layouts de página
│   │   └── Layout.astro
│   ├── pages/          # Páginas y rutas
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── api/
│   │       └── check-domain.ts  # ⚠️ Requiere output: 'hybrid'
│   ├── utils/          # Utilidades
│   │   └── domain.ts
│   └── env.d.ts
├── astro.config.mjs    # ⚠️ output: 'hybrid' (no 'static')
├── tailwind.config.mjs # Configuración de Tailwind
├── tsconfig.json       # Configuración de TypeScript
└── package.json
```

**Nota Importante**: El proyecto usa `output: 'hybrid'` en Astro para soportar endpoints API mientras mantiene las páginas estáticas.

## 🎯 Cómo Usar

1. **Agregar palabras clave**: Escribe palabras que representen tu proyecto
2. **Configurar búsqueda**: Selecciona el idioma y las extensiones de dominio
3. **Buscar**: Haz clic en "Buscar dominios disponibles"
4. **Comprar**: Cuando encuentres uno disponible, cómpralo directamente

## 🔧 Tecnologías Utilizadas

- **[Astro](https://astro.build)** - Framework web moderno
- **[React](https://react.dev)** - Para componentes interactivos (Islands)
- **[Tailwind CSS](https://tailwindcss.com)** - Framework CSS utility-first
- **[TypeScript](https://www.typescriptlang.org)** - Tipado estático
- **[Google DNS API](https://developers.google.com/speed/public-dns)** - Para verificar disponibilidad

## 🌟 Características Técnicas

### Optimizaciones de Rendimiento

- **Static Site Generation (SSG)** - Páginas pre-renderizadas
- **React Islands** - JavaScript cargado solo cuando es necesario
- **Image Optimization** - Imágenes optimizadas automáticamente
- **CSS Minification** - Estilos optimizados y comprimidos
- **Code Splitting** - Carga de código por demanda

### SEO

- Meta tags completos (Open Graph, Twitter Cards)
- Sitemap automático
- URLs canónicas
- Robots.txt optimizado
- Structured data ready

### Accesibilidad

- Semantic HTML
- ARIA labels donde es necesario
- Navegación por teclado
- Contraste de colores accesible

## 🔄 API

La aplicación incluye un endpoint API para verificar disponibilidad de dominios:

```
GET /api/check-domain?domain=example.com
```

Respuesta:
```json
{
  "domain": "example.com",
  "available": false
}
```

## 🚀 Despliegue

### Vercel

```bash
npm run build
# Sube la carpeta dist/ a Vercel
```

### Netlify

```bash
npm run build
# Sube la carpeta dist/ a Netlify
```

### Cloudflare Pages

```bash
npm run build
# Sube la carpeta dist/ a Cloudflare Pages
```

## 📝 Notas Importantes

### Verificación de Dominios

La aplicación utiliza la API de Google DNS para verificar la disponibilidad de dominios:

- **Status 3 (NXDOMAIN)**: Dominio no existe → **DISPONIBLE** ✓
- **Status 0 + Registros DNS**: Dominio tiene DNS activo → **NO DISPONIBLE** ✗
- **Status 0 sin registros**: Dominio probablemente registrado pero sin configurar → **NO DISPONIBLE** ✗

**Importante**: 
- Los resultados son **aproximados** y deben verificarse en el registrador antes de comprar
- En producción, se recomienda usar APIs oficiales de registradores (Namecheap API, GoDaddy API, etc.)
- Algunos dominios parqueados pueden no detectarse correctamente
- La verificación DNS puede tener latencia de hasta 24-48 horas para dominios recién registrados

### Diccionarios

- Los diccionarios contienen más de 1300 palabras organizadas en categorías
- Español: ~600 palabras en 6 categorías (General, Web/Tech, Negocios, Calidad, Acción, Descriptivos)
- Inglés: ~700 palabras en 7 categorías (General, Tech, Business, Quality, Action, Modifiers, Creative)
- Puedes agregar tus propias palabras editando los archivos en `src/data/`

### Internacionalización (i18n)

- Soporte completo para español e inglés
- Selector de idioma en el navbar
- Traducciones automáticas en toda la UI
- Persistencia de preferencia en localStorage

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la **Licencia GPL v3** - ver el archivo [LICENSE](LICENSE) para más detalles.

La Licencia GPL v3 permite:
- ✅ Uso comercial
- ✅ Modificación
- ✅ Distribución
- ✅ Uso privado
- ✅ Derivados deben mantenerse bajo GPL

**Condición**: Debes mantener el aviso de copyright y la licencia en todas las copias o partes sustanciales del software. Si modificas y distribuyes, el software derivado debe ser también GPL.

## 🙏 Agradecimientos

- Astro team por el increíble framework
- React team por la biblioteca de componentes
- Tailwind CSS por el sistema de diseño
- Google DNS API por la verificación de dominios
- La comunidad open source

---

Hecho con ❤️ usando Astro y React
