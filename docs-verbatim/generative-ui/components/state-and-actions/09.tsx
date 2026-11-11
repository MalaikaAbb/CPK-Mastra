function CheckoutForm({ email, setEmail }: GenerativeUIComponentProps<typeof shopUI, "CheckoutForm">) {
  return <input value={email ?? ""} onChange={(event) => setEmail(event.target.value)} />;
}
