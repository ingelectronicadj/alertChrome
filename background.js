// background.js

// Revisión periódica de pestañas activas
chrome.alarms.create('checkLinksAlarm', { periodInMinutes: 1 }); // Revisar cada minuto

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkLinksAlarm') {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }, () => {
          // No necesitamos resultados aquí ya que 'content.js' se encarga de almacenar en storage
        });
      });
    });
  }
});
