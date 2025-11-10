const express = require('express');
const router = express.Router();

// Step 1 - Task 2: Import necessary packages
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino'); // Import Pino logger

// Step 1 - Task 3: Create a Pino logger instance
const logger = pino();

dotenv.config();

// Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Basic validations for register
const registerValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').isString().trim().notEmpty().withMessage('First name is required'),
  body('lastName').isString().trim().notEmpty().withMessage('Last name is required'),
];

// /register endpoint
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!JWT_SECRET) {
      logger.error('JWT_SECRET is not configured');
      return res.status(500).send('Server configuration error');
    }

    // Task 1: Connect to `giftdb` in MongoDB through `connectToDatabase` in `db.js`
    const db = await connectToDatabase();

    // Task 2: Access MongoDB collection
    const collection = db.collection('users');

    // Task 3: Check for existing email
    const existingEmail = await collection.findOne({ email: req.body.email });
    if (existingEmail) {
      logger.warn({ email: req.body.email }, 'Email already registered');
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const email = req.body.email;

    // Task 4: Save user details in database
    const newUser = await collection.insertOne({
      email: email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });

    // Task 5: Create JWT authentication
    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };
    const authtoken = jwt.sign(payload, JWT_SECRET);

    logger.info('User registered successfully');
    return res.json({ authtoken, email });
  } catch (e) {
    logger.error({ err: e }, 'Internal server error in /register');
    return res.status(500).send('Internal server error');
  }
});

module.exports = router;