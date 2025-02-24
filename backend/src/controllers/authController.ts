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
  const { email, password, fullName } = req.body;

  console.log("Starting signup process for:", email);

  if (!email || !password) {
    return res.status(400).json({ 
      error: "Email and password are required" 
    });
  }

  try {
    try {
      await auth.getUserByEmail(email);
      console.log("User already exists:", email);
      return res.status(400).json({ 
        error: "This email is already registered. Please use a different email." 
      });
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        console.error("Unexpected error checking user existence:", error);
        throw error;
      }
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName
    });

    console.log("User created successfully:", userRecord.uid);

    // Get the ID token
    const customToken = await auth.createCustomToken(userRecord.uid);

    // Exchange custom token for ID token
    const tokenResponse = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: customToken,
          returnSecureToken: true 
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      await auth.deleteUser(userRecord.uid);
      throw new Error("Failed to complete authentication");
    }

    return res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      token: tokenData.idToken,
    });

  } catch (error: any) {
    console.error("Signup error:", error);

    // Clean up
    if (error.uid) {
      try {
        await auth.deleteUser(error.uid);
      } catch (deleteError) {
        console.error("Error cleaning up user:", deleteError);
      }
    }

    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ 
        error: "This email is already registered. Please use a different email." 
      });
    }
    
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ 
        error: "Invalid email format" 
      });
    }
    
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({ 
        error: "Password should be at least 6 characters" 
      });
    }

    return res.status(400).json({ 
      error: "Error creating account. Please try again." 
    });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    try {
      await auth.getUserByEmail(email);
    } catch (userError) {
      return res.status(404).json({ error: "NO_ACCOUNT_EXISTS" });
    }

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
      if (data.error?.message === "INVALID_PASSWORD") {
        return res.status(401).json({ error: "INVALID_PASSWORD" });
      }
      throw new Error(data.error?.message || "Login failed");
    }

    res.status(200).json({
      uid: data.localId,
      email: data.email,
      token: data.idToken,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "INVALID_PASSWORD") {
      res.status(401).json({ error: "INVALID_PASSWORD" });
    } else {
      res.status(401).json({ error: "LOGIN_FAILED" });
    }
  }
};