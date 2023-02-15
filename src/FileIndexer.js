import Fs		from 'fs/promises'
import Path		from 'path'
import cbor 	from 'cbor'
import { URL }  from 'url'

const basePath = Path.join(new URL('.', import.meta.url).pathname, '../')

const buildDir = async path => {
	let dir = {}

	for(let dirent of await Fs.readdir(path, { withFileTypes: true }) ) {
		dir[dirent.name] = dirent.isDirectory() ? await buildDir(Path.join(path, dirent.name) ) : 0
	}

	return dir
}

export const indexFiles = async subDir => {
  let viewPath = Path.join(basePath, subDir)
  let buf = await cbor.encodeAsync(await buildDir(viewPath ) )

  await Fs.writeFile(Path.join(viewPath, 'files.cbor'), buf)
}
