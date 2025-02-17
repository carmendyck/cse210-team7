import { Request, Response } from "express";
import { auth } from "../config/firebase";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

if (!FIREBASE_API_KEY) {
  console.error("Missing FIREBASE_API_KEY in .env file");
  process.exit(1);
}

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password both are required" });
  }

  try {
    const userRecord = await auth.createUser({ email, password });
    const signUpResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const data = await signUpResponse.json();
    if (!signUpResponse.ok) {
      throw new Error(data.error?.message || "Signup failed");
    }

    res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      token: data.idToken,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password both are required" });
  }

  try {
    const signInResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const data = await signInResponse.json();

    if (!signInResponse.ok) {
      if (data.error?.message === "EMAIL_NOT_FOUND") {
        return res.status(404).json({ error: "EMAIL_NOT_FOUND" });
      }
      if (data.error?.message === "INVALID_PASSWORD") {
        return res.status(401).json({ error: "INVALID_PASSWORD" });
      }
      throw new Error(data.error?.message || "Invalid credentials");
    }

    res.status(200).json({
      uid: data.localId,
      email: data.email,
      token: data.idToken,
    });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};
