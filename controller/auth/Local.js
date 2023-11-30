const User = require('../../models/Users');
const jwt = require('jsonwebtoken');

const { comparePassword, hashPassword } = require('../../modules/HashPassword');

const localLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found',
      });
    }

    if(user.password){
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Wrong password',
        });
      }
  
      const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '1d' });
      return res.status(200).json({ 
        status: 'success', 
        profile: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
        access_token: token 
      });
    }

    if (user.googleId) {
      return res.status(400).json({
        status: 'error',
        message: 'You have to login with Google',
      });
    }

  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'Internal Server Error' 
    });
  }
};

const localRegister = async (req, res) => {
  const { username, email, password, password_repeat } = req.body;

  try {
    if(password !== password_repeat){
      return res.status(400).json({
        status: 'error',
        message: 'Password does not match',
      });
    }

    const existingUserByUsername = await User.findOne({ where: { username: username } });
    if (existingUserByUsername) {
      return res.status(400).json({
        status: 'error',
        message: 'Username already exists',
      });
    }

    const existingUserByEmail = await User.findOne({ where: { email: email } });
    if (existingUserByEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists',
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ 
      username: username, 
      email: email, 
      password: hashedPassword 
    });

    return res.status(201).json({
      status: 'success',
      profile: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

module.exports = {
  localLogin,
  localRegister
};