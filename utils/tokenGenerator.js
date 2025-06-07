import jwt from 'jsonwebtoken';

// Generates and returns a jwt token based on param: user
const generateToken = (user) => {
  const { email, role } = user;  
  // Token expires in 3 days
  const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '3d' });
  return token;
};

export { generateToken };
