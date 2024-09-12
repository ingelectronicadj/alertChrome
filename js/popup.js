document.addEventListener('DOMContentLoaded', () => {
    // Obtener los cursos almacenados en chrome.storage.local
    chrome.storage.local.get('accreditationCourses', (result) => {
        const courses = result.accreditationCourses;

        // Asegurarse de que 'courses' es un array antes de continuar
        if (!Array.isArray(courses)) {
            console.error('Los cursos no están en el formato esperado:', courses);
            displayErrorMessage(); // Mostrar un mensaje de error si los datos no son válidos
            return;
        }

        // Agrupar los cursos por periodo académico
        const groupedCourses = groupCoursesByPeriod(courses);
        // Mostrar los cursos en el popup
        displayCourses(groupedCourses);
    });
});

// Función para agrupar los cursos por periodo académico
function groupCoursesByPeriod(courses) {
    const grouped = {};

    courses.forEach(course => {
        const period = course.academicPeriod; // Obtener el periodo académico del curso

        // Si no existe un grupo para este periodo, lo inicializamos
        if (!grouped[period]) {
            grouped[period] = [];
        }

        // Añadir el curso al grupo correspondiente
        grouped[period].push(course);
    });

    return grouped; // Devolver los cursos agrupados por periodo
}

// Función para calcular los días restantes para revisar un curso
function calculateDaysRemaining(sendDate) {
    const reviewDeadlineDays = 7; // Días de plazo para la revisión
    const today = new Date(); // Fecha actual
    const sendDateParts = sendDate.split('/'); // Asumimos formato DD/MM/YYYY
    const sendDateObj = new Date(`${sendDateParts[2]}-${sendDateParts[1]}-${sendDateParts[0]}`);

    // Calcular la fecha límite sumando los días de plazo
    const deadlineDate = new Date(sendDateObj);
    deadlineDate.setDate(sendDateObj.getDate() + reviewDeadlineDays);

    // Calcular la diferencia en días entre hoy y la fecha límite
    const daysRemaining = Math.max(Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)), 0);

    return daysRemaining; // Retornar los días restantes, mínimo 0
}

// Función para mostrar los cursos en el popup
function displayCourses(groupedCourses) {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = ''; // Limpiar cualquier contenido previo

    // Verificar si hay cursos para mostrar
    if (Object.keys(groupedCourses).length === 0) {
        container.innerHTML = '<p>No hay cursos pendientes de acreditación.</p>';
        return;
    }

    // Recorrer los grupos de periodos académicos y crear el HTML para mostrarlos
    Object.keys(groupedCourses).forEach(period => {
        const periodSection = document.createElement('div');
        periodSection.classList.add('period-section'); // Añadir clase para estilo

        // Añadir el título del periodo
        const periodTitle = document.createElement('h3');
        periodTitle.textContent = `Periodo Académico: ${period}`;
        periodSection.appendChild(periodTitle);

        // Crear una lista para los cursos de este periodo
        const courseList = document.createElement('ul');

        groupedCourses[period].forEach(course => {
            const listItem = document.createElement('li');
            const daysRemaining = calculateDaysRemaining(course.sendDate); // Calcular días restantes

            // Asignar una clase según el rango de días restantes
            let countdownClass = '';
            if (daysRemaining >= 5 && daysRemaining <= 7) {
                countdownClass = 'countdown-green';
            } else if (daysRemaining >= 3 && daysRemaining <= 4) {
                countdownClass = 'countdown-orange';
            } else {
                countdownClass = 'countdown-red';
            }

            listItem.innerHTML = `
                <strong>${course.courseId} - ${course.courseName}</strong><br>
                Fecha de envío: ${course.sendDate} <br>
                <span class="countdown ${countdownClass}"><i class="fa-solid fa-circle-exclamation"></i> Quedan <b>${daysRemaining} días</b> para la revisión</span>
            `;
            courseList.appendChild(listItem);
        });

        // Añadir la lista de cursos al contenedor del periodo
        periodSection.appendChild(courseList);

        // Añadir esta sección al contenedor principal
        container.appendChild(periodSection);
    });
}

// Función para mostrar un mensaje de error si los datos no son válidos
function displayErrorMessage() {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = '<p>Ocurrió un error al cargar los cursos. Inténtalo de nuevo más tarde.</p>';
}
