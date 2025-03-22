// GET /api/boss/status
// Get the details of the current active boss
import { NextRequest, NextResponse } from "next/server";
import { getActiveBossDetails, getAllBossDetails} from "@/lib/prisma";
import { auth } from "@/auth";
import { verifyAuth } from "@/lib/person";
export async function GET(request: NextRequest){
    const session = await auth();
    const invalidSession = await verifyAuth()
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const query =  request.nextUrl.searchParams.get("query")
    if (!query || query == "active"){
        const response = await getActiveBossDetails()
        return NextResponse.json(response)
    } else {
        const response = await getAllBossDetails()
        return NextResponse.json(response)
        
    }
}