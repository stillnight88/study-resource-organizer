import User from "../models/User.js";

const createAdminAccount = async () => {
    try {
        const adminExists = await User.findOne({ email: "admin@study.com" });

        if (!adminExists) {
            await User.create({
                name: "Admin",
                email: "admin@study.com",
                password: "admin123",
                role: "admin",
            });
            console.log("Admin account created");
        }
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};

export default createAdminAccount;