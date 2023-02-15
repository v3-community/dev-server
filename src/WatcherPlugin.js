import { watch } from 'chokidar'
import { on }    from 'events'
import { indexFiles } from './FileIndexer.js'
import { log }   from './Logger.js'

let viewDir = 'public/'

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

	const handleIndexChange = path => {
		indexFiles(viewDir)
		handleChange(path)
	}

	watch(viewDir, { persistent: true, ignoreInitial: true })
	  .on('add', handleIndexChange)
	  .on('change', handleChange)
	  .on('unlink', handleIndexChange)
	  .on('ready', () => log('waiting for events on \x1b[1;30mpublic/\x1b[0m'))
}