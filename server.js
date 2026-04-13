require('dotenv').config();

const sgMail = require('@sendgrid/mail');

const express = require('express');
const bodyParser = require('body-parser');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

sgMail.send({
  to: 'felipe@acvbrasil.com.br',
  from: 'felipe@acvbrasil.com.br', // must be verified in SendGrid
  subject: 'New WhatsApp Lead',
  text: `
New lead received:

Phone: ${lead.phone}
Need: ${lead.need}
Email: ${lead.email}
`
})
.then(() => console.log("✅ Email sent"))
.catch(err => console.error("❌ Email error:", err));
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});