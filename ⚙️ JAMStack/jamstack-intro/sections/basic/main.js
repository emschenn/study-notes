const listRepo = async (username) => {
  const repos = await fetch(
    `https://api.github.com/users/${username}/repos?type=owner&sort=updated`
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });

  const mockup = repos
    .map(
      (repo) => `
            <li> 
            <a href="${repo.html_url}">${repo.name}</a>
            (⭐️ ${repo.stargazers_count})
            </li>
        `
    )
    .join("");

  const content = document.querySelector("#content");

  content.innerHTML = `<ul>${mockup}</ul>`;
};

listRepo("emschenn");
