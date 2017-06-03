// @flow

import compression from 'compression'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import passport from 'passport'
import session from 'express-session'

import { APP_NAME, STATIC_PATH, WEB_PORT } from '../shared/config'
import { isProd } from '../shared/util'
import renderApp from './render-app'
import wand from './wand'
import canvas from './canvas'
import auth from './auth'
import models from './models'

mongoose.Promise = bluebird

mongoose.connect('mongodb://localhost:27017/test')

// let a = new models.User({name: 'ads', email: 'ads@gmail.com', encrypted_password: 'sdfsd'})
// a.save(function(err){
//   if (err) {
//     console.log('Fucked up')
//   }
//   console.log('User saved')
// })

const app = express()

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))


app.use(passport.initialize())
app.use(passport.session())

  /*
   *  Social auth
   */

passport.use(auth.twitter)
passport.use(auth.google)

app.get('/auth/twitter', passport.authenticate('twitter', { scope: ['email'] }))

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/wand', failureRedirect: '/login' }))

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
  'https://www.googleapis.com/auth/userinfo.email'] }))

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/wand')
})

passport.serializeUser((user, done) => {
  done(null, user.email)
})

passport.deserializeUser((email, done) => {
  models.User.findOne({ email }).exec()
    .then((data) => { done(null, data) })
    .catch((err) => { done(err) })
})

app.get('/', (req, res) => {
  res.send(renderApp(APP_NAME))
})

app.get('/wand', (req, res) => {
  res.send(wand())
})


app.get('/canvas', (req, res) => {
  res.send(canvas())
})

app.listen(WEB_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)' : '(development)'}.`)
})

