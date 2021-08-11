# Introduction to Serverless Function

> _Notes for [Introduction to Next.js](https://frontendmasters.com/courses/serverless-functions/) taught by Jason Lengstorf at FrontendMaster._

- [What does “serverless” mean?](#what-does-serverless-mean)
- [Example using Netlify Serverless API](#example-using-netlify-serverless-api)
  - [How to load data using serverless functions](#how-to-load-data-using-serverless-functions)
  - [How to send/save data to serverless functions](#how-to-sendsave-data-to-serverless-functions)
  - [How to limit access to serverless function](#how-to-limit-access-to-serverless-function)
- [What are people building with serverless functions?](#what-are-people-building-with-serverless-functions)
- [Good resources](#good-resources)

## What does “serverless” mean?

> A serverless function is a programmatic function written by a software developer for a single purpose. It's then hosted and maintained on infrastructure by cloud computing companies. These companies take care of code maintenance and execution so that developers can deploy new code faster and easier.

❌ There are no servers
✅ We don’t have to manage any servers

## Example using Netlify Serverless API

### How to load data using serverless functions

[_source_](./frontendmaster-serverless/functions/movies.js)

```=js
const { URL } = require("url");
const fetch = require("node-fetch");
const { query } = require("./utils/hasura");

exports.handler = async () => {
  const { movies } = await query({
    query: `query  {
        movies {
          id
          poster
          tagline
          title
        }
      }
      `,
  });
  const api = new URL("https://www.omdbapi.com/");

  api.searchParams.set("apiKey", process.env.OMDB_API_KEY);

  const promises = movies.map((movie) => {
    api.searchParams.set("i", movie.id);
    return fetch(api)
      .then((response) => response.json())
      .then((data) => {
        const scores = data.Ratings;
        return { ...movie, scores };
      });
  });

  // execute in parallel
  // 👀 check out -> https://www.learnwithjason.dev/blog/keep-async-await-from-blocking-execution/
  const moviesWithRatings = await Promise.all(promises);

  return {
    statusCode: 200,
    body: JSON.stringify(moviesWithRatings),
  };
};
```

### How to send/save data to serverless functions

[_source_](./frontendmaster-serverless/functions/add-movie.js)

```=js
const { query } = require("./utils/hasura");

exports.handler = async (event) => {
  const { id, poster, tagline, title } = JSON.parse(event.body);
  const result = await query({
    query: `
        mutation MyMutation($id: String!, $poster: String!, $title: String!, $tagline: String!) {
            insert_movies_one(object: {id: $id, poster: $poster, title: $title, tagline: $tagline}){
                id
                poster
                tagline
                title
            }
        }
    `,
    variables: { id, poster, tagline, title },
  });

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
```

### How to limit access to serverless function

- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) / [Netlify Identity Widget](https://github.com/netlify/netlify-identity-widget)
- 🛠 Tool to gain the insights of token: [jwt](https://jwt.io/)

## What are people building with serverless functions?

- **Form handling:** contact forms, newsletter opt-ins
  - e.g., [Jason's web 👀](https://www.jason.af/)
  - for [ConvertKit](https://convertkit.com/) API usage
- **Reactions and interactions**
  - e.g., like button in [Josh's web 👀](https://www.joshwcomeau.com/)
  - press button to increase the number by sending API to the endpoint (serverless func)
- **Parallel processing**
  - _performance_: do the work across multiple machine⚡️
  - e.g., [gatsby-parallel-runner 👀](https://github.com/netlify/gatsby-parallel-runner)
- **Live interactions**
  - e.g., [Jason's web 👀](https://github.com/jlengstorf/learnwithjason.dev/tree/main/site/functions) trigger sound effect when streaming
- **Entire ordering systems**
  - e.g., starbucks, subway
- **Subscription management**
  - [example 👀](https://stripe-subscriptions.netlify.app/) / [source code](https://github.com/stripe-samples/netlify-stripe-subscriptions/) / [tutorial](https://www.netlify.com/blog/2020/07/13/manage-subscriptions-and-protect-content-with-stripe/)
- `grep` for the whole internet
  - [common crawl 👀](https://github.com/andresriancho/cc-lambda)

## Good resources

- [Netlify Functions](https://www.netlify.com/products/functions/)
- [Hasura](https://hasura.io/)
- [Stripe](https://stripe.com/): for manage billing...
- [Fauna](https://fauna.com/): GraphQL data API
- [Strapi](https://strapi.io/): headless CMS.
- [Sanity](https://www.sanity.io/): headless CMS.<br/><br/>
- [Tutorial Example](https://strapi.io/blog/strapi-next-deploy)

---

- [Express as serverless func](https://github.com/vendia/serverless-express)
- [GraphQL serverless + AWS lambda](https://www.apollographql.com/docs/apollo-server/deployment/lambda/)

> **💡 TAKEAWAYS**
>
> - trusting a huge cloud provider to manage all of the backend scaling, devOps stuff and focus on the business function and fun part!
> - also save money (depends on your API usage)
