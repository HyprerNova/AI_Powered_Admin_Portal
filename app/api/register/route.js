// /api/register/route.js

// Replace Prisma import with your custom query function
import { query } from "@/lib/pool"; // Assuming you saved the utility in lib/pool.js
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Note: The pool initialization is handled in lib/pool.js

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // --- 1. Check for existing user (Replaced prisma.users.findUnique) ---
    const checkQuery = "SELECT id, name, email FROM users WHERE email = $1";
    const existingUserResult = await query(checkQuery, [email]);
    const existingUser = existingUserResult.rows[0];

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // --- 2. Create new user (Replaced prisma.users.create) ---
    // RETURNING * returns the newly created row
    const insertQuery = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `;

    const userResult = await query(insertQuery, [name, email, hashedPassword]);
    const user = userResult.rows[0]; // The created user object

    return NextResponse.json(
      {
        message: "Registration successful. Please log in.",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    // You should check the error message for specific database errors (e.g., constraint violation)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
