import { createHash, randomBytes, pbkdf2Sync, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export const SESSION_COOKIE = "ja_session";
const SESSION_HOURS = 12;
const PASSWORD_ITERATIONS = 310_000;

type UserRow = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password_hash: string;
  role: "STUDENT" | "ADMIN";
  education_type: string | null;
  batch_or_target: string | null;
  status: string;
  admin_eligible: boolean;
  profile: Record<string, unknown> | null;
  joined_at: string;
  last_login_at: string | null;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "STUDENT" | "ADMIN";
  adminEligible: boolean;
  educationType: string | null;
  batchOrTarget: string | null;
  status: string;
  joinedAt: string;
  lastLoginAt: string | null;
  avatar: string;
  streak: number;
  enrolledCourses: string[];
  completedLessons: string[];
  unlockedProducts: string[];
};

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeMobile(value: string): string {
  const digits = [...value].map((character) => {
    const code = character.codePointAt(0) ?? 0;
    if (code >= 0x09e6 && code <= 0x09ef) return String(code - 0x09e6);
    if (code >= 0x0660 && code <= 0x0669) return String(code - 0x0660);
    return character;
  }).join("").replace(/\D/g, "");
  if (digits.startsWith("00880") && digits.length === 15) return `0${digits.slice(5)}`;
  if (digits.startsWith("880") && digits.length === 13) return `0${digits.slice(3)}`;
  if (digits.length === 10 && digits.startsWith("1")) return `0${digits}`;
  return digits || value.trim();
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, 32, "sha256");
  return `pbkdf2_sha256$${PASSWORD_ITERATIONS}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  try {
    const parts = encoded.split("$");
    if (parts.length !== 4) return false;
    const [algorithm, iterationText, saltHex, digestHex] = parts;
    const iterations = Number(iterationText);
    if (
      algorithm !== "pbkdf2_sha256" ||
      !Number.isSafeInteger(iterations) ||
      iterations < 1 ||
      iterations > 2_000_000 ||
      !/^[\da-f]{32}$/i.test(saltHex) ||
      !/^[\da-f]{64}$/i.test(digestHex)
    ) return false;
    const expected = Buffer.from(digestHex, "hex");
    const actual = pbkdf2Sync(password, Buffer.from(saltHex, "hex"), iterations, expected.length, "sha256");
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function publicUser(row: UserRow): PublicUser {
  const profile = row.profile ?? {};
  const list = (key: string): string[] => {
    const value = profile[key];
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  };
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    mobile: row.mobile,
    role: row.role,
    adminEligible: row.admin_eligible,
    educationType: row.education_type,
    batchOrTarget: row.batch_or_target,
    status: row.status,
    joinedAt: row.joined_at,
    lastLoginAt: row.last_login_at,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(row.id)}`,
    streak: 0,
    enrolledCourses: list("enrolledCourses"),
    completedLessons: list("completedLessons"),
    unlockedProducts: list("unlockedProducts"),
  };
}

export async function getCurrentUser(request: NextRequest): Promise<PublicUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("user_id")
    .eq("token_hash", digest(token))
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (sessionError) throw sessionError;
  if (!session) return null;
  const { data: row, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user_id)
    .eq("status", "active")
    .maybeSingle();
  if (error) throw error;
  return row ? publicUser(row as UserRow) : null;
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000).toISOString();
  const { error } = await supabase.from("sessions").insert({
    user_id: userId,
    token_hash: digest(token),
    expires_at: expiresAt,
  });
  if (error) throw error;
  return token;
}

export async function revokeSession(token: string | undefined): Promise<void> {
  if (!token) return;
  const { error } = await supabase.from("sessions").delete().eq("token_hash", digest(token));
  if (error) throw error;
}

export async function findUserByIdentifier(identifier: string): Promise<UserRow | null> {
  const value = identifier.trim();
  const isEmail = value.includes("@");
  let query = supabase.from("users").select("*");
  if (isEmail) {
    query = query.eq("email", value.toLowerCase());
  } else {
    const normalized = normalizeMobile(value);
    const candidates = new Set([normalized, value.replace(/[ \-+()]/g, "")]);
    if (normalized.startsWith("0") && normalized.length === 11) {
      candidates.add(`880${normalized.slice(1)}`);
      candidates.add(`00880${normalized.slice(1)}`);
    }
    query = query.in("mobile", [...candidates]);
  }
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data as UserRow | null;
}