// GET /api/status
// Returns whether the user is currently attacking / in a session or information about the latest session.
import { NextResponse, NextRequest } from "next/server"
import { isCurrentlyBattling, getLatestSessionDetails } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: NextRequest){
    const session = await auth();
    const query = request.nextUrl.searchParams.get("query")
    const bool = request.nextUrl.searchParams.get("bool")
    if (query === "currently"){
        const attackStatus = (await isCurrentlyBattling(session?.user.email!))!
        return NextResponse.json(attackStatus)    
    } else if (query === "latest"){
        const response = await getLatestSessionDetails(session?.user.id!)
        return NextResponse.json(response)    
    } else {
        return NextResponse.json({error: "Invalid query"})
    }
}