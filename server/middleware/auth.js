const { User } = require('../models/User');

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        //쿠키의 토큰에서 유저 정보 반환
        isAuth: false,
        error: true
      });

    req.token = token;
    req.user = user; // 모든 유저 정보가 req.user에 들어감
    next();
  });
};

module.exports = { auth };
