const express = require('express');
const { User } = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.post('/login', async (req, res) => {
  try {
    // logic untuk login
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Password is required'
      });
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        message: 'Email or password invalid'
      });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Email or password invalid'
      });
    }

    const access_token = jwt.sign({ id: user.id }, 'SECRET_KEY');
    res.status(200).json({
      access_token
    });
  } catch (err) {
    if (
      err.name === 'SequelizeValidationError' ||
      err.name === 'SequelizeUniqueConstraintError'
    ) {
      res.status(400).json({
        message: err.errors[0].message
      });
    } else {
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});