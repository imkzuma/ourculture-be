const User = require("../../models/Users");

const getWhoAmI = async (req, res) => {
  try {
    const { id } = req.user.user;

    const result = await User.findOne({
      where: { id },
      attributes: ['id', 'googleId', 'username', 'email', 'avatar'],
    });

    res.status(200).json({
      data: {
        userId: result.id,
        googleId: result.googleId || null,
        username: result.username,
        email: result.email,
        avatar: result.avatar,
      },
      message: "Success get user",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getProfileByUsername = async (req, res) => { 
  try {
    const { username } = req.params;

    const result = await User.findOne({
      where: { username },
      attributes: ['id', 'googleId', 'username', 'email', 'avatar'],
    });

    res.status(200).json({
      data: {
        userId: result.id,
        googleId: result.googleId || null,
        username: result.username,
        email: result.email,
        avatar: result.avatar,
      },
      message: "Success get user",
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

module.exports = {
  getWhoAmI,
  getProfileByUsername
};