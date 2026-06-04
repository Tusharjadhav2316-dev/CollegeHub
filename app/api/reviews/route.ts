import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Reviews GET placeholder" });
}

export async function POST() {
  return NextResponse.json({ message: "Reviews POST placeholder" });
}
