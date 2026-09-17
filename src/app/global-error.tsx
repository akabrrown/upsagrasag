"use client";

import { useLogger } from "next-axiom";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const log = useLogger();

  useEffect(() => {
    log.error("Global Error Caught", { error: error.message, digest: error.digest, stack: error.stack });
  }, [error, log]);

  return (
    <html>
      <body>
        <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1 style={{ color: "#E02424" }}>500 - Internal Server Error</h1>
          <p>We've encountered an unexpected error. Our team has been notified.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer", background: "#000", color: "#fff", border: "none", borderRadius: "5px" }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
