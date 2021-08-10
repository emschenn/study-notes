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
