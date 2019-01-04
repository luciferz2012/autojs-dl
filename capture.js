const aj = this;
const server = 'http://192.168.1.29:1208/';

function capture(server, path) {
    aj.captureScreen(path);
    let response = aj.http.postMultipart(server, {
        file: open(path),
    });
    aj.log(response.body.string());
    return response;
}

if (aj.requestScreenCapture()) {
    aj.sleep(500);
    capture(server, '/sdcard/scripts/temp.png');
}