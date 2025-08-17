"use client";

import { auth, db } from "@/firebase/firebaseClient";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export type SignUpParams = { name: string; email: string; password: string };
export type SignInParams = { email: string; password: string };
export type ActionResult = {
  success: boolean;
  message?: string;
  idToken?: string;
};
export type AppUser = {
  id: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt?: Timestamp | null;
  lastLoginAt?: Timestamp | null;
};

export async function signUp({
  name,
  email,
  password,
}: SignUpParams): Promise<ActionResult> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = cred;
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        name,
        email,
        photoURL: user.photoURL ?? null,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    }

    return { success: true, message: "Account created" };
  } catch (err: unknown) {
    let message = "Failed to create account";
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/email-already-in-use":
          message = "Email already in use. Please sign in instead.";
          break;
        case "auth/invalid-email":
          message = "Enter a valid email address.";
          break;
        case "auth/weak-password":
          message = "Password is too weak. Use at least 8 characters.";
          break;
        case "permission-denied":
          message =
            "Missing or insufficient permissions to create your profile. Check Firestore rules.";
          break;
        default:
          message = err.message || message;
      }
    }
    return { success: false, message };
  }
}

export async function signIn({
  email,
  password,
}: SignInParams): Promise<ActionResult> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const { user } = cred;

    await setDoc(
      doc(db, "users", user.uid),
      { lastLoginAt: serverTimestamp() },
      { merge: true }
    );

    const idToken = await user.getIdToken();
    return { success: true, message: "Signed in", idToken };
  } catch (err: unknown) {
    let message = "Sign-in failed";
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/user-not-found":
          message = "No account found for this email. Please sign up.";
          break;
        case "auth/invalid-credential":
          message = "No account found for this email. Please sign up.";
          break;
        case "auth/wrong-password":
          message = "Incorrect email or password.";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Try again later.";
          break;
        case "auth/invalid-email":
          message = "Enter a valid email  address.";
          break;
        case "permission-denied":
          message =
            "Missing or insufficient permissions to update your profile. Check Firestore rules.";
          break;
        default:
          message = err.message || message;
      }
    }
    return { success: false, message };
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export async function isAuthenticated(): Promise<boolean> {
  const user = getCurrentUser();
  return !!user;
}

export const getIdToken = async () => {
  const user = auth.currentUser;
  if (user) return user.getIdToken();
  throw new Error("User not authenticated");
};
