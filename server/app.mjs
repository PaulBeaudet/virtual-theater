// tslint:disable-next-line: no-var-requires
import express from 'express'
// tslint:disable-next-line: no-var-requires
import cors from 'cors'
// tslint:disable-next-line: no-var-requires
import bodyParser from 'body-parser'

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let participants = [];

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/sample-get-request', (req, res) => {
  res.json(req.query);
});
app.post('/sample-post-request', (req, res) => res.json(req.body));
app.post('/new-participant', (req, res) => {
  const newParticipant = {
    name: req.body.name,
    photoURL: req.body.photoURL,
  };
  participants = [...participants, newParticipant];
  res.json({ status: "ok" });
  console.log(JSON.stringify(participants, null, 4))
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));