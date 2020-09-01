import express from 'express'
import cors from 'cors'
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
    displayName: req.body.displayName,
    photoURL: req.body.photoURL,
    uid: req.body.uid,
    email: req.body.email,
  };
  const existing = participants.find((users) => { return users.uid === newParticipant.uid })
  if (existing) {
    res.json({ status: "user exist" });
  } else {
    participants = [...participants, newParticipant];
    res.json({ status: "ok" });
  }
  console.log(JSON.stringify(participants, null, 4))
});
app.post('/logout-participant', (req, res) => {
  participants = participants.filter((users) => { return users.uid === req.body.uid })
  console.log(JSON.stringify(participants, null, 4))
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));