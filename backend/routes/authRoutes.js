import express from 'express'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import mongoose from 'mongoose'
import User from '../models/User.js'
import authMiddleware from '../middleware/authMiddleware.js'
import memoryStore from '../utils/memoryStore.js'

const router = express.Router()

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your_secret_key', {
    expiresIn: '7d',
  })
}

const isMongoConnected = () => {
  return mongoose.connection.readyState === 1
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    let userExists
    if (isMongoConnected()) {
      userExists = await User.findOne({ email })
    } else {
      userExists = memoryStore.findUserByEmail(email)
    }

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)
    const userId = `user_${Date.now()}`

    let user
    if (isMongoConnected()) {
      const newUser = new User({ name, email, password: hashedPassword, role })
      user = await newUser.save()
    } else {
      user = memoryStore.saveUser(userId, {
        name,
        email,
        password: hashedPassword,
        role,
      })
    }

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Register error:', err.message)
    res.status(500).json({ message: 'Failed to register user' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    let user
    if (isMongoConnected()) {
      user = await User.findOne({ email })
    } else {
      user = memoryStore.findUserByEmail(email)
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ message: 'Failed to login' })
  }
})

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    let user
    if (isMongoConnected()) {
      user = await User.findById(req.user.userId)
    } else {
      user = memoryStore.getUser(req.user.userId)
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (err) {
    console.error('Get user error:', err.message)
    res.status(500).json({ message: 'Failed to fetch user' })
  }
})

export default router
