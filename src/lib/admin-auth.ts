/** Re-exports — prefer importing from @/lib/auth */
export {
  getSession,
  getAdminSession,
  clearSession as clearAdminSession,
  setSession as setAdminSession,
  requireAdmin,
  COOKIE_NAME,
} from "@/lib/auth";
