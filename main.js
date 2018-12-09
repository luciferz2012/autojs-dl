const aj = this;
const server = '60.190.113.109:1208';
aj.auto.waitFor();
aj.requestScreenCapture();
aj.launchApp('Dragalia');
// let img = aj.captureScreen();
for(let i =0;i<100000;i++){
    aj.http.get(server + '/test/' + new Date(), response => {
        aj.toast(response);
    });
    aj.sleep(1000);
}