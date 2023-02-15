import { watch } from 'chokidar'
import { on }    from 'events'
import { log }   from './Logger.js';

export default async function(app, { emitter }) {
	app.get('/42-dev', (req, res) => {
	    log('new client connection')

	    res.sse((async function* () {
	        for await(const [event] of on(emitter, 'event')) {
	            yield {
	                event: event.name,
	                data: event.data ?? ' '
	            }
	        }
	    })())
	})

	const handleChange = path => {
	    log(`notifying change: \x1b[1;30m${path}\x1b[0m`)
	    emitter.emit('event', { name: 'change', data: '/' + path.replace('public/', '') })
	}

	watch('public/', { persistent: true, ignoreInitial: true })
	  .on('add', handleChange)
	  .on('change', handleChange)
	  .on('unlink', handleChange)
	  .on('ready', () => log('waiting for events on \x1b[1;30mpublic/\x1b[0m'))
}