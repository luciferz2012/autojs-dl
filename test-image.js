((root, name, deps, factory, impl) => {
    // root = this
    // module name for browser
    // dependences{name:path} for node
    impl(root, name, deps, factory);
})(this, 'test', {
    request: 'request',
    fs: 'fs',
}, (exports, libs, env) => {
    // factory
    const request = libs.request;
    const fs = libs.fs;
    request.post({
        url: 'http://localhost:1208',
        formData: {
            file: fs.createReadStream('img.png'),
        },
    }, (error, response, body) => {
        console.log(error, response, body);
    });
    // exports.something = anything;


}, (root, name, deps, factory) => {
    // impl
    function parse(deps, loader) {
        let libs = {};
        for (let [name, path] of Object.entries(deps)) {
            libs[name] = loader(name, path);
        }
        return libs;
    }
    if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        factory(exports, parse(deps, (name, path) => require(path || name)), 'node');
    } else {
        factory((root[name] = {}), parse(deps, (name, path) => root[name]), 'browser');
    }
});