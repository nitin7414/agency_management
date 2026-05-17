import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Agency stock
    let stock = await prisma.agencyStock.findFirst();
    if (!stock) {
      stock = await prisma.agencyStock.create({ data: {} });
    }

    // Total pending balance across all customers (unpaid outstanding dues)
    const balanceAgg = await prisma.customer.aggregate({
      where: { pendingBalance: { gt: 0 } },
      _sum: { pendingBalance: true },
    });

    // Total empty across all customers (at their shops)
    const emptyAgg = await prisma.customer.aggregate({
      _sum: { totalEmptyLeft: true },
    });

    // Recent payment history (all transactions with payment)
    const paymentHistory = await prisma.transaction.findMany({
      where: { paymentAmount: { gt: 0 } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { customer: { select: { name: true } } },
    });

    // Recent delivery history
    const deliveryHistory = await prisma.transaction.findMany({
      where: { cylindersDelivered: { gt: 0 } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { customer: { select: { name: true } } },
    });

    // Recent empty collection history
    const emptyHistory = await prisma.transaction.findMany({
      where: { emptiesCollected: { gt: 0 } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { customer: { select: { name: true } } },
    });

    return NextResponse.json({
      totalFilled: stock.totalFilled,
      totalEmpty: stock.totalEmpty,
      totalPending: balanceAgg._sum.pendingBalance ?? 0,
      totalEmptyAtCustomers: emptyAgg._sum.totalEmptyLeft ?? 0,
      paymentHistory,
      deliveryHistory,
      emptyHistory,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}