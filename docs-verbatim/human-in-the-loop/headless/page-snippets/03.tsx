function HeadlessInterruptPanel() {
  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({ agentId: "interrupt-headless" });

  const kickOff = (prompt: string) => {
    agent.addMessage({ id: crypto.randomUUID(), role: "user", content: prompt });
    void copilotkit.runAgent({ agent });
  };

  const interruptElement = useInterrupt({
    renderInChat: false,
    render: ({ interrupt, resolve, cancel }) => (
      <div>
        <p>Pick a slot for {interrupt?.message ?? "a call"}:</p>
        {SLOTS.map((s) => (
          <button key={s.iso} onClick={() => resolve({ chosen_time: s.iso, chosen_label: s.label })}>
            {s.label}
          </button>
        ))}
        <button onClick={() => cancel()}>Cancel</button>
      </div>
    ),
  });

  if (interruptElement) {
    return interruptElement;
  }

  return <button onClick={() => kickOff("Book a call with sales.")}>Book call</button>;
}
