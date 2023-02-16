import fastify              from 'fastify'
import serve                from '@fastify/static'
import { FastifySSEPlugin } from 'fastify-sse-v2'
import { resolve }          from 'path'
import { createInterface }  from 'readline'
import _package             from './package.json' assert { type: 'json' }
import { log, error, pass } from './src/Logger.js'
import WatcherPlugin        from './src/WatcherPlugin.js'
import { EventEmitter, on } from 'events'

log(`${_package.name}/${_package.version} starting`)

/* fastify - http sse/static serve */

const app = fastify()
const emitter = new EventEmitter()

app.register(FastifySSEPlugin)
app.register(serve, { root: resolve('public'), prefix: '/' })
app.register(WatcherPlugin, { emitter })

app.listen({ port: process.env.PORT ?? 8080 }, (err, host) => {
    if(err) {
        error('cannot listen()', err)
        process.exit(1)
    }

    pass('listening on', host)
})

/* readline - terminal interface */

const term = createInterface(process.stdin, process.stdout)
term.setPrompt('\x1b[31m> \x1b[0m')

term.on('line', line => {
    const [command, ...args] = line.split(' ')

    switch(command) {
        case 'reload':
            log('sending \x1b[1;30mreload\x1b[0m event to clients')
            emitter.emit('event', { name: 'reload' })
        break;

        case 'stop' && 'exit':
            log('exiting')
            process.exit(0);
        break;

        case 'help':
            log(`help
                - reload: reload all clients connected
                - stop: will stop the dev-server running (exit also does the same)
                - help: you are here right now`)
        break;
    }

    term.prompt()
})

term.prompt()