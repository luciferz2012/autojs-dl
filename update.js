const aj = this;
const server = 'http://192.168.1.29:1208/';

function update(server) {
    aj.http.get(server + 'img').body.json().forEach(name => {
        aj.files.writeBytes('/sdcard/scripts/images/' + name, aj.http.get(server + 'static/images/' + name).body.bytes());
        aj.toast(name);
    });
}

update(server);