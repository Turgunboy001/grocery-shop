// create order
// POST /api/orders
import { prisma } from "../config/prisma.js";
export const createOrder = async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    //   check if order items are empty
    if (!items || items.length === 0) {
        res.status(400).json({ message: "No order items" });
    }
    //   look up actual prices from the  database
    const productId = items.map((i) => i.product);
    const products = await prisma.product.findMany({
        where: { id: { in: productId } },
    });
    const productMap = {};
    products.forEach((p) => (productMap[p.id] = p));
    // prodcut mapp ni consoleda korishim kerak
    console.log(productMap, "productMap");
    for (const item of items) {
        const product = productMap[item.product];
        if ((!product || product.stock) ?? 0 < item.quantity) {
            return res.status(404).json({ message: "Product out of stock" });
        }
    }
    const orderItems = items.map((item) => {
        const dbProduct = productMap[item.product];
        if (!dbProduct)
            throw new Error(`Product ${item.product} not found`);
        return {
            product: dbProduct.id,
            name: dbProduct.name,
            image: dbProduct.image,
            price: dbProduct.price,
            quantity: item.quantity,
            unit: dbProduct.unit,
        };
    });
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 20 ? 0 : 1.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = (Math.round(subtotal + deliveryFee + tax) * 100) / 100;
    const order = await prisma.order.create({
        data: {
            userId: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            deliveryFee,
            tax,
            total,
            statusHistory: [
                {
                    status: "Placed",
                    note: "Order placed successfully",
                    timestamp: new Date(),
                },
            ],
        },
    });
    if (paymentMethod === "card") {
        //  stripe payment link
    }
    res.json({ order });
    //   decrease stack
    for (const item of orderItems) {
        await prisma.product.update({
            where: { id: item.product },
            data: { stock: { decrement: item.quantity } },
        });
    }
};
// GET /api/orders
export const getUserOrders = async (req, res) => {
    const { status } = req.query;
    const where = {
        userId: req.user.id,
        NOT: [{ PaymentMethod: "card", isPaid: false }],
    };
    if (status && status !== "all") {
        where.status = status;
    }
    const orders = await prisma.order.findMany({
        where,
        include: { deliveryPartner: { select: { name: true, phone: true } } },
        orderBy: { createdAt: "desc" },
    });
    res.json({ orders });
};
// GET signle order
// GET /api/orders/:id
export const getOrder = async (req, res) => {
    const order = await prisma.order.findFirst({
        where: { id: req.params.id, userId: req.user.id },
        include: {
            deliveryPartner: {
                select: { name: true, phone: true, avatar: true, vehicleType: true },
            },
        },
    });
    if (!order) {
        res.status(404).json({ message: "Order not found" });
    }
    res.json({ order });
};
// update order status (admin)
// PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    const { status, note } = req.body;
    const order = await prisma.order.findUnique({
        where: { id: req.params.id },
    });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []);
    history.push({
        status,
        note: note || `Order ${status.toLowerCase()}`,
        timeStamp: new Date(),
    });
    const updatedOrder = await prisma.order.update({
        where: { id: req.params.id },
        data: { status, statusHistory: history },
    });
    res.json({ updatedOrder });
};
// get all orders
// GET /api/orders/all
export const getAllOrders = async (req, res) => {
    const orders = await prisma.order.findMany({
        where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
        include: {
            user: { select: { name: true, email: true } },
            deliveryPartner: { select: { name: true, phone: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    res.json({ orders });
};
// get order location
// GET /api/orders/:id/location
export const getOrderLocation = async (req, res) => {
    const order = await prisma.order.findFirst({
        where: { id: req.params.id, userId: req.user.id },
        select: { liveLocation: true, status: true },
    });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.json({ liveLocation: order.liveLocation, status: order.status });
};
