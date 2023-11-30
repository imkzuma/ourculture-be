const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const jwt = require('jsonwebtoken');

const User = require("../../models/Users");

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
    //callbackURL: "https://hello-world-ojy22lhfsq-as.a.run.app/auth/google/callback",
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ where: { googleId: profile.id } });

      if(!user){
        const isEmailExist = await User.findOne({ where: { email: profile.email } });

        if (isEmailExist) {
          await User.update({ googleId: profile.id, googleToken: accessToken }, { where: { email: profile.email } });
  
          if (isEmailExist.avatar === null) {
            await User.update({ avatar: profile.picture }, { where: { email: profile.email } });
          }

          user = await User.findOne({ where: { email: profile.email } });
  
          const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '1d' });
          return done(null, { user, token });
        }

        const newUser = await User.create({
          username: profile.displayName,
          email: profile.email,
          googleId: profile.id,
          googleToken: accessToken,
          avatar: profile.picture
        });
  
        const token = jwt.sign({ newUser }, process.env.SECRET_KEY, {expiresIn: '1d'})
        return done(null, {newUser, token});
      }

      await user.update({ googleToken: accessToken });
      const token = jwt.sign({ user }, process.env.SECRET_KEY, {expiresIn: '1d'});

      return done(null, {user, token});
      
    } catch (error) {
      return done(error, null);
    }
  }
));

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
const googleAuthCallback = passport.authenticate('google', { session: false });

const googleLogin = async (req, res) => {
  try {
    const { 
      username,
      email, 
      googleId,
      googleToken, 
      avatar 
    } = req.body;

    let user = await User.findOne({ where: { googleId: googleId } });
    
    if(!user){
      const isEmailExist = await User.findOne({ where: { email: email } });

      if(isEmailExist) {
        await User.update({ googleId: googleId, googleToken: googleToken }, { where: { email: email } });

        if(isEmailExist.avatar === null) {
          await User.update({ avatar: avatar }, { where: { email: email } });
        }
        
        user = await User.findOne({ where: { email: email } });

        const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).json({ user, token });
      }

      const newUser = await User.create({
        username,
        email,
        googleId,
        googleToken,
        avatar,
      });

      const token = jwt.sign({ newUser }, process.env.SECRET_KEY, { expiresIn: '1d' });
      return res.status(200).json({ newUser, token });
    }
    
    await user.update({ googleToken: googleToken });

    const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '1d' });
    return res.status(200).json({ user, token });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  }
}

module.exports = {
  googleAuth,
  googleAuthCallback,
  googleLogin
};