import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  encrypted_password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model('User', userSchema)

export default User
