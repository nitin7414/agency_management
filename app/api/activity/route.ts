import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");

    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    if (format === "csv") {
      // Build CSV
      const rows = [
        ["Date", "Time", "Type", "Description", "Customer", "Amount (₹)", "Cylinders"],
        ...logs.map((l: any) => [
          new Date(l.createdAt).toLocaleDateString("en-IN"),
          new Date(l.createdAt).toLocaleTimeString("en-IN"),
          l.type,
          l.description,
          l.customerName || "",
          l.amount?.toFixed(2) || "",
          l.cylinders?.toString() || "",
        ]),
      ];
      const csv = rows.map((r) => r.map((c: any) => `"${c}"`).join(",")).join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="ssga-activity-${Date.now()}.csv"`,
        },
      });
    }

    // Calculate monthly performance statistics for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const txns = await prisma.transaction.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        createdAt: true,
        cylindersDelivered: true,
        paymentAmount: true,
      },
    });

    // Group by month
    const monthlyStats: Record<string, { month: string; cylinders: number; payments: number }> = {};
    
    // Initialize last 6 months in order
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toLocaleString("en-US", { month: "short" });
      const yearKey = d.getFullYear().toString().slice(-2);
      const label = `${monthKey} '${yearKey}`;
      monthlyStats[label] = { month: label, cylinders: 0, payments: 0 };
    }

    txns.forEach((t: { createdAt: string | number | Date; cylindersDelivered: any; paymentAmount: any; }) => {
      const d = new Date(t.createdAt);
      const monthKey = d.toLocaleString("en-US", { month: "short" });
      const yearKey = d.getFullYear().toString().slice(-2);
      const label = `${monthKey} '${yearKey}`;
      
      if (monthlyStats[label]) {
        monthlyStats[label].cylinders += t.cylindersDelivered ?? 0;
        monthlyStats[label].payments += t.paymentAmount ?? 0;
      }
    });

    const performance = Object.values(monthlyStats);

    return NextResponse.json({
      logs,
      performance,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}