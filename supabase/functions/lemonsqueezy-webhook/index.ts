import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2"

// ─── Variant IDs — from Lemon Squeezy dashboard ───────────────────────────────
const MONTHLY_VARIANT_ID = "1746188"
const ANNUAL_VARIANT_ID  = "1746220"

// ─── CORS headers ─────────────────────────────────────────────────────────────
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Signature",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** ArrayBuffer → lowercase hex string */
function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

/** Constant-time string comparison — prevents timing attacks */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

/** Compute HMAC-SHA256 of a string body using a string secret, return hex */
async function computeHmac(secret: string, body: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body))
  return bufToHex(sig)
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  const resHeaders = { ...CORS_HEADERS, "Content-Type": "application/json" }

  try {
    // ── 1. Verify signature ──────────────────────────────────────────────────
    const signature = req.headers.get("X-Signature")
    const secret    = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET")

    if (!signature || !secret) {
      console.error("Missing X-Signature header or LEMONSQUEEZY_WEBHOOK_SECRET env var")
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: resHeaders })
    }

    // Read raw body first — needed for signature check and then JSON parsing
    const rawBody = await req.text()
    const expectedSig = await computeHmac(secret, rawBody)

    if (!safeCompare(signature, expectedSig)) {
      console.error("Webhook signature mismatch — request rejected")
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: resHeaders })
    }

    // ── 2. Parse payload ─────────────────────────────────────────────────────
    const payload           = JSON.parse(rawBody)
    const eventName: string = payload?.meta?.event_name ?? ""
    const userId: string    = payload?.meta?.custom_data?.user_id ?? ""
    const attributes        = payload?.data?.attributes ?? {}
    const variantId         = String(attributes.variant_id ?? "")
    const endsAt            = attributes.ends_at ?? null
    const subscriptionId    = String(payload?.data?.id ?? "")

    console.log(`Event: ${eventName} | User: ${userId} | Variant: ${variantId}`)

    // If there's no user_id we can't update anything — still return 200
    if (!userId) {
      console.warn("No user_id in webhook custom_data — skipping DB update")
      return new Response(JSON.stringify({ received: true }), { status: 200, headers: resHeaders })
    }

    // ── 3. Supabase admin client ─────────────────────────────────────────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // ── 4. Map variant ID → plan name ────────────────────────────────────────
    let plan: string | null = null
    if (variantId === MONTHLY_VARIANT_ID)     plan = "monthly"
    else if (variantId === ANNUAL_VARIANT_ID) plan = "annual"

    // ── 5. Event handlers ────────────────────────────────────────────────────
    switch (eventName) {

      case "subscription_created":
      case "subscription_updated": {
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status:  "active",
            subscription_plan:    plan,
            subscription_id:      subscriptionId,
            subscription_ends_at: endsAt,
          })
          .eq("id", userId)
        if (error) console.error(`DB update failed (${eventName}):`, error)
        break
      }

      case "subscription_cancelled": {
        // Cancelled but access continues until ends_at
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status:  "cancelled",
            subscription_plan:    plan,
            subscription_id:      subscriptionId,
            subscription_ends_at: endsAt,
          })
          .eq("id", userId)
        if (error) console.error("DB update failed (subscription_cancelled):", error)
        break
      }

      case "subscription_expired": {
        // Access fully revoked — reset to free tier
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status:  "free",
            subscription_plan:    null,
            subscription_id:      null,
            subscription_ends_at: null,
          })
          .eq("id", userId)
        if (error) console.error("DB update failed (subscription_expired):", error)
        break
      }

      case "subscription_payment_failed": {
        // Log only — Lemon Squeezy retries automatically and will eventually expire the sub
        console.log(`Payment failed for user ${userId}, subscription ${subscriptionId}`)
        break
      }

      default:
        console.log(`Unhandled event type: "${eventName}" — acknowledging without action`)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200, headers: resHeaders })

  } catch (err) {
    console.error("Unhandled error in webhook handler:", err)
    // Return 200 even on application errors so Lemon Squeezy doesn't retry indefinitely
    return new Response(JSON.stringify({ received: true }), { status: 200, headers: resHeaders })
  }
})