const oAuthIds = {
    github: {
      clientID: "a7e8d9f1129851b236f0",
      clientSecret: "2bcb59f7cb78e3dbcb9b2d79e281bee536b9df7b",
      callbackURL: "http://localhost:8000/auth/github/callback"
    },
    google: {
      clientID:"1092667427158-ufb801t7gtg8na244aaafd7pv9cb3r77.apps.googleusercontent.com",
      clientSecret:"wk25tRHgUyFZCj1uWtf_n--G",
      callbackURL:"http://localhost:8000/auth/google/callback"
    },
    oauth2: {
      clientID: "a16727d6451e635a578c0155370126463ee329fe7d794a76779c391b8971f786",
      clientSecret:"caf2187a11fd9a45faa2854cacddeaeba15fafa1806bd558430ce4d94c8167cf",
      callbackURL:"http://localhost:8000/auth/42/callback",
      authorizationURL: "https://api.intra.42.fr/oauth/authorize",
      tokenURL: "https://api.intra.42.fr/oauth/token"
    },
    OpenSubtitles: {
      username: 'lpan42',
      password: 'Ashley0930',
    }
  };
  
  module.exports = oAuthIds;