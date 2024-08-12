"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function signUp(credentials: SignUpValues): Promise<{ error?: string }> {
    try {
        console.log("Validating credentials...");
        const { username, email, password } = signUpSchema.parse(credentials);

        console.log("Hashing password...");
        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 2,
        });

        const userId = generateIdFromEntropySize(10);

        console.log("Checking for existing username...");
        const existingUsername = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive",
                },
            },
        });

        if (existingUsername) {
            console.log("Username already exists");
            return { error: "Username already exists" };
        }

        console.log("Checking for existing email...");
        const existingEmail = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
            },
        });

        if (existingEmail) {
            console.log("Email already exists");
            return { error: "Email already exists" };
        }

        console.log("Creating new user...");
        await prisma.user.create({
            data: {
                id: userId,
                username,
                displayName: username,
                email,
                passwordHash,
                googleId: crypto.randomUUID(),
                // avatarUrl: "data:image/jpeg;base64,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", // Provide a placeholder value
                bio: "bio",
            },
        });

        console.log("Creating session...");
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

        console.log("Redirecting to home page...");
        redirect("/");
    } catch (error) {
        if (isRedirectError(error)) throw error;

        console.error("Error during sign-up process:", error);
        return { error: "Something went wrong. Please try again." };
    }
}
