import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Implement Dodo Payments webhook handling
  return NextResponse.json(
    { error: "Dodo Payments integration not implemented yet" },
    { status: 501 }
  );
}
