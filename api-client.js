// ============================================
// DRESSVINTAGE — browser-side API client
// ============================================
// Thin wrapper around fetch() for the serverless functions in /api/.
// All methods return { ok: boolean, data?, error? } and never throw.
//
// In dev/preview without env vars configured, the API responds 500/404 —
// callers should treat that as "fall back to local mode" rather than failing
// the UX.

(function () {
  const API_BASE = ''; // same origin; replace if hosting API elsewhere

  async function safeFetch(path, opts) {
    const url = API_BASE + path;
    try {
      const res = await fetch(url, {
        ...opts,
        headers: {
          'Content-Type': 'application/json',
          ...(opts && opts.headers),
        },
      });
      let data = null;
      const text = await res.text();
      if (text) {
        try { data = JSON.parse(text); } catch { data = { _raw: text }; }
      }
      if (!res.ok) {
        return { ok: false, status: res.status, error: (data && data.error) || 'http_' + res.status, data };
      }
      return { ok: true, status: res.status, data };
    } catch (e) {
      return { ok: false, status: 0, error: 'network_error', _exception: e };
    }
  }

  const dvApi = {
    // ---- Newsletter ----
    async newsletterSubscribe({ email, consent, source }) {
      return safeFetch('/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email, consent, source }),
      });
    },

    // ---- Orders ----
    async createOrder(payload) {
      return safeFetch('/api/orders/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    /** Admin only. Pass the ADMIN_API_SECRET in `secret`. */
    async updateOrderStatus({ orderNumber, orderStatus, paymentStatus, trackingCode, note, changedBy, secret }) {
      return safeFetch('/api/orders/update-status', {
        method: 'POST',
        headers: { Authorization: `Bearer ${secret}` },
        body: JSON.stringify({
          order_number:   orderNumber,
          order_status:   orderStatus,
          payment_status: paymentStatus,
          tracking_code:  trackingCode,
          note,
          changed_by:     changedBy,
        }),
      });
    },

    /**
     * Tries to detect whether the API backend is configured.
     * We just check if /api/newsletter/subscribe returns something
     * other than 404. Cached for the session.
     */
    _apiAvailable: null,
    async isAvailable() {
      if (this._apiAvailable !== null) return this._apiAvailable;
      try {
        // Send an obviously invalid payload — we don't care about success,
        // only whether the endpoint exists.
        const r = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });
        this._apiAvailable = r.status !== 404;
      } catch {
        this._apiAvailable = false;
      }
      return this._apiAvailable;
    },
  };

  window.dvApi = dvApi;
})();
