import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.join(__dirname, 'frontend');
const pbrTilesDir = path.join(__dirname, 'pbr_tiles');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Serve the application at / and expose the tile library at the URL expected
// by frontend/js/pbr/PBR.js.
app.use(express.static(frontendDir));
app.use('/pbr_tiles', express.static(pbrTilesDir));

const submissions = [];

app.post('/api/submit', async (req, res) => {
  try {
    const data = req.body;
    submissions.push(data);

    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SUBMISSION_EMAIL } = process.env;

    // Email is optional in local/static deployments. A submission is still
    // accepted when SMTP has not been configured.
    if (SMTP_HOST && SMTP_USER && SMTP_PASS && SUBMISSION_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: SMTP_SECURE === 'true',
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      });

      await transporter.sendMail({
        from: `"Pool Designer" <${SMTP_USER}>`,
        to: SUBMISSION_EMAIL,
        subject: 'New Pool Design Submitted',
        text: `A new pool design was submitted: ${JSON.stringify(data, null, 2)}`
      });
    }

    res.json({ message: 'Design submitted successfully!' });
  } catch (err) {
    console.error('Submission failed:', err);
    res.status(500).json({ message: 'Failed to submit design.' });
  }
});

app.get('/api/submissions', (_req, res) => {
  res.json(submissions);
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
