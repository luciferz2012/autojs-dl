const aj = this;
const server = '60.190.113.109:1208';
aj.device.wakeUp();
aj.http.get(server + '/test/connected', response => {
    aj.toast(response);
});
aj.launchApp('Dragalia');