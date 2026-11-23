import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      /** How Oyun speaks to them. Absent only if the account check could not
       *  run — lib/voice.ts reads that as the faith voice, as before. */
      voice?: "FAITH" | "GENERAL";
    } & DefaultSession["user"];
  }
}
