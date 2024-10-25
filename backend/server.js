
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const { Contact } = require('../models');
const app = express();
app.use(cors());
app.use(bodyParser.json());

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return User;
  };

  
  module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      timezone: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    });
    return Contact;
  };
  
// Define your routes here
app.listen(5000, async () => {
  console.log('Server is running on http://localhost:5000');
  await sequelize.sync(); // Ensure database tables are created
});

// Register user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashedPassword });
  res.status(201).send('User registered');
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});
module.exports = router;

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Create a contact
router.post('/', authenticateJWT, async (req, res) => {
  const { name, email, phone, address, timezone } = req.body;
  const contact = await Contact.create({ userId: req.user.id, name, email, phone, address, timezone });
  res.status(201).json(contact);
});

// Get all contacts for the user
router.get('/', authenticateJWT, async (req, res) => {
  const contacts = await Contact.findAll({ where: { userId: req.user.id } });
  res.json(contacts);
});
// Other CRUD operations...
module.exports = router;

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return User;
  };
  