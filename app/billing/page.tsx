"use client";

export default function BillingPage() {
  async function upgrade() {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
    });
    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Upgrade to Pro</h1>
      <p>
        Unlock unlimited courses, exports (PDF/DOCX),
        ministry mode, and certificates.
      </p>
      <button onClick={upgrade}>
        Upgrade Now
      </button>
    </div>
  );
}
