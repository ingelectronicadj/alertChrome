document.addEventListener('DOMContentLoaded', () => {
    // Obtener los cursos almacenados en chrome.storage.local
    chrome.storage.local.get('accreditationCourses', (result) => {
        console.log('Datos recuperados de chrome.storage.local:', result.accreditationCourses);

        const courses = result.accreditationCourses || {};

        // Asegurarse de que 'courses' sea un objeto donde cada valor sea un array
        if (typeof courses !== 'object' || Array.isArray(courses)) {
            console.error('El formato de los cursos no es un objeto esperado:', courses);
            displayErrorMessage(); // Mostrar un mensaje de error si los datos no son válidos
            return;
        }

        // Convertir el objeto a un array de cursos para procesar
        const coursesArray = [];
        Object.values(courses).forEach(periodCourses => {
            if (Array.isArray(periodCourses)) {
                coursesArray.push(...periodCourses);
            }
        });

        // Agrupar los cursos por periodo académico
        const groupedCourses = groupCoursesByPeriod(coursesArray);
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

// Función para calcular los días restantes o de retraso para revisar un curso
function calculateDaysRemaining(sendDate) {
    const reviewDeadlineDays = 7; // Días de plazo para la revisión
    const today = new Date(); // Fecha actual
    const sendDateParts = sendDate.split('/'); // Asumimos formato DD/MM/YYYY
    const sendDateObj = new Date(`${sendDateParts[2]}-${sendDateParts[1]}-${sendDateParts[0]}`);

    // Calcular la fecha límite sumando los días de plazo
    const deadlineDate = new Date(sendDateObj);
    deadlineDate.setDate(sendDateObj.getDate() + reviewDeadlineDays);

    // Calcular la diferencia en días entre hoy y la fecha límite
    const timeDiff = deadlineDate - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Si los días restantes son negativos, significa que el plazo ya venció
    if (daysRemaining < 0) {
        return { isOverdue: true, daysOverdue: Math.abs(daysRemaining) }; // Días de retraso
    }

    return { isOverdue: false, daysRemaining: daysRemaining }; // Días restantes
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
            const daysInfo = calculateDaysRemaining(course.sendDate); // Calcular días restantes o retraso

            // Asignar una clase según el estado del curso (dentro de plazo o retrasado)
            let countdownClass = '';
            let daysText = '';

            if (daysInfo.isOverdue) {
                countdownClass = 'countdown-overdue'; // Clase CSS para cursos retrasados
                daysText = `<i class="fa-solid fa-circle-exclamation"></i> Retrasado por <b>${daysInfo.daysOverdue} días</b>`;
            } else {
                countdownClass = daysInfo.daysRemaining >= 3 ? 'countdown-green' : 'countdown-red'; // Clase según el tiempo restante
                daysText = `<i class="fa-solid fa-circle-exclamation"></i> Quedan <b>${daysInfo.daysRemaining} días</b> para la revisión`;
            }

            // Mostrar el número de revisiones junto con la fecha de envío y días restantes
            listItem.innerHTML = `
                <strong>${course.courseId} - ${course.courseName}</strong><br>
                Fecha de envío: ${course.sendDate} <br>
                Número de revisiones: ${course.revisionCount} <br>
                <span class="countdown ${countdownClass}">${daysText}</span>
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
