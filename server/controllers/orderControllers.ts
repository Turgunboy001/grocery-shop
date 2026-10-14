import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

// create order
// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // quantity tekshiruvi + takror mahsulotlarni birlashtirish
    const qtyMap: Record<string, number> = {};
    for (const i of items) {
      const qty = Number(i.quantity);
      if (!i.product || !Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ message: "Invalid item or quantity" });
      }
      qtyMap[i.product] = (qtyMap[i.product] ?? 0) + qty;
    }

    // narxlarni bazadan olamiz
    const productIds = Object.keys(qtyMap);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap: Record<string, (typeof products)[0]> = {};
    products.forEach((p) => (productMap[p.id] = p));

    for (const id of productIds) {
      const product = productMap[id];
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if ((product.stock ?? 0) < qtyMap[id]) {
        return res
          .status(400)
          .json({ message: `${product.name} is out of stock` });
      }
    }

    const orderItems = productIds.map((id) => {
      const p = productMap[id];
      return {
        product: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        quantity: qtyMap[id],
        unit: p.unit,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const deliveryFee = subtotal > 20 ? 0 : 1.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

    // buyurtma + stock kamaytirish bitta transaction ichida
    const order = await prisma.$transaction(async (tx) => {
      for (const item of orderItems) {
        const result = await tx.product.updateMany({
          where: { id: item.product, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          throw new Error(`${item.name} is out of stock`);
        }
      }

      return tx.order.create({
        data: {
          userId: req.user!.id,
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
    });

    if (paymentMethod === "card") {
      // stripe payment link
    }

    // Inngest xato bersa ham buyurtma saqlangan, shuning uchun alohida ushlaymiz
    try {
      for (const item of orderItems) {
        await inngest.send({
          name: "inventory/stock.update",
          data: { productId: item.product },
        });
      }
      await inngest.send({ name: "order/placed", data: { orderId: order.id } });
    } catch (e) {
      console.error("Inngest error:", e);
    }

    res.json({ order });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = { userId: req.user!.id };

    if (status && status !== "all") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: { deliveryPartner: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id
export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id as string, userId: req.user!.id },
      include: {
        deliveryPartner: {
          select: { name: true, phone: true, avatar: true, vehicleType: true },
        },
      },
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// update order status (admin)
// PUT /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;

    if (!status || typeof status !== "string") {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const history = (
      Array.isArray(order.statusHistory) ? order.statusHistory : []
    ) as any[];
    history.push({
      status,
      note: note || `Order ${status.toLowerCase()}`,
      timestamp: new Date(),
    });

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id as string },
      data: { status, statusHistory: history },
    });
    res.json({ updatedOrder });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/all
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        deliveryPartner: { select: { name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id/location
export const getOrderLocation = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id as string, userId: req.user!.id },
      select: { liveLocation: true, status: true, deliveryOtp: true },
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({
      liveLocation: order.liveLocation,
      status: order.status,
      deliveryOtp: order.deliveryOtp,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
