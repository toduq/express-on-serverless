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

## Setup

Install npm modules and generate template.

```bash
npm install -g serverless
npm install -S express express-on-serverless
serverless create --template aws-nodejs
```

Modify handler.js and serverless.yml

```javascript
// handler.js
const express = require('express')
const app = express()

app.get('/test', (req, res) => {
  res.send("I'm fine!")
})

exports.index = require('express-on-serverless')(app)

// Used when run locally
if(!module.parent){
    let port = process.env.PORT || 3000;
    app.listen(port)
    console.log("Listening on port %s",port);
}
```

```yaml
# serverless.yml
service: aws-nodejs

provider:
  name: aws
  runtime: nodejs4.3

functions:
  index:
    handler: handler.index
    events:
      - http:
          path: /
          method: any
      - http: any {proxy+}
```

## Local Testing

Assuming you used the example above, the Express app will start and listen on port 3000 (`process.env.PORT`) if the server is started directly instead of loaded as a module by Lambda. To start the server locally, you can use the default `start` command built in to either `npm` or `yarn`:

    npm start

    # Same behavior, if you prefer yarn
    yarn start

## Deploying to Amazon Web Service

First, [configure your AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/#using-aws-access-keys) if you haven't already.

The same command is used for both the initial deploy as well as updates.

```
serverless deploy
```

Now you can access `https://API_GATEWAY_HOST/dev/test` !

See `serverless deploy --help` for a summary of available options and the [official serverless docs for deploy](https://serverless.com/framework/docs/providers/aws/guide/deploying/ for the full docs on serverless deployment).

## Checking on what happened in AWS

`serverless` creates new changes in CloudFormation, API Gateway, and Lambda. Check out the AWS Console for each service to review the impact of your changes.

 * [CloudFormation](https://console.aws.amazon.com/cloudformation/home#/stacks?filter=active)
 * [API Gateway](http://console.aws.amazon.com/apigateway/home)
 * [Lambda](https://console.aws.amazon.com/lambda/home?#/functions?display=list)

## Conclusion

It's too easy!!
