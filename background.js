// Crear alarma para revisar y actualizar los cursos cada minuto
chrome.alarms.create('checkCoursesAlarm', { periodInMinutes: 1 }); // Revisar cada minuto

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkCoursesAlarm') {
    console.log('Revisando y actualizando la lista de cursos...');
    updateStoredCourses(); // Llamar a la función para actualizar la lista de cursos
  }
});

// Función para actualizar los cursos almacenados, eliminando los que ya fueron acreditados
function updateStoredCourses() {
  chrome.storage.local.get('accreditationCourses', (data) => {
    let existingCourses = data.accreditationCourses || {};

    Object.keys(existingCourses).forEach(period => {
      // Filtrar los cursos para mantener solo aquellos que siguen pendientes de acreditación
      const updatedCourses = existingCourses[period].filter(course => {
        // Si el curso aún tiene el botón "Acreditar", lo mantenemos
        return !course.accredited; // Verificamos si el curso ya fue acreditado
      });

      // Actualizar los cursos del periodo con los que no están acreditados
      existingCourses[period] = updatedCourses;
    });

    // Guardar los cursos actualizados en el almacenamiento local
    chrome.storage.local.set({ 'accreditationCourses': existingCourses }, () => {
      console.log('Lista de cursos actualizada:', existingCourses);
    });
  });
}
