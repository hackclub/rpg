// GET /api/boss/status
// Get the details of the current active boss
import { NextRequest, NextResponse } from "next/server";
import { getActiveBossDetails } from "@/lib/prisma";
export async function GET(request: NextRequest){
    const response = await getActiveBossDetails()
    return NextResponse.json(response)
}