import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowLeft, Trophy, TrendingUp } from "lucide-react";

import { useDecisionStore } from "../store/decisionStore";
import { calculateScores } from "../lib/scoring";

const Results = () => {
  const decision = useDecisionStore((state) => state.decision);

  const results = useMemo(
    () => (decision ? calculateScores(decision) : []),
    [decision],
  );

  if (!decision) {
    return (
      <main className="min-h-screen bg-[#F8F8F6] px-6 py-20 text-center">
        <h1 className="text-xl font-semibold text-gray-800">
          No decision available
        </h1>

        <Link
          to="/"
          className="mt-4 inline-block text-sm text-[#5556A8] hover:underline">
          Return to Builder
        </Link>
      </main>
    );
  }

  const winner = results[0];

  const tiedWinners = results.filter(
    (option) => option.score === winner?.score,
  );

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#252525]">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        {/* Header */}
        <header className="mb-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900">
            <ArrowLeft size={16} />
            Back to Builder
          </Link>

          <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
            Decision analysis
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {decision.title}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your results, calculated using weighted criteria.
          </p>
        </header>

        {/* Winner */}
        {winner && (
          <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-medium text-[#5556A8]">
              <Trophy size={17} />
              {tiedWinners.length > 1
                ? "Top-ranked options"
                : "Top-ranked option"}
            </div>

            {tiedWinners.map((option) => (
              <div
                key={option.id}
                className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {option.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {tiedWinners.length > 1
                      ? "Joint highest weighted score"
                      : "Highest weighted score"}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-4xl font-semibold tabular-nums">
                    {option.score.toFixed(2)}
                    <span className="text-xl text-gray-400">%</span>
                  </p>

                  <p className="mt-1 text-xs text-gray-400">Weighted score</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Ranking */}
        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="mb-7">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              01 / Overview
            </p>

            <h2 className="mt-2 text-lg font-semibold">Overall ranking</h2>

            <p className="mt-1 text-sm text-gray-500">
              Options ranked by their weighted scores.
            </p>
          </div>

          <div className="space-y-6">
            {results.map((option) => (
              <div key={option.id}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400">
                      #{option.rank}
                    </span>

                    <span className="text-sm font-medium text-gray-800">
                      {option.name}
                    </span>
                  </div>

                  <span className="text-sm font-semibold tabular-nums">
                    {option.score.toFixed(2)}%
                  </span>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-gray-100"
                  role="progressbar"
                  aria-label={`${option.name} score`}
                  aria-valuenow={option.score}
                  aria-valuemin={0}
                  aria-valuemax={100}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      option.rank === 1 ? "bg-black" : "bg-gray-400"
                    }`}
                    style={{ width: `${option.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Criteria breakdown */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              02 / Analysis
            </p>

            <h2 className="mt-2 text-lg font-semibold">Criteria breakdown</h2>

            <p className="mt-1 text-sm text-gray-500">
              See how each option performed against individual criteria.
            </p>
          </div>

          <div className="space-y-6">
            {results.map((option) => (
              <div
                key={option.id}
                className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">{option.name}</h3>

                  <span className="text-xs text-gray-400">
                    Rank #{option.rank}
                  </span>
                </div>

                <div className="space-y-4">
                  {option.breakdown.map((item) => (
                    <div key={item.criterionId}>
                      <div className="mb-1.5 flex justify-between gap-3">
                        <span className="text-xs text-gray-600">
                          {item.criterionName}
                        </span>

                        <span className="text-xs font-medium text-gray-700">
                          {item.rating}/5
                          <span className="ml-2 text-gray-400">
                            Weight {item.weight}
                          </span>
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{
                            width: `${(item.rating / 5) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-gray-400">
            Results update automatically as your decision changes.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-black hover:underline">
            <TrendingUp size={15} />
            Edit decision
          </Link>
        </footer>
      </div>
    </main>
  );
};

export default Results;
