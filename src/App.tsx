import { useEffect } from "react";
import { useDecision } from "./hooks/useDecision";
import { useDecisionStore } from "./store/decisionStore";

function App() {
  const { data, isLoading, isError, error, refetch } = useDecision();

  const decision = useDecisionStore((state) => state.decision);

  const initializeDecision = useDecisionStore(
    (state) => state.initializeDecision,
  );

  useEffect(() => {
    if (data) {
      initializeDecision(data);
    }
  }, [data, initializeDecision]);

  if (isLoading) {
    return <h1>Loading decision...</h1>;
  }

  if (isError) {
    return (
      <div>
        <h1>Something went wrong!</h1>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  if (!decision) return <p>Initializing decision...</p>;

  return (
    <main>
      <h1>{decision.title}</h1>

      <h2>Criteria</h2>

      {decision.criteria.map((criterion) => (
        <p key={criterion.id}>
          {criterion.name} - Weight: {criterion.weight}
        </p>
      ))}

      <h2>Options</h2>

      {decision.options.map((option) => (
        <div key={option.id}>
          <h3>{option.name}</h3>

          {Object.entries(option.ratings).map(([criterionId, rating]) => (
            <p key={criterionId}>
              {criterionId}: {rating}/5
            </p>
          ))}
        </div>
      ))}

      <button onClick={() => useDecisionStore.getState().resetToOriginal()}>
        Reset to Original
      </button>
    </main>
  );
}

export default App;
