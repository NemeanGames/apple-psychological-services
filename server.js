const express = require('express');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

// Route modules
const authRoutes = require('./auth');
const crmRoutes = require('./crm');
const cmsRoutes = require('./cms');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // In a real app you would find or create a user in your DB here.
      return done(null, profile);
    }
  )
);

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Serve static files
app.use(express.static(__dirname));

// API routes
app.use('/auth', authRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/cms', cmsRoutes);

// fallback for index.html for non-API requests
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/auth')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).end();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
