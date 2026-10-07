function HeadlessInterruptPanelRaw() {
  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({ agentId: "interrupt-headless" });
  const { pending, resolve } = useHeadlessInterrupt("interrupt-headless");

  const kickOff = (prompt: string) => {
    agent.addMessage({ id: crypto.randomUUID(), role: "user", content: prompt });
    void copilotkit.runAgent({ agent });
  };

  if (pending) {
    return (
      <div>
        <p>Pick a slot for {pending.value.topic ?? "a call"}:</p>
        {SLOTS.map((s) => (
          <button key={s.iso} onClick={() => resolve({ chosen_time: s.iso, chosen_label: s.label })}>
            {s.label}
          </button>
        ))}
        <button onClick={() => resolve({ cancelled: true })}>Cancel</button>
      </div>
    );
  }

  return <button onClick={() => kickOff("Book a call with sales.")}>Book call</button>;
}
