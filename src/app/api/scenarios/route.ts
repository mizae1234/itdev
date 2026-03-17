import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET — list all scenarios
export async function GET() {
  try {
    const scenarios = await prisma.scenario.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(scenarios);
  } catch {
    return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
  }
}

// POST — save / update scenario
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, ...params } = body;

    if (id) {
      // Update existing
      const updated = await prisma.scenario.update({
        where: { id },
        data: { name, ...params },
      });
      return NextResponse.json(updated);
    } else {
      // Create new
      const created = await prisma.scenario.create({
        data: { name: name || 'Scenario', ...params },
      });
      return NextResponse.json(created);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

// DELETE — delete scenario
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.scenario.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
