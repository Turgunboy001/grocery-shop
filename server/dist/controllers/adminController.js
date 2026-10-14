import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
// get admin dashbord data
export const getAdminStats = async (req, res) => {
    const [totalOrders, totalUsers, totalProducts, outOfStock, totalPartners, recentOrders,] = await Promise.all([
        prisma.order.count(),
        prisma.user.count(),
        prisma.product.count(),
        prisma.product.count({ where: { stock: 0 } }),
        prisma.deliveryPartner.count(),
        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 8,
            include: {
                user: { select: { name: true, email: true } },
                deliveryPartner: { select: { name: true, phone: true } },
            },
        }),
    ]);
    res.json({
        totalProducts,
        totalOrders,
        totalPartners,
        totalUsers,
        recentOrders,
        outOfStock,
    });
};
// get delivery partners list for admin
export const getDeliveryPartners = async (req, res) => {
    const partners = await prisma.deliveryPartner.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json({ partners });
};
// create delivery partner profile
export const createDeliveryPartner = async (req, res) => {
    const { name, email, password, phone, vehicleType } = req.body;
    if (!name || !email || !password || !phone) {
        res.status(400).json({ message: "Please provide all required fields" });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const partner = await prisma.deliveryPartner.create({
        data: {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            vehicleType,
        },
    });
    res.status(201).json({ partner });
};
// update delivery partner profile
export const updateDeliveryPartner = async (req, res) => {
    const { name, phone, vehicleType, isActive } = req.body;
    const data = {};
    if (name)
        data.name = name;
    if (phone)
        data.phone = phone;
    if (vehicleType)
        data.vehicleType = vehicleType;
    data.isActive = isActive;
    try {
        const partner = await prisma.deliveryPartner.update({
            where: { id: req.params.id },
            data,
        });
        res.json({ partner });
    }
    catch (error) {
        res.status(404).json({ message: "Partner not found" });
    }
};
// assign delivery partner for order
export const assignDeliveryPartner = async (req, res) => {
    try {
        const { partnerId } = req.body;
        if (!partnerId) {
            return res.status(400).json({ message: "partnerId is required" });
        }
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []);
        history.push({
            status: "Assigned",
            note: "Assigned to delivery partner",
            timestamp: new Date(),
        });
        const updated = await prisma.order.update({
            where: { id: order.id },
            data: {
                deliveryPartnerId: partnerId,
                status: "Assigned",
                statusHistory: history,
            },
        });
        res.json({ order: updated });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
