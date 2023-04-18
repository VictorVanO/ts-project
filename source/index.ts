passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.example.com/oauth2/authorize',
    tokenURL: 'https://auth.atlassian.com/oauth/token',
    clientID: 911FbCPRN8818PdoJRDpXsT6BQumvgUd,
    clientSecret: ATOA2sBqH-REwCQQqCAzmdoij9yXNeYEViAyWjRdAfnqglNmfkWpUimpqgJuBu5zEsKu0B6E0E76,
    callbackURL: "http://localhost:3000/auth/example/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));