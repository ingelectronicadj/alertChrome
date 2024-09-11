// content.js

// Función para contar los enlaces de acreditación en la página
function countAcreditarLinks() {
  const links = document.querySelectorAll('a');
  let count = 0;
  links.forEach(link => {
    if (link.textContent.includes('Acreditar')) {
      count++;
    }
  });
  // Enviar el conteo al background script
  chrome.storage.local.set({ 'acreditarLinksCount': count });
}

// Ejecutar la función al cargar el contenido de la página
countAcreditarLinks();
