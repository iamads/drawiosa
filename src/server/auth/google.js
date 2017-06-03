import config from '../../../config'
import User from '../models/user'

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const google = new GoogleStrategy(config.auth.google,
    (token, tokenSecret, profile, done) => {
      const user = {
        name: profile.displayName,
        email: profile.emails[0].value,
      }
      const query = User.findOne({ email: user.email })

      query.exec()
        .then((data) => {
          if (!data) {
            User.create(user, (err, newUser) => {
              if (err) { done(err) }
              return done(null, newUser)
            })
          }
          return done(null, data)
        })
        .catch((err) => {
          console.log(`User could neither br found nor created ${err}`)
          return done(err)
        })
    })

export default google
