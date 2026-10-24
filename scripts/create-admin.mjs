import { pbkdf2Sync, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required in the process environment`);
  return value;
};

const url = required("SUPABASE_URL");
const serviceKey = required("SUPABASE_SERVICE_ROLE_KEY");
const email = required("ADMIN_EMAIL").toLowerCase();
const password = required("ADMIN_PASSWORD");
const name = required("ADMIN_NAME");
const mobile = required("ADMIN_MOBILE").replace(/\D/g, "");

if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("ADMIN_EMAIL must be valid");
if (password.length < 6 || Buffer.byteLength(password) > 1024) throw new Error("ADMIN_PASSWORD must be 6-1024 bytes");
if (!name || name.length > 120 || !/^01[3-9]\d{8}$/.test(mobile)) {
  throw new Error("Provide ADMIN_NAME and an 11-digit Bangladesh ADMIN_MOBILE");
}

const salt = randomBytes(16);
const derived = pbkdf2Sync(password, salt, 310_000, 32, "sha256");
const passwordHash = `pbkdf2_sha256$310000$${salt.toString("hex")}$${derived.toString("hex")}`;
const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { error } = await supabase.from("users").insert({
  id: `usr_${randomBytes(16).toString("hex")}`,
  email,
  password_hash: passwordHash,
  name,
  mobile,
  role: "ADMIN",
  education_type: null,
  batch_or_target: "Admin Portal",
  status: "active",
  admin_eligible: true,
  profile: {},
});
if (error?.code === "23505") throw new Error("An account with this email or mobile already exists");
if (error) throw error;
console.log(`Created admin account: ${email}`);
