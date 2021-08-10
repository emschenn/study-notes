# Introduction to Serverless Function

> _Notes for [Introduction to Next.js](https://frontendmasters.com/courses/serverless-functions/) taught by Jason Lengstorf at FrontendMaster._

- [What does “serverless” mean?](#what-does-serverless-mean)
- [How to load data using serverless functions](#how-to-load-data-using-serverless-functions)
- [How to protect private credentials in front-end applications](#how-to-protect-private-credentials-in-front-end-applications)
- [How to send data to serverless functions](#how-to-send-data-to-serverless-functions)
- [How to save data sent to serverless functions](#how-to-save-data-sent-to-serverless-functions)
- [How to limit access to serverless function](#how-to-limit-access-to-serverless-function)

## What does “serverless” mean?

❌ There are no servers
✅ We don’t have to manage any servers

## How to load data using serverless functions

```=js
exports.handler = async () => {
  return {
    statusCode: 200,
    body: "Boops!",
  };
};
```

## How to protect private credentials in front-end applications

## How to send data to serverless functions

## How to save data sent to serverless functions

## How to limit access to serverless function
