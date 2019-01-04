((root, name, deps, factory, impl) => {
    // root = this
    // module name for browser
    // dependences{name:path} for node
    impl(root, name, deps, factory);
})(this, 'server', {
    fastify: 'fastify',
    multipart: 'fastify-multipart',
    static: 'fastify-static',
    fs: 'fs',
}, (exports, libs, env) => {
    // factory
    const fastify = libs.fastify({
        logger: true,
    });
    fastify.register(libs.multipart);
    fastify.register(libs.static, {
        root: __dirname,
        prefix: '/static',
    });
    const fs = libs.fs;
    fastify.get('/', async (request, reply) => {
        return {
            hello: 'world!',
        };
    });
    fastify.get('/test/:message', async (request, reply) => {
        console.log('test.message = ' + request.params.message);
        return {
            message: request.params.message,
        };
    });
    fastify.get('/img', async (request, reply) => {
        return fs.readdirSync('images');
    });
    fastify.post('/', async (request, reply) => {
        request.multipart((field, file, filename, encoding, mimetype) => {
            console.log('part', field, file, filename, encoding, mimetype);
            file.pipe(fs.createWriteStream(Date.now() + '.png'));
        }, error => {
            reply.code(200).send({
                message: 'got it',
            });
        }).on('field', (key, value) => {
            console.log('form-data', key, value);
        });
    });
    (async _ => {
        try {
            await fastify.listen(1208, '0.0.0.0');
            console.log('running');
        } catch (error) {
            fastify.log.error(error);
            fastify.close();
        }
    })();
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