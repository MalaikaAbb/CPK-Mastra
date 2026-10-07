function ApprovalPanel() {
  const element = useInterrupt({
    renderInChat: false,
    render: ({ interrupt, resolve, cancel }) => (
      <div className="p-3 border rounded">
        <p>{interrupt?.message ?? "Approve this action?"}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => resolve({ approved: true })}>Approve</button>
          <button onClick={() => cancel()}>Cancel</button>
        </div>
      </div>
    ),
  });

  // `element` is null while no interrupt is active; render it wherever you like.
  return <div className="approval-panel">{element}</div>;
}
