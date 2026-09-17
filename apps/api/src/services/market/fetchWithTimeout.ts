/** A hung provider request must never hang the app — an 8s timeout counts
 * as a failure like any other, so the caller falls back to the cache. */
export async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) {
      throw new Error(`${url} responded ${res.status}`)
    }
    return res
  } finally {
    clearTimeout(timer)
  }
}
