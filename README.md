# dev-server

This is the development server for Windows93 v3. Its purpose is to notify Windows93 of file changes automatically for it to decide what to hot-reload.

Files in `public/` are watched and sent via SSE at `/42-dev`.

## Installation
Node v16+ is required, and can be installed with [NVM](https://github.com/nvm-sh/nvm).

```bash
# Clone the repository
$ git clone git@github.com:v3-community/dev-server.git
# Sync submodule
$ git submodule init && git submodule update
# Install node dependencies
$ npm i
# Run on port 8080
$ npm start
# Or, specify a custom port
$ PORT=1234 npm start
```