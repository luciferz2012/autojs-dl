((root, name, deps, factory, impl) => {
    // root = this
    // module name for browser
    // dependences{name:path} for node
    impl(root, name, deps, factory);
})(this, 'server', {
    fastify: 'fastify',
}, (exports, libs, env) => {
    // factory
    const fastify = libs.fastify({
        logger: true,
    });
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
    (async _ => {
        try {
            await fastify.listen(9000, '0.0.0.0');
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