import { createRole, getAllRoles } from "@/lib/controllers/role.controller";
import { NextRequest, NextResponse } from "next/server";

export const POST = createRole;
export const GET = getAllRoles;
