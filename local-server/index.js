'use strict'

const Fastify = require('fastify')()
const FastifyStatic = require('fastify-static')

Fastify.register(FastifyStatic, { root: process.cwd() })
Fastify.listen(3000, () => console.log('Snake Game online on port: 3000'))
