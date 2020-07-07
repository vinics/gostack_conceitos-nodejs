const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Find repository middleware
function findRepo(request, response, next) {
  const {id} = request.params;
  const repoIndex = repositories.findIndex(repository => repository.id === id);
  console.log('REPO_INDEX: ', repoIndex);

  if (repoIndex < 0) return response.status(400).json({error: 'Repository not found!'});

  request.repository = repositories[repoIndex];
  request.repositoryIndex = repoIndex;
  return next();
}

app.use('/repositories/:id', findRepo);

// Routes
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;

  const repo = {
      id: request.repository.id, 
      title, 
      url, 
      techs, 
      likes: request.repository.likes
    };

  request.repository = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  repositories.splice(request.repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  request.repository.likes += 1;

  console.log('LIKES: ', request.repository);

  return response.json(request.repository);
});

module.exports = app;
