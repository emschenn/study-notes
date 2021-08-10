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
