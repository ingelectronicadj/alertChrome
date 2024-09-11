// background.js

chrome.alarms.create('checkLinksAlarm', { periodInMinutes: 1 }); // Revisar cada minuto

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkLinksAlarm') {
    chrome.tabs.query({ url: "https://aurea2.unad.edu.co/oai/*" }, (tabs) => {
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
