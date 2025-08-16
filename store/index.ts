"use client";

import { create } from "zustand";
import { createUserSlice, type UserSlice } from "./userSlice";

export type AppStore = UserSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createUserSlice(...a),
}));
