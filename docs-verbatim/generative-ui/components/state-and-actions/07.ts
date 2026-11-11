events: {
  onChoose: {
    description: "The user picked a plan",
    parameters: z.object({ plan: z.string() }),
  },
},
