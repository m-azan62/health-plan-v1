// app/api/plans/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  const plans = await prisma.plan.findMany();
  return Response.json(plans);
}
