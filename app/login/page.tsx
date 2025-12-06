'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function login() {
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    router.push("/dashboard");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>
      <input
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={login}>Continue</button>
    </div>
  );
}
