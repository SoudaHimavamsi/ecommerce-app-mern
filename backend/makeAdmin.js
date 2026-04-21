const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Use ADMIN_EMAIL env variable, or pass as a command-line argument:
    //   node makeAdmin.js someone@example.com
    const email = process.argv[2] || process.env.ADMIN_EMAIL;

    if (!email) {
      console.error('❌ No email provided.');
      console.error('   Usage:  node makeAdmin.js <email>');
      console.error('   Or set: ADMIN_EMAIL=your@email.com in .env');
      process.exit(1);
    }

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
