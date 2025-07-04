import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please insert username !'],
      unique: true,
      trim: true,
      minlength: [5, 'Username must contain at least 5 characters !']
    },
    email: {
      type: String,
      required: [true, 'Please insert email !'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must contain at least 8 characters !']
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = function (userPassword) {
  return bcrypt.compare(userPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
