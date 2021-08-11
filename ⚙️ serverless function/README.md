# Introduction to Serverless Function

> _Notes for [Introduction to Next.js](https://frontendmasters.com/courses/serverless-functions/) taught by Jason Lengstorf at FrontendMaster._

## What does “serverless” mean?

❌ There are no servers
✅ We don’t have to manage any servers

## Example using Netlify Serverless API

### How to load data using serverless functions

(Netlify Syntax)

```=js
exports.handler = async () => {
  return {
    statusCode: 200,
    body: "Boops!",
  };
};
```

### How to protect private credentials in front-end applications

### How to send data to serverless functions

### How to save data sent to serverless functions

### How to limit access to serverless function

## What are people building with serverless functions?

- **Form handling:** contact forms, newsletter opt-ins
  - e.g., [Jason's web 👀](https://www.jason.af/)
  - for [ConvertKit](https://convertkit.com/) API usage
- Reactions and interactions
  - e.g., like button in [Josh's web 👀](https://www.joshwcomeau.com/)
  - press button to increase the number by sending API to the endpoint (serverless func)
- Parallel processing
  - _performance_: do the work across multiple machine⚡️
  - e.g., [gatsby-parallel-runner 👀](https://github.com/netlify/gatsby-parallel-runner)
- Live interactions
  - e.g., [Jason's web 👀](https://github.com/jlengstorf/learnwithjason.dev/tree/main/site/functions) trigger sound effect when streaming
- Entire ordering systems
  - e.g., starbucks, subway
- Subscription management
  - [example 👀](https://stripe-subscriptions.netlify.app/) / [source code](https://github.com/stripe-samples/netlify-stripe-subscriptions/) / [tutorial](https://www.netlify.com/blog/2020/07/13/manage-subscriptions-and-protect-content-with-stripe/)
- `grep` for the whole internet
  - [common crawl 👀](https://github.com/andresriancho/cc-lambda)

## Good resources

- [Netlify Functions](https://www.netlify.com/products/functions/)
- [Neilify Identity](https://docs.netlify.com/visitor-access/identity/)<br/>
- [Hasura](https://hasura.io/)
- [Stripe](https://stripe.com/): for manage billing...
- [Fauna](https://fauna.com/): GraphQL data API
- [Strapi](https://strapi.io/): headless CMS.
- [Sanity](https://www.sanity.io/): headless CMS.<br/>
- [Tutorial Example](https://strapi.io/blog/strapi-next-deploy)

---

- [Express as serverless func](https://github.com/vendia/serverless-express)
- [GraphQL serverless + AWS lambda](https://www.apollographql.com/docs/apollo-server/deployment/lambda/)

> **💡 TAKEAWAYS**
>
> - trusting a huge cloud provider to manage all of the backend scaling, devOps stuff and focus on the business function and fun part!
> - also save money (depends on your API usage)
