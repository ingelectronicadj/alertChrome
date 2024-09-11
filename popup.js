// popup.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup loaded'); // Mensaje para verificar que el popup se ha cargado
  
    chrome.storage.local.get(['accreditationCourses'], (result) => {
      console.log('Data retrieved from storage:', result); // Mensaje para verificar los datos recuperados
  
      const alertElem = document.getElementById('alert');
      const notificationElem = document.getElementById('notification');
      const courses = result['accreditationCourses'] || [];
      const today = new Date();
      const reviewDeadlineDays = 7; // Días para revisión
  
      if (courses.length > 0) {
        let message = '¡Atención! Se encontraron cursos en acreditación por revisar:<ul>';
        courses.forEach(course => {
          // Extraer la fecha de envío y convertirla a formato Date
          const sendDateParts = course.sendDate.split('/');
          const sendDate = new Date(`${sendDateParts[2]}-${sendDateParts[1]}-${sendDateParts[0]}`); // Formato: YYYY-MM-DD
          
          // Calcular la fecha límite (7 días después de la fecha de envío)
          const deadlineDate = new Date(sendDate);
          deadlineDate.setDate(sendDate.getDate() + reviewDeadlineDays);
  
          // Calcular días restantes para revisión
          const daysRemaining = Math.max(Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)), 0); // Diferencia en días, mínimo 0
  
          // Mensajes de depuración
          console.log(`Fecha de Envío: ${sendDate.toDateString()}`);
          console.log(`Fecha Límite: ${deadlineDate.toDateString()}`);
          console.log(`Fecha Actual: ${today.toDateString()}`);
          console.log(`Días Restantes: ${daysRemaining}`);
  
          message += `<li><strong>${course.courseName}</strong> (ID: ${course.courseId}) - Fecha de envío: ${course.sendDate} <br> Quedan <span class="countdown">${daysRemaining} días</span> para la revisión</li>`;
        });
        message += '</ul>';
  
        alertElem.innerHTML = message;
        alertElem.style.display = 'block';
        notificationElem.style.display = 'none';
      } else {
        notificationElem.textContent = 'No se encontraron cursos en acreditación.';
        notificationElem.style.display = 'block';
        alertElem.style.display = 'none';
      }
    });
  });
  