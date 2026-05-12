# AMELIX Cinema

AMELIX Cinema es una aplicación web moderna diseñada para un cine en San Rafael, Mendoza. Permite a los usuarios consultar la cartelera actual, ver horarios, precios y descubrir los próximos estrenos. Esta plataforma ofrece una experiencia de usuario rápida, fluida y atractiva, gracias a una interfaz construida con las últimas tecnologías del ecosistema React.

## 📃 [Ingreso al informe](https://docs.google.com/document/d/1UQD6ZXsXiKY_qZ_wp-hO_laty9-cwTQr/edit?usp=sharing&ouid=110171474056940226835&rtpof=true&sd=true)
## ✨ Características Principales

- **🎬 Cartelera y Próximos Estrenos**: Consulta las películas actuales y descubre las que llegarán pronto al cine.
- **🍿 Promociones y Candy Bar**: Descubre las últimas ofertas y el menú disponible en el Candy Bar.
- **🎟️ Precios**: Información detallada sobre las tarifas de entradas.
- **📍 Ubicación y Contacto / FAQ**: Encuentra el cine fácilmente mediante un mapa y resuelve tus dudas.
- **🔐 Panel de Administración**: Interfaz protegida para la gestión completa (CRUD) de películas, promociones y ajustes operativos del cine.
- **⚡ Integración con TMDB API**: Carga automática de pósters, fondos de pantalla y detalles de películas directamente desde The Movie Database.
- **🗄️ Base de Datos en la Nube (Supabase)**: Almacenamiento y persistencia en tiempo real para reflejar los cambios instantáneamente y gestionar reglas de negocio (ej. horarios automatizados).
- **🎨 Tema Personalizable**: Interfaz moderna con soporte para alternar temas (Claro / Oscuro) según la preferencia del usuario.
- **📱 Totalmente Responsivo**: Diseño adaptable para ofrecer una experiencia visual ideal desde dispositivos móviles, tablets y ordenadores de escritorio.

## 🚀 Tecnologías y Herramientas

Este proyecto está construido con un stack tecnológico moderno, asegurando alto rendimiento, mantenibilidad y una experiencia de desarrollo óptima:

- **React 18 & TypeScript**: Biblioteca principal para la construcción de la interfaz de usuario con tipado estricto y seguro.
- **Vite**: Entorno de desarrollo ultrarrápido y empaquetador de última generación.
- **Supabase**: Backend como servicio (BaaS) para la gestión de base de datos y autenticación/seguridad.
- **TanStack React Query**: Herramienta potente para la obtención, almacenamiento en caché y sincronización del estado del servidor.
- **Tailwind CSS & Shadcn UI**: Framework de utilidades e interfaces accesibles (basadas en Radix UI) para un diseño elegante y responsivo.
- **Framer Motion**: Biblioteca para animaciones y transiciones fluidas.
- **Lucide React**: Conjunto de iconos modernos y de alta calidad.
- **React Router DOM**: Enrutador para la navegación entre las diferentes secciones de la aplicación.

## 🛠️ Instalación y Ejecución

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

1. **Prerrequisito - Instalar Node.js**:
   Para la ejecución local del proyecto, es indispensable tener instalado **Node.js** en tu sistema. Puedes obtener la versión recomendada desde su sitio web oficial:
   👉 **[Descargar Node.js](https://nodejs.org/)**

2. **Clona el repositorio** (o descarga el código fuente).

3. **Instala las dependencias** del proyecto:
   ```bash
   npm install
   ```

4. **Configura las variables de entorno**:
   Asegúrate de contar con un archivo `.env.local` en la raíz del proyecto con las credenciales correspondientes de Supabase y la clave de la API de TMDB para el correcto funcionamiento de la carga de datos.

5. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

6. **Abre la aplicación** en tu navegador en la dirección indicada por Vite (generalmente `http://localhost:5173`).

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ❤️ para AMELIX Cinema**
