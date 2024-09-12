const courses = [];
const rows = document.querySelectorAll('tr');

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
        sendDate
      });
    }
  }
});

// Almacenar en chrome.storage.local
chrome.storage.local.set({ 'accreditationCourses': courses }, () => {
  console.log('Courses stored:', courses);
});
