<CopilotKitProvider
  runtimeUrl="/api/copilotkit"
  generativeUI={{
    ui: shopUI,
    errorBoundary: {
      onError: (info) => console.warn(info.kind, info.surfaceId, info.error.message),
      fallback: ({ retry }) => <button onClick={retry}>Try again</button>,
    },
  }}
>
