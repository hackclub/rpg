// GET /api/status
// Returns whether the user is currently attacking / in a session.
import { NextResponse, NextRequest } from "next/server"
import { isCurrentlyAttacking, getLatestSessionDetails } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: NextRequest){
    const session = await auth();
    const query = request.nextUrl.searchParams.get("query")
    if (query === "currently"){
        const attackStatus = (await isCurrentlyAttacking(session?.user.email!))!
        return NextResponse.json(attackStatus)    
    } else if (query === "latest"){
        const response = await getLatestSessionDetails(session?.user.id!)
        return NextResponse.json(response)    
    } else {
        return NextResponse.json({error: "Invalid query"})
    }
}