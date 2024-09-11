document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['acreditarLinksCount'], (result) => {
      const alertElem = document.getElementById('alert');
      const notificationElem = document.getElementById('notification');
      
      const count = result['acreditarLinksCount'] || 0;
      
      if (count > 0) {
        alertElem.textContent = `¡Atención! Se encontraron ${count} enlaces de acreditación.`;
        alertElem.style.display = 'block'; // Mostrar la alerta
        notificationElem.style.display = 'none'; // Ocultar la notificación
      } else {
        notificationElem.textContent = 'No se encontraron enlaces de acreditación.';
        notificationElem.style.display = 'block'; // Mostrar la notificación
        alertElem.style.display = 'none'; // Ocultar la alerta
      }
    });
  });
  