const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(express.json());
app.use(express.static('dist'))
app.use(morgan(":method :url :body"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423121",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!person.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  if (!person.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  const name = persons.find((p) => p.name === person.name);
  if (name) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  person.id = Math.floor(Math.random() * 500) + 100;
  persons = persons.concat(person);
  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) response.json(person);
  else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
