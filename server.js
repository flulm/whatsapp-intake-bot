require('dotenv').config();

const axios = require('axios');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const state = {};

app.post('/webhook', async (req, res) => {
  const msg = req.body.Body;
  const from = req.body.From;

  if (!state[from]) {
    state[from] = { step: 1 };
    return res.send(`<Response><Message>Hi! 👋 What do you need help with?</Message></Response>`);
  }

  if (state[from].step === 1) {
    state[from].need = msg;
    state[from].step = 2;
    return res.send(`<Response><Message>Great 👍 What's your email?</Message></Response>`);
  }

  if (state[from].step === 2) {
    const email = msg;

  const lead = {
    phone: from,
    need: state[from].need,
    email
  };


    delete state[from];

    res.send(`<Response><Message>Thanks! We'll reply by email within a few hours 😊</Message></Response>`);

await axios.post(process.env.TEAMS_WEBHOOK_URL, {
  text: `📩 New WhatsApp Lead

Phone: ${lead.phone}
Need: ${lead.need}
Email: ${lead.email}`
});
  }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});