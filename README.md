# Extensión de Revisión de Alistamiento de Cursos

Esta extensión para Chrome ayuda a gestionar y revisar cursos en la plataforma de la UNAD, notificando al usuario sobre cursos que necesitan revisión y facilitando el acceso a estos.

### Archivos y Carpetas

- **`manifest.json`**: Archivo de configuración de la extensión. Define permisos, scripts, iconos y otros detalles necesarios para el funcionamiento de la extensión en Chrome.

- **`/js`**: Carpeta que contiene el archivo JavaScript del popup.
  - `popup.js`: Maneja la lógica del popup de la extensión, incluyendo la recuperación y visualización de cursos almacenados.

- **`content.js`**: Script que se ejecuta en las páginas del OAI para extraer información sobre los cursos. Realiza la búsqueda y filtrado de los cursos en la plataforma.

- **`background.js`**: Script en segundo plano que gestiona las alarmas y tareas periódicas de la extensión. Configura alarmas para la revisión periódica de cursos y envía mensajes para notificar al usuario.

- **`/css`**: Carpeta que contiene los estilos CSS para la extensión.
  - `style.css`: Define el estilo para el popup y otros componentes de la extensión.
  
- **`/icons`**: Contiene las imágenes utilizadas como íconos para la extensión.

- **`popup.html`**: Archivo HTML que define el contenido y la estructura del popup de la extensión.

## Permisos

La extensión requiere los siguientes permisos:
- `tabs`: Acceso a las pestañas del navegador.
- `storage`: Acceso al almacenamiento local para guardar información sobre los cursos.
- `scripting`: Permite ejecutar scripts en las páginas web.
- `alarms`: Permite crear y gestionar alarmas para tareas periódicas.

## Funcionamiento

1. **Revisión de Cursos**: `content.js` extrae datos sobre cursos desde la plataforma de la UNAD. Esta información se almacena en el almacenamiento local de Chrome.

2. **Alarmas**: `background.js` configura alarmas para realizar revisiones periódicas. Cada minuto, `content.js` se ejecuta para buscar nuevos cursos. 

3. **Popup**: `popup.js` gestiona el contenido del popup que muestra la información sobre los cursos pendientes. 