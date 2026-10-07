useInterrupt({
  agentId: "gen-ui-interrupt",
  handler: async ({ event, resolve }) => {
    const dept = await lookupUserDepartment();
    if (event.value.accessDepartment === dept || dept === "admin") {
      resolve({ code: "AUTH_BY_DEPARTMENT" });
      return; // agent will resume; card unmounts when the run starts
    }
    return { dept };
  },
  render: ({ result, event, resolve }) => (
    <RequestAccessCard
      dept={result?.dept}
      onRequest={() => resolve({ code: "REQUEST_AUTH" })}
      onCancel={() => resolve({ code: "CANCEL" })}
    />
  ),
});
