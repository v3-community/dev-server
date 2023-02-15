import Path		        from 'path'
import Fs               from 'fs/promises'
import { encodeAsync } 	from 'cbor'
import { URL }          from 'url'
import { log }          from './Logger.js'

const buildDir = async path => {
	let dir = new Map()

	for(let dirent of await Fs.readdir(path, { withFileTypes: true }) ) {
		dir.set(dirent.name, dirent.isDirectory() ? await buildDir(Path.join(path, dirent.name) ) : 0)
	}

	return dir
}

export const indexFiles = async subDir => {
  log('updating file index')
  let viewPath = Path.join(process.cwd(), subDir)
  let buf = await encodeAsync(await buildDir(viewPath ) )

  await Fs.writeFile(Path.join(viewPath, 'files.cbor'), buf)
}
