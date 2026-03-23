import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const version = searchParams.get("v") || "v2";
  
  if (!path) {
    return NextResponse.json({ success: false, message: "Missing path" }, { status: 400 });
  }

  const RUMAHOTP_API_KEY = process.env.RUMAHOTP_API_KEY;
  
  if (!RUMAHOTP_API_KEY) {
    return NextResponse.json({ success: false, message: "API key not configured" }, { status: 500 });
  }

  // Build target URL (use www as per official docs)
  const baseUrl = `https://www.rumahotp.com/api/${version}/${path}`;
  const targetUrl = new URL(baseUrl);
  
  searchParams.forEach((value, key) => {
    if (key !== "path" && key !== "v") {
      targetUrl.searchParams.append(key, value);
    }
  });

  console.log(`[RumahOTP] Calling: ${targetUrl.toString()}`);

  try {
    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "x-apikey": RUMAHOTP_API_KEY,
        "Accept": "application/json",
      },
      redirect: "follow",
    });
    
    const responseText = await response.text();
    
    console.log(`[RumahOTP] Status: ${response.status}, Length: ${responseText.length}`);

    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch {
      // Not JSON - log first 300 chars for debug
      console.error(`[RumahOTP] Non-JSON response (first 300 chars): ${responseText.substring(0, 300)}`);
      return NextResponse.json({ 
        success: false, 
        message: `API Error (status ${response.status})`,
      }, { status: 502 });
    }
  } catch (error: any) {
    console.error("[RumahOTP] Fetch error:", error?.message || error);
    return NextResponse.json({ 
      success: false, 
      message: `Connection error: ${error?.message || "Unknown"}` 
    }, { status: 500 });
  }
}
