# Introduction to Next.js

> _Notes for [Introduction to Next.js](https://frontendmasters.com/courses/next-js/) taught by Scott Moss at FrontendMaster._

- [What is Next.js](#what-is-nextjs)
- [Routing with Pages](#routing-with-pages)
- [Customizing Next.js config](#customizing-nextjs-config)
- [API Routes](#api-routes)
- [Fetching Data ✨](#fetching-data-)
  - [getStaticProps](#getstaticprops)
  - [getStaticPaths](#getstaticpaths)
  - [getServerSideProps](#getserversideprops)
- [Rendering Modes ✨](#rendering-modes-)
- [Working with SSR ✨](#working-with-ssr-)

## What is Next.js

A complete full-stack framework for modern apps with the following highlights✨

- [ ] Dev build system
- [ ] Production build system
- [ ] Prerendering
- [ ] SSR
  - [ ] Build time
  - [ ] Static
- [ ] Routing
- [ ] API routes

### Compare to `create-react-app`

CRA is more of a boilerplate created to help you get started with React faster. Because CRA is just React, you're still on the hook for something. Routing, Server Side Rendering, and an API, along with other things.

### Compare to `Gatsby.js`

Gatsby has conventions built in the will to make anyone looking to make a static app with React happily. Gatsby is **not a full-stack framework and cannot create API routes or server-side rendering.** Gatsby does have features like a **content mesh**, **GraphQL support built-in**, **image optimization**, and others that Next.js does not have.

> 🤔 Do you only need a single page app?
> <br/> → Use Create React App

> 🤔 Do you need a static site, like a blog, that's also a SPA?
> <br/> → Use Next.js or Gatsby.

> 🤔 Need SSR, an API, and all the above?
> <br/> → Use Next.js

## Routing with Pages

```=js
index => /
all notes => /notes
one note => /notes/:id
```

```=js
pages
  notes
    index.jsx
    [id].jsx
```

```=javascript
import React from 'react'
import { useRouter } from 'next/router'

export default () => {
  const router = useRouter()
  const { id }= router.query

  return (
    <h1>Note: {id} </h1>
  )
}
```

### Catch-all routes

```
docs/[...param].jsx
```

```
import React from 'react'
import { useRouter } from 'next/router'

// file => /docs/[...params].jsx
// route => /docs/a/b/c

export default () => {
  const router = useRouter()
  const { params }= router.query

  // params === ['a', 'b', 'c']

  return (
    <h1>hello</h1>
  )
}
```

> **USE CASE** <br/>
> when you have a bunch of pages that have pretty similar if not identical layouts and style but have different content and need their own URL. e.g, docs and wikis are a perfect use case.

### Navigation

#### Link component

```
<Link href="/user/[id].js" as={`/user/${user.id}`}>
  <a>user</a>
</Link>
```

You must have an `a` tag as the child of the `Link` component, but the `href` lives on the `Link`.

#### Programmatic routing

```
import { useRouter } from 'next/router'

const router = useRouter()

onClick={e => router.push('/')}
```

🔍 [all the methods that router can use](https://nextjs.org/docs/routing/introduction)

## Customizing Next.js config

If you want to change the build system's behavior, extend Next.js's features, or add ENV variables, you can do this easily in the `next-config.js` file.

- add ENV variables

```
module.exports = {
  webpack: {
    // webpack config properties
  },
  env: {
    MY_ENV_VAR: process.env.SECRET
  }
}
```

- Adding the bundle analyzer webpack plugin during a prod build of Next.js.

```
const { PHASE_PRODUCTION_SERVER } = require('next/constants')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    return {
      ...defaultConfig,
      webpack: {
        plugins: [new BundleAnalyzerPlugin()]
      }
    }
  }

  return defaultConfig
}
```

## API Routes

Next.js is a **full-stack** framework. Fullstack, as in it, has a **server**, not just for development, for rendering components on your server, but **also for an API!**

All we have to do is create an `api` folder in our `pages` director. The file names and paths work just like pages do. However, instead of building components in those files, we'll create API handlers.

```=js
// pages/api/data.js
// route => /api/data

export default (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ message: 'hello' }))
}
```

🔍 [learn more here](https://hendrixer.github.io/nextjs-course/api-handlers)

## Fetching Data ✨

There are many ways to fetch data with Next.js. Depending on when you need the data and what you're doing with it, you have options:

> 👀 Checkout [swr](https://swr.vercel.app/) and [react-query](https://react-query.tanstack.com/) for your client side data fetching needs.

### getStaticProps

Next.js will run this function **at build time.** Whatever your return as props will be passed into the exported page.

```
const IndexPage = () => {// jsx }
export default IndexPage

export async function getStaticProps(context) {
  return {
    props: {}
  }
}
```

This function and all other data fetching functions **will only ever run on the server.** The actual code won't even be bundled with the client code. That means you can do some exciting things here:

- file system work ✔️
- connect to a DB ✔️
- crawl a website ✔️

The `context` object is useful when the page is dynamic. The context will contain the value of the params. This function is not run at runtime in the browser, so where do the params come in? → **getStaticPaths**🧞

### getStaticPaths

```

const IndexPage = () => {// jsx }
export default IndexPage

export async function getStaticPaths() {
  // get all the paths for your posts from an API
  // or file system
  const results = await fetch('/api/posts')
  const posts = await results.json()
  const paths = posts.map(post => ({params: {slug:
  post.slug}}))
  /*
  [
    {params: {slug: 'get-started-with-node'}},
    {params: {slug: 'top-frameworks'}}
  ]
  */
  return {paths}
}

export async function getStaticProps({ params }) {
  const res = await fetch(`/api/post/${params.slug}`)
  const post = await res.json()
  return {
    props: {post}
  }
}
```

If a page has a dynamic path `[id].jsx` and uses `getStaticProps`, it must also use `getStaticPaths` to prerender all the pages at build time into HTML.

⭐️ use `fallback: true` on your return object for getStaticPaths **if you have a big site and don't want to statically prerender all items at once**, and instead opt in to render some later at runtime via SSR.

### getServerSideProps

This will be called at runtime during every request. So unlike `getStaticProps`, you will have the runtime data like **query params**, **HTTP headers**, and the **req and res objects from API handlers**.

```
const IndexPage = () => {// jsx }
export default IndexPage

export async function getServerSideProps() {
 const response = await fetch(`https://somedata.com`)
 const data = await response.json()

 return { props: { data } }
}

```

### Conclusion

> 🤔 Do you need data at runtime but don't need SSR? <br/>
> → Use client-side data fetching.

> 🤔 Do you need data at runtime but do need SSR?<br/>
> → Use `getServerSideProps`

> 🤔 Do you have pages that rely on data that is cachable and accessible at build time? Like from a **CMS**? <br/>
> → Use `getStaticProps`

> 🤔 Do you have the same as above but the pages have dynamic URL params? <br/>
> → Use `getStaticProps` and `getStaticPaths`

## Rendering Modes ✨

**Next.js looks at the data fetching in your page components to determine how and when to prerender your page.** Here are the different modes:

- **Static Generation** Pages built at build time into HTML. CDN cacheable.
- **Server-side Rendering** Pages built at run time into HTML. Cached after the initial hit.
- **Client-side Rendering** Single-page app

By default, all pages are prerendered, even if they don't export a data fetching method. You choose the prerendering method _(static or SSR)_ by what data function you export in your page component.

For client-side rendering, fetch your data inside your components. You can mix and match these rendering modes to have a genuinely hybrid app.

## Working with SSR ✨

Sometimes you just need to skip rendering some component on the server because:

- it depends on the DOM API
- it depends on client-side data
- something else

Next.js supports dynamic imports that, when used with components, will **opt out of SSR**.

```
import dynamic from 'next/dynamic'

const SponsoredAd = dynamic(
  () => import('../components/sponsoredAd'),
  { ssr: false }
)

const Page = () => (
  <div>
    <h1>This will be prerendered</h1>

    {/* this won't*/}
    <SponsoredAd />
  </div>
)

export default Page
```
