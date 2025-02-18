import React from "react";

function ErrorMessage({ message } :any) {
  return (
    <p
      className="mt-1 text-xs text-destructive"
      role="alert"
      aria-live="polite"
    >
      {message}
    </p>
  );
}

export default ErrorMessage;
