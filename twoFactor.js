import express from 'express';
import { send2FACode } from './emailService.js'; 

const router = express.Router();
const codeStorage = new Map(); 

//Send 2FA code
router.post('/send-2fa-code', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStorage.set(email, code); //temporary code storage

  try {
    await send2FACode(email, code); //triggers email
    console.log(`Sent 2FA code ${code} to ${email}`);
    res.status(200).json({ success: true, message: "2FA code sent" });
  } catch (err) {
    console.error("Error sending 2FA code:", err);
    res.status(500).json({ success: false, message: "Failed to send 2FA code" });
  }
});

//Verify 2FA code
router.post('/verify-2fa', (req, res) => {
  const { email, code } = req.body;
  console.log('Verifying 2FA for:', email);
  console.log('Code received:', code);

  const storedCode = codeStorage.get(email);
  console.log('Stored code:', storedCode);

  if (storedCode === code) {
    console.log('2FA success');
    codeStorage.delete(email);
    //you can return user info or a token here to complete login
    res.status(200).json({ success: true, user: { email } });
  } else {
    console.log('2FA failed');
    res.status(401).json({ success: false, message: "Invalid code" });
  }
});

// New route for OTP verification with proper API path
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStorage.set(email, code);

  try {
    await send2FACode(email, code);
    console.log(`Sent OTP code ${code} to ${email}`);
    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  console.log('Verifying OTP for:', email);
  console.log('OTP received:', otp);

  const storedCode = codeStorage.get(email);
  console.log('Stored code:', storedCode);

  if (storedCode === otp) {
    console.log('OTP verification success');
    codeStorage.delete(email);
    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } else {
    console.log('OTP verification failed');
    res.status(401).json({ success: false, message: "Invalid OTP" });
  }
});

export default router; 