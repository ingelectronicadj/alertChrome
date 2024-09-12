// Crear alarmas para revisar cursos cada minuto y notificaciones diarias
chrome.alarms.create('checkLinksAlarm', { periodInMinutes: 1 }); // Revisar cada minuto

chrome.alarms.create('dailyCheckAlarm', {
  when: getNextAlarmTime(9, 0), // Primer notificación a las 9:00 a.m.
  periodInMinutes: 24 * 60 // Cada 24 horas
});

chrome.alarms.create('reminderAlarm', {
  when: getNextAlarmTime(11, 50), // Recordatorio a las 11:50 a.m.
  periodInMinutes: 24 * 60 // Cada 24 horas
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkLinksAlarm') {
    chrome.tabs.query({ url: "https://aurea2.unad.edu.co/oai/*" }, (tabs) => {
      tabs.forEach(tab => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      });
    });
  } else if (alarm.name === 'dailyCheckAlarm' || alarm.name === 'reminderAlarm') {
    // Enviar un mensaje al popup para mostrar cursos pendientes
    chrome.runtime.sendMessage({ action: "checkCourses" });
  }
});

// Función para calcular el tiempo hasta la próxima alarma a una hora específica
function getNextAlarmTime(hour, minute) {
  const now = new Date();
  const alarmTime = new Date(now);
  alarmTime.setHours(hour, minute, 0, 0);

  // Si el tiempo ya pasó hoy, calcular para el siguiente día
  if (alarmTime <= now) {
    alarmTime.setDate(alarmTime.getDate() + 1);
  }

  return alarmTime.getTime();
}
