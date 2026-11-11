functions: {
  addToCart: { parameters: z.object({ productId: z.string() }), allowedCallers: "rendererOrAgent", returnType: "object" },
  track: { parameters: z.object({ event: z.string() }), returnType: "void" },
  reload: { parameters: z.object({}), allowedCallers: "agentOnly" },
},
