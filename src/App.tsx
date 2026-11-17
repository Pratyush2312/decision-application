import { useEffect } from "react";
import { Outlet } from "react-router";

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

  if (!decision) {
    return <p>Initializing decision...</p>;
  }

  return <Outlet />;
}

export default App;
