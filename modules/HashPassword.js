const bcrypt = require('bcrypt');
const saltRound = 10;

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

const comparePassword = async (password, hashedPassword) => {
  try {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    return isPasswordValid;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  hashPassword,
  comparePassword
};