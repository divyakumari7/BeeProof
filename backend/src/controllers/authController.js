const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/authMiddleware');

class AuthController {
  async login(req, res, next) {
    try {
      const identifier = req.body.username || req.body.email;
      const { password } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({ success: false, message: 'Username/email and password are required' });
      }

      const cleanIdentifier = identifier.toLowerCase().trim();
      const user = await User.findOne({
        $or: [{ username: cleanIdentifier }, { email: cleanIdentifier }]
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        message: 'Authentication successful',
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            roles: [user.role],
            primaryRole: user.role,
            organization: user.organization,
            phone: user.phone
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      return res.json({
        success: true,
        data: {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          fullName: req.user.fullName,
          role: req.user.role,
          roles: [req.user.role],
          primaryRole: req.user.role,
          organization: req.user.organization,
          phone: req.user.phone
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
