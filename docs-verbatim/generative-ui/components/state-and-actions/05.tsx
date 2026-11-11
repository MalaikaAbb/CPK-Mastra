import { useState } from "react";
import type { GenerativeUIComponentProps } from "@copilotkit/react-core/v2/generative-ui";

function ProductCard({ productId, name, onAddToCart }: GenerativeUIComponentProps<typeof shopUI, "ProductCard">) {
  const [error, setError] = useState<string>();
  return (
    <article>
      <h4>{name}</h4>
      <button
        onClick={async () => {
          const result = await onAddToCart?.({ productId });
          if (result && !result.ok) setError(result.error.message);
        }}
      >
        Add to cart
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </article>
  );
}
