const { query } = require("./utils/hasura");

exports.handler = async (event, context) => {
  const { id, poster, tagline, title } = JSON.parse(event.body);

  const { user } = context.clientContext;
  const isLoggedIn = user && user.app_metadata;
  const roles = user.app_metadata.roles || [];
  console.log;
  if (!isLoggedIn || !roles.includes("admin")) {
    return {
      statusCode: 401,
      body: "Not Authorize",
    };
  }

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
