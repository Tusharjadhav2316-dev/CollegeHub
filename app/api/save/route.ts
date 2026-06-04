import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Save GET placeholder" });
}

export async function POST() {
  return NextResponse.json({ message: "Save POST placeholder" });
}

export async function DELETE() {
  return NextResponse.json({ message: "Save DELETE placeholder" });
}
