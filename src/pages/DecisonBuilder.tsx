import { Link } from "react-router";
import { useDecisionStore } from "../store/decisionStore";
import { Plus, Trash2, RotateCcw, ArrowRight } from "lucide-react";

const DecisionBuilder = () => {
  const decision = useDecisionStore((state) => state.decision);
  const updateTitle = useDecisionStore((state) => state.updateTitle);
  const updateOptionName = useDecisionStore((state) => state.updateOptionName);
  const addOption = useDecisionStore((state) => state.addOption);
  const removeOption = useDecisionStore((state) => state.removeOption);
  const resetToOriginal = useDecisionStore((state) => state.resetToOriginal);

  const updateCriterionName = useDecisionStore(
    (state) => state.updateCriterionName,
  );
  const updateCriterionWeight = useDecisionStore(
    (state) => state.updateCriterionWeight,
  );
  const addCriterion = useDecisionStore((state) => state.addCriterion);
  const removeCriterion = useDecisionStore((state) => state.removeCriterion);
  const updateOptionRating = useDecisionStore(
    (state) => state.updateOptionRating,
  );

  if (!decision) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F8F6] px-6">
        <p className="text-sm text-gray-500">No decision data available.</p>
      </main>
    );
  }

  const hasDuplicateNames = (names: string[]) => {
    const normalized = names.map((name) => name.trim().toLowerCase());
    return new Set(normalized).size !== normalized.length;
  };

  const duplicateOptions = hasDuplicateNames(
    decision.options.map((option) => option.name),
  );

  const duplicateCriteria = hasDuplicateNames(
    decision.criteria.map((criterion) => criterion.name),
  );

  const isValid =
    decision.title.trim().length >= 3 &&
    decision.options.length >= 2 &&
    decision.criteria.length >= 1 &&
    decision.options.every((option) => option.name.trim().length > 0) &&
    decision.criteria.every((criterion) => criterion.name.trim().length > 0) &&
    !duplicateOptions &&
    !duplicateCriteria;

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#252525]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
              Decision workspace
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Build your decision
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Define your options and the criteria that matter.
            </p>
          </div>

          <button
            type="button"
            onClick={resetToOriginal}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 sm:self-auto">
            <RotateCcw size={15} />
            Reset to original
          </button>
        </header>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            01 / Decision
          </p>

          <h2 className="mt-2 text-lg font-semibold">What are you deciding?</h2>

          <label
            htmlFor="decision-title"
            className="mb-2 mt-5 block text-sm font-medium text-gray-600">
            Decision title
          </label>

          <input
            id="decision-title"
            value={decision.title}
            onChange={(e) => updateTitle(e.target.value)}
            placeholder="Give your decision a title"
            className="w-full border-b border-gray-200 bg-transparent py-3 text-lg font-medium outline-none transition placeholder:font-normal placeholder:text-gray-300 focus:border-black"
          />

          {decision.title.trim().length < 3 && (
            <p className="mt-2 text-xs text-red-500">
              Title must contain at least 3 characters.
            </p>
          )}
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                02 / Alternatives
              </p>

              <h2 className="mt-2 text-lg font-semibold">Your options</h2>

              <p className="mt-1 text-sm text-gray-500">
                Add the alternatives you want to compare.
              </p>
            </div>

            <span className="shrink-0 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
              {decision.options.length} options
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {decision.options.map((option, index) => (
              <div
                key={option.id}
                className="flex items-center gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <input
                    value={option.name}
                    onChange={(e) =>
                      updateOptionName(option.id, e.target.value)
                    }
                    aria-label={`Option ${index + 1} name`}
                    placeholder="Enter option name"
                    className="w-full bg-transparent py-2 text-sm font-medium outline-none placeholder:font-normal placeholder:text-gray-300 focus:text-black"
                  />

                  {!option.name.trim() && (
                    <p className="text-xs text-red-500">
                      Option name is required.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  disabled={decision.options.length <= 2}
                  aria-label={`Remove ${option.name}`}
                  className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {duplicateOptions && (
              <p className="mt-3 text-xs text-red-500">
                Option names must be unique.
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={addOption}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-black hover:bg-black/5 hover:text-black">
              <Plus size={16} />
              Add another option
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                03 / Evaluation
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Evaluation criteria
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Decide what matters and assign its importance.
              </p>
            </div>

            <span className="self-start rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
              {decision.criteria.length} criteria
            </span>
          </div>

          <div className="mb-6 rounded-lg bg-[#F8F8F6] p-4">
            <p className="text-sm font-medium text-gray-700">
              How do weights work?
            </p>

            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              1 means less important and 5 means extremely important. Higher
              weights have a greater influence on the final score.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {decision.criteria.map((criterion, index) => (
              <div
                key={criterion.id}
                className="flex flex-col gap-4 py-5 first:pt-0 sm:flex-row sm:items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`criterion-${criterion.id}`}
                    className="mb-1 block text-xs font-medium text-gray-500">
                    Criterion name
                  </label>

                  <input
                    id={`criterion-${criterion.id}`}
                    value={criterion.name}
                    onChange={(e) =>
                      updateCriterionName(criterion.id, e.target.value)
                    }
                    placeholder="Enter criterion name"
                    className="w-full border-b border-gray-200 bg-transparent py-2 text-sm font-medium outline-none transition placeholder:font-normal placeholder:text-gray-300 focus:border-black"
                  />

                  {!criterion.name.trim() && (
                    <p className="mt-1 text-xs text-red-500">
                      Criterion name is required.
                    </p>
                  )}
                </div>

                <div className="sm:w-52">
                  <p className="mb-2 text-xs font-medium text-gray-500">
                    Importance · {criterion.weight}/5
                  </p>

                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((weight) => (
                      <button
                        key={weight}
                        type="button"
                        onClick={() =>
                          updateCriterionWeight(criterion.id, weight)
                        }
                        aria-label={`Set importance to ${weight}`}
                        aria-pressed={criterion.weight === weight}
                        className={`h-9 flex-1 rounded-md border text-sm font-medium transition ${
                          criterion.weight === weight
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
                        }`}>
                        {weight}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeCriterion(criterion.id)}
                  disabled={decision.criteria.length <= 1}
                  aria-label={`Remove ${criterion.name}`}
                  title={
                    decision.criteria.length <= 1
                      ? "At least one criterion is required"
                      : "Remove criterion"
                  }
                  className="self-end rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30 sm:self-center">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {duplicateCriteria && (
              <p className="mt-3 text-xs text-red-500">
                Criterion names must be unique.
              </p>
            )}
          </div>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={addCriterion}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-black hover:bg-black/5 hover:text-black">
              <Plus size={16} />
              Add criterion
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              04 / Scoring
            </p>

            <h2 className="mt-2 text-lg font-semibold">Rate your options</h2>

            <p className="mt-1 text-sm text-gray-500">
              Evaluate each option against your criteria using a scale of 1–5.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
            <span>
              <strong className="text-gray-800">1</strong> Poor
            </span>
            <span>
              <strong className="text-gray-800">2</strong> Below average
            </span>
            <span>
              <strong className="text-gray-800">3</strong> Average
            </span>
            <span>
              <strong className="text-gray-800">4</strong> Good
            </span>
            <span>
              <strong className="text-gray-800">5</strong> Excellent
            </span>
          </div>

          <div className="space-y-6">
            {decision.options.map((option, optionIndex) => (
              <div
                key={option.id}
                className="overflow-hidden rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <span className="text-xs font-semibold text-gray-400">
                    {String(optionIndex + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-sm font-semibold text-gray-800">
                    {option.name || `Option ${optionIndex + 1}`}
                  </h3>
                </div>

                <div className="divide-y divide-gray-100 px-4">
                  {decision.criteria.map((criterion) => (
                    <div
                      key={criterion.id}
                      className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">
                          {criterion.name || "Untitled criterion"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Weight: {criterion.weight}/5
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-1.5">
                        {[1, 2, 3, 4, 5].map((rating) => {
                          const selected =
                            option.ratings[criterion.id] === rating;

                          return (
                            <button
                              key={rating}
                              type="button"
                              onClick={() =>
                                updateOptionRating(
                                  option.id,
                                  criterion.id,
                                  rating,
                                )
                              }
                              aria-label={`Rate ${option.name} on ${criterion.name}: ${rating}`}
                              aria-pressed={selected}
                              className={`h-9 w-9 rounded-md border text-sm font-medium transition ${
                                selected
                                  ? "border-black bg-black text-white"
                                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
                              }`}>
                              {rating}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Ready to see how your options compare?
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Your changes are saved locally as you work.
            </p>
          </div>

          <Link
            to="/results"
            aria-disabled={!isValid}
            onClick={(e) => {
              if (!isValid) e.preventDefault();
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition ${
              isValid
                ? "bg-black text-white hover:bg-[#262626]"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}>
            View results
            <ArrowRight size={16} />
          </Link>
        </footer>
      </div>
    </main>
  );
};

export default DecisionBuilder;
