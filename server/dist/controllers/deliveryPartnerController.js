import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
// login delivery partner
// POST /api/delivery/login
const generateToken = (id) => {
    return jwt.sign({ id, role: "delivery" }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
export const loginPartner = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Pleasev provide email and password" });
    }
    const partner = await prisma.deliveryPartner.findUnique({
        where: { email: email.toLowerCase() },
    });
    if (!partner) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!partner.isActive) {
        return res
            .status(401)
            .json({ message: "Your account has been deactivated" });
    }
    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(partner.id);
    const { password: _, ...partnerData } = partner;
    res.json({ partner: partnerData, token });
};
