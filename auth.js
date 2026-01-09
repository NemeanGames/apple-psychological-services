const express = require('express');
const passport = require('passport');

const router = express.Router();

// Initiate authentication with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle callback after Google authenticates the user
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

// Log out the user
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
