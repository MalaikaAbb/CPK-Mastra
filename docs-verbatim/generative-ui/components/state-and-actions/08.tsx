CheckoutForm: {
  component: CheckoutForm,
  props: z.object({ email: z.string().optional() }),
  writable: ["email"],
},
