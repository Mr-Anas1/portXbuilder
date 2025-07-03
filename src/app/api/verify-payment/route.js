import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Implement Dodo Payments payment verification
  return NextResponse.json(
    { error: "Dodo Payments integration not implemented yet" },
    { status: 501 }
  );
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
