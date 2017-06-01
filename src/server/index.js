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

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/wand', failureRedirect: '/login' }))


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

