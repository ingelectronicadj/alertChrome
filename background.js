// Crear alarma para revisar cursos cada minuto
chrome.alarms.create('checkLinksAlarm', { periodInMinutes: 1 }); // Revisar cada minuto

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name); // Mensaje para verificar el activador de la alarma
  
  if (alarm.name === 'checkLinksAlarm') {
    chrome.tabs.query({ url: "https://aurea2.unad.edu.co/oai/*" }, (tabs) => {
      tabs.forEach(tab => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      });
    });
  }
});
