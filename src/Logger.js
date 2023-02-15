export const log = (...args) =>
    console.log('\r\x1b[1;34m| ℹ️\x1b[0m', ...args)

export const error = (...args) =>
    console.log('\r\x1b[1;31m| ❌\x1b[0m', ...args)

export const warn = (...args) =>
    console.log('\r\x1b[1;33m| ⚠️\x1b[0m', ...args)

export const pass = (...args) =>
    console.log('\r\x1b[1;32m| ✔\x1b[0m', ...args)
