"use client";

import { StateCreator } from "zustand";
import { auth } from "@/firebase/firebaseClient";
import { onIdTokenChanged, signOut as fbSignOut } from "firebase/auth";
import { db } from "@/firebase/firebaseClient";
import { doc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { signIn, signUp } from "@/lib/actions/auth.action";

export type UserStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

export type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt?: unknown;
  lastLoginAt?: unknown;
};

export type UserSlice = {
  status: UserStatus;
  initialized: boolean;
  idToken: string | null;
  user: UserProfile | null;

  init: () => void;
  signUpWithEmail: (args: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ ok: boolean; message?: string }>;
  signInWithEmail: (args: {
    email: string;
    password: string;
  }) => Promise<{ ok: boolean; idToken?: string; message?: string }>;
  signOut: () => Promise<void>;
  refreshIdToken: () => Promise<string | null>;
};

let unsubscribeUserDoc: Unsubscribe | null = null;

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set,
  get
) => ({
  status: "idle",
  initialized: false,
  idToken: null,
  user: null,

  init: () => {
    if (get().initialized) return;
    set({ initialized: true, status: "loading" });

    onIdTokenChanged(auth, async (fbUser) => {
      // cleanup old doc sub
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      if (!fbUser) {
        set({ user: null, idToken: null, status: "unauthenticated" });
        return;
      }

      const token = await fbUser.getIdToken();
      set({ idToken: token, status: "authenticated" });

      // subscribe to Firestore user profile
      const ref = doc(db, "users", fbUser.uid);
      unsubscribeUserDoc = onSnapshot(ref, (snap) => {
        const data = snap.data() as Omit<UserProfile, "id"> | undefined;
        set({
          user: {
            id: fbUser.uid,
            name: data?.name ?? fbUser.displayName ?? null,
            email: data?.email ?? fbUser.email ?? null,
            photoURL: data?.photoURL ?? fbUser.photoURL ?? null,
            createdAt: data?.createdAt,
            lastLoginAt: data?.lastLoginAt,
          },
        });
      });
    });
  },

  signUpWithEmail: async ({ name, email, password }) => {
    try {
      set({ status: "loading" });
      const res = await signUp({ name, email, password });
      if (!res.success) {
        set({ status: "unauthenticated" });
        return {
          ok: false,
          message: res.message || "Failed to create account",
        };
      }
      // auth change listener will populate user/idToken
      set({ status: "authenticated" });
      return { ok: true };
    } catch {
      set({ status: "unauthenticated" });
      return { ok: false, message: "Sign-up error" };
    }
  },

  signInWithEmail: async ({ email, password }) => {
    try {
      set({ status: "loading" });
      const res = await signIn({ email, password });
      if (!res.success) {
        set({ status: "unauthenticated" });
        return { ok: false, message: res.message || "Sign-in failed" };
      }
      set({ status: "authenticated" });
      return { ok: true, idToken: res.idToken };
    } catch {
      set({ status: "unauthenticated" });
      return { ok: false, message: "Sign-in error" };
    }
  },

  signOut: async () => {
    if (unsubscribeUserDoc) {
      unsubscribeUserDoc();
      unsubscribeUserDoc = null;
    }
    await fbSignOut(auth);
    set({ user: null, idToken: null, status: "unauthenticated" });
  },

  refreshIdToken: async () => {
    const u = auth.currentUser;
    if (!u) return null;
    const token = await u.getIdToken(true);
    set({ idToken: token });
    return token;
  },
});
