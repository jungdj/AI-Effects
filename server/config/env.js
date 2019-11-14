const NODE_ENV = process.env.NODE_ENV || 'development'
const envExpand = require('dotenv-expand')
const envSafe = require('dotenv-safe')
const fs = require('fs')

if (!NODE_ENV) {
    throw new Error('The NODE_ENV variable is required but was not specified.')
}

const dotenvFiles = [ `config/.env.${NODE_ENV}` ].filter(Boolean)

dotenvFiles.forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
        envExpand(envSafe.config({
            path: dotenvFile,
            example: 'config/.env.example',
            allowEmptyValues: true,
        }))
    }
})
