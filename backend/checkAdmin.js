const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Get all users and show their admin status
    const users = await User.find({}).select('name email isAdmin');

    console.log('📋 ALL USERS:\n');
    users.forEach((user) => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Admin: ${user.isAdmin ? '✅ YES' : '❌ NO'}`);
      console.log('---');
    });

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkAdmin();