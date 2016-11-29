'use strict'

const http = require('http')
const request = require('request')

module.exports = app => {
  const server = http.createServer(app)
  let isListening = false
  let socketPath

  server.on('listening', () => (isListening = true))
  server.on('close', () => (isListening = false))
  server.on('error', console.error)

  function onRequest (event, context) {
    if (isListening) {
      requestToServer(event, context)
    } else {
      socketPath = `/tmp/express-${new Date().getTime()}.sock`
      server.listen(socketPath).on('listening', () => {
        requestToServer(event, context)
      })
    }
  }

  function requestToServer (event, context) {
    if (event.isBase64Encoded) event.body = new Buffer(event.body, 'base64')
    try {
      const options = {
        method: event.httpMethod,
        baseUrl: `http://unix:${socketPath}:/`,
        url: event.path,
        qs: event.queryStringParameters,
        headers: event.headers,
        body: event.body
      }
      request(options, (error, response, body) => {
        if (error) failureResponse(error, context)
        successResponse(response, body, context)
      })
    } catch (error) {
      failureResponse(error, context)
    }
  }

  function successResponse (response, body, context) {
    const headers = response.headers
    Object.keys(headers).forEach(key => {
      if (Array.isArray(headers[key])) headers[key] = headers[key].join(',')
    })
    context.succeed({
      statusCode: response.statusCode,
      body: body,
      headers: headers
    })
  }

  function failureResponse (error, context) {
    console.error(error)
    context.succeed({
      statusCode: 500,
      body: '',
      headers: {}
    })
  }

  return onRequest
}
