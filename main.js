const aj = this;
const server = '69.192.113.109:9000';
aj.auto.waitFor();
aj.requestScreenCapture();
aj.launchApp('Dragalia');
// let img = aj.captureScreen();
aj.http.get(server + '/test/abc', response => {
    aj.toast(response);
});