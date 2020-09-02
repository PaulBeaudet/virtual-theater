import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express();
const port = 8000;
const TABLES = 19;
const SEATS = 6;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let participants = [];
const emptySeat = {
  displayName: '',
  photoURL: '',
  uid: '',
  email: '',
}

let roomLayout = [];
for (let table = 0; table < TABLES; table++) {
  roomLayout[table] = [];
  for (let seat = 0; seat < SEATS; seat++) {
    roomLayout[table][seat] = emptySeat;
  }
}
const addParticipant = (newParticipant) => {
  const newLayout = [...roomLayout];
  let userAdded = false;
  for (let table = 0; table < TABLES; table++) {
    if (userAdded) { break; }
    for (let seat = 0; seat < SEATS; seat++) {
      if (roomLayout[table][seat].uid) {
        console(`seat: ${seat} at table: ${table} has been taken`);
      } else {
        console.log(`Adding new user ${newParticipant.displayName}`)
        newLayout[table][seat] = { ...newParticipant }
        userAdded = true;
        break;
      }
    }
  }
  return newLayout
};

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
    roomLayout = addParticipant(newParticipant);
    console.log('returning room layout')
    console.log(JSON.stringify(roomLayout, null, 4))
    res.json({ status: "ok" });
  }
});
app.post('/logout-participant', (req, res) => {
  participants = participants.filter((users) => { return users.uid !== req.body.uid })
});
app.get('/load-room', (req, res) => {
  res.json(roomLayout);
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));