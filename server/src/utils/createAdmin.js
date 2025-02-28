const admin = require('../config/admin');
const User = require('../models/user.model');

const createAdminUser = async () => {
  try {
    const email = 'admin@rapidrecipes.com';
    const password = 'Admin@123';
    const username = 'admin';

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    // Set custom claims for admin
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    // Create user in MongoDB with admin role
    const newUser = new User({
      uid: userRecord.uid,
      username,
      email,
      role: 'admin',
      verified: true
    });

    await newUser.save();

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Please change the password after first login.');

  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
  process.exit();
};

createAdminUser();
