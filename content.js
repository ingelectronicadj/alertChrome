// content.js

const courses = [];
const rows = document.querySelectorAll('tr');

rows.forEach(row => {
  const cells = row.querySelectorAll('td');
  if (cells.length > 8) {
    const courseId = cells[0].textContent.trim();
    const courseName = cells[1].textContent.trim();
    const reviewDate = cells[4].textContent.trim(); // No se usa actualmente
    const sendDate = cells[5].textContent.trim(); // Fecha de envío está en la columna 6

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
