const courses = [];
const rows = document.querySelectorAll('tr');

// Obtener el nombre del periodo académico
const academicPeriod = document.querySelector('#bper_aca_chosen > a span').textContent.trim();

rows.forEach(row => {
  const cells = row.querySelectorAll('td');
  if (cells.length > 8) {
    const courseId = cells[0].textContent.trim(); // ID del curso
    const courseName = cells[1].textContent.trim(); // Nombre del curso
    const sendDate = cells[5].textContent.trim(); // Fecha de envío

    // Extraer datos solo si hay enlaces de acreditación
    if (cells[7].textContent.trim() === 'Acreditar') {
      courses.push({
        courseId,
        courseName,
        sendDate,
        academicPeriod
      });
    }
  }
});

// Obtener los cursos previamente almacenados
chrome.storage.local.get('accreditationCourses', (data) => {
  let existingCourses = data.accreditationCourses || {};

  // Si ya hay cursos para este periodo, actualizarlos, de lo contrario, añadirlos
  existingCourses[academicPeriod] = existingCourses[academicPeriod] || [];

  // Combinar los cursos nuevos con los existentes
  const updatedCourses = existingCourses[academicPeriod].concat(courses);

  // Actualizar la lista de cursos en el almacenamiento
  existingCourses[academicPeriod] = updatedCourses;

  chrome.storage.local.set({ 'accreditationCourses': existingCourses }, () => {
    console.log(`Cursos del periodo ${academicPeriod} actualizados:`, updatedCourses);
  });
});
