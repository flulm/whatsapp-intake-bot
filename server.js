require('dotenv').config();

const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
  }
});

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
try {
  await transporter.sendMail({
    from: 'acvbrasilform@gmail.com',
    to: 'acvbrasilform@gmail.com',
    subject: 'New WhatsApp Lead',
    text: `
New lead received:

Phone: ${lead.phone}
Need: ${lead.need}
Email: ${lead.email}
`
  });

  console.log("✅ Email sent!");
} catch (err) {
  console.error("❌ Email error:", err);
}

    delete state[from];

    return res.send(`<Response><Message>Thanks! We'll reply by email within a few hours 😊</Message></Response>`);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));