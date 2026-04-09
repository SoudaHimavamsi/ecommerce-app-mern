const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Replace with your email
    const email = 'vamsihima71@gmail.com'; // CHANGE THIS TO YOUR ACTUAL EMAIL

    const user = await User.findOne({ email });

    if (user) {
      user.isAdmin = true;
      await user.save();
      console.log(`✅ User ${user.name} (${user.email}) is now an admin!`);
    } else {
      console.log('❌ User not found. Make sure you have registered first.');
    }

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();