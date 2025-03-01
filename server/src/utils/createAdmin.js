const admin = require("../config/firebase-admin");
const User = require("../models/user.model");

const createAdminUser = async () => {
  try {
    const email = "admin@rapidrecipes.com";
    const password = "Admin@123";
    const username = "admin";

    // Check if admin user already exists in Firebase
    try {
      const existingUser = await admin.auth().getUserByEmail(email);
      console.log("Admin user already exists in Firebase");
      
      // Ensure admin claims are set
      await admin.auth().setCustomUserClaims(existingUser.uid, { admin: true });
      
      // Check if user exists in MongoDB
      const mongoUser = await User.findOne({ email });
      if (!mongoUser) {
        const newUser = new User({
          uid: existingUser.uid,
          username,
          email,
          role: "admin",
          verified: true,
        });
        await newUser.save();
        console.log("Admin user created in MongoDB");
      } else {
        // Update existing user's role if needed
        if (mongoUser.role !== "admin") {
          mongoUser.role = "admin";
          await mongoUser.save();
          console.log("Updated existing user to admin role");
        }
      }
      
      console.log("Admin setup completed successfully!");
      return;
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
      console.log("No existing admin user found, creating new one...");
    }

    // Create new admin user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    // Set custom claims for admin
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    console.log("Admin claims set in Firebase");

    // Create user in MongoDB with admin role
    const newUser = new User({
      uid: userRecord.uid,
      username,
      email,
      role: "admin",
      verified: true,
    });

    await newUser.save();
    console.log("Admin user created in MongoDB");

    console.log("\nAdmin user created successfully!");
    console.log("================================");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("IMPORTANT: Please change the password after first login.");
    console.log("================================");
  } catch (error) {
    console.error("\nError creating admin user:");
    console.error("============================");
    console.error(error.message);
    if (error.errorInfo) {
      console.error("Firebase Error:", error.errorInfo);
    }
    console.error("============================");
  }
  process.exit();
};

// Run the admin creation process
console.log("Starting admin user setup...");
createAdminUser();
