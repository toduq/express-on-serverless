# Express on Serverless

Now you can run Node.js express on AWS Lambda, using Serverless framework!

## What's this?

I want to run express on AWS Lambda and deploy it using Serverless.  
This can be run with express, koa or other Node.js servers as far as it is [requestListener](https://nodejs.org/api/http.html#http_http_createserver_requestlistener)

## Features

- [x] express
- [x] GET/POST request
- [x] POST json with body-parser
- [x] POST urlencoded with body-parser
- [x] POST binary file with multer  
(need to enable API Gateway [binary support](https://aws.amazon.com/jp/blogs/compute/binary-support-for-api-integrations-with-amazon-api-gateway/))

## How to use

Install npm modules and generate template.

```
npm install -g serverless
npm install -S express express-on-serverless
serverless create --template aws-nodejs
```

Modify handler.js and serverless.yml

```
// handler.js
const express = require('express')
const app = express()

app.get('/test', (req, res) => {
  res.send("I'm fine!")
})

exports.index = require('express-on-serverless')(app)
```

```
// serverless.yml
service: aws-nodejs

provider:
  name: aws
  runtime: nodejs4.3

functions:
  index:
    handler: handler.index
    events:
      http: any {proxy+}
```

Deploy to AWS!

```
serverless deploy
```

Now you can access `https://API_GATEWAY_HOST/dev/test` !
It's too easy!!
