// POST /api/attack
// Start or end an attack session

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export default function POST({request, response}: {request: NextRequest, response: NextResponse}){
    
}