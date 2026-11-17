
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Decision } from "../lib/schema";

interface DecisionState {
    decision: Decision | null;
    originalDecision: Decision | null;

    initializeDecision: (data: Decision) => void;
    setDecision: (data: Decision) => void;
    resetToOriginal: () => void;

    updateTitle: (title: string) => void;

    updateOptionName: (id: string, name: string) => void;
    addOption: () => void;
    removeOption: (id: string) => void;

    updateCriterionName: (id: string, name: string) => void;
    updateCriterionWeight: (id: string, weight: number) => void;
    addCriterion: () => void;
    removeCriterion: (id: string) => void;
    updateOptionRating: (
        optionId: string,
        criterionId: string,
        rating: number
    ) => void;
}

export const useDecisionStore = create<DecisionState>()(
    persist(
        (set, get) => ({
            decision: null,
            originalDecision: null,

            // Initialize decision from API
            initializeDecision: (data) => {
                if (get().decision !== null) return;

                set({
                    decision: structuredClone(data),
                    originalDecision: structuredClone(data),
                });
            },

            setDecision: (data) => {
                set({ decision: data });
            },

            // Reset to original API data
            resetToOriginal: () => {
                const original = get().originalDecision;

                if (!original) return;

                set({
                    decision: structuredClone(original),
                });
            },

            // Update decision title
            updateTitle: (title) =>
                set((state) => ({
                    decision: state.decision
                        ? { ...state.decision, title }
                        : null,
                })),

            // Update option name
            updateOptionName: (id, name) =>
                set((state) => ({
                    decision: state.decision
                        ? {
                            ...state.decision,
                            options: state.decision.options.map((option) =>
                                option.id === id
                                    ? { ...option, name }
                                    : option
                            ),
                        }
                        : null,
                })),

            // Add new option
            addOption: () =>
                set((state) => {
                    if (!state.decision) return state;

                    const ratings = Object.fromEntries(
                        state.decision.criteria.map((criterion) => [
                            criterion.id,
                            3,
                        ])
                    );

                    return {
                        decision: {
                            ...state.decision,
                            options: [
                                ...state.decision.options,
                                {
                                    id: crypto.randomUUID(),
                                    name: `Option ${state.decision.options.length + 1}`,
                                    ratings,
                                },
                            ],
                        },
                    };
                }),

            // Remove option (minimum 2)
            removeOption: (id) =>
                set((state) => {
                    if (
                        !state.decision ||
                        state.decision.options.length <= 2
                    ) {
                        return state;
                    }

                    return {
                        decision: {
                            ...state.decision,
                            options: state.decision.options.filter(
                                (option) => option.id !== id
                            ),
                        },
                    };
                }),

            // Update criterion name
            updateCriterionName: (id, name) =>
                set((state) => ({
                    decision: state.decision
                        ? {
                            ...state.decision,
                            criteria: state.decision.criteria.map(
                                (criterion) =>
                                    criterion.id === id
                                        ? { ...criterion, name }
                                        : criterion
                            ),
                        }
                        : null,
                })),

            // Update criterion weight
            updateCriterionWeight: (id, weight) =>
                set((state) => ({
                    decision: state.decision
                        ? {
                            ...state.decision,
                            criteria: state.decision.criteria.map(
                                (criterion) =>
                                    criterion.id === id
                                        ? { ...criterion, weight }
                                        : criterion
                            ),
                        }
                        : null,
                })),

            // Add criterion and initialize ratings
            addCriterion: () =>
                set((state) => {
                    if (!state.decision) return state;

                    const id = crypto.randomUUID();

                    return {
                        decision: {
                            ...state.decision,
                            criteria: [
                                ...state.decision.criteria,
                                {
                                    id,
                                    name: `Criterion ${state.decision.criteria.length + 1}`,
                                    weight: 3,
                                },
                            ],
                            options: state.decision.options.map((option) => ({
                                ...option,
                                ratings: {
                                    ...option.ratings,
                                    [id]: 3,
                                },
                            })),
                        },
                    };
                }),

            // Remove criterion and its ratings (minimum 1)
            removeCriterion: (id) =>
                set((state) => {
                    if (
                        !state.decision ||
                        state.decision.criteria.length <= 1
                    ) {
                        return state;
                    }

                    return {
                        decision: {
                            ...state.decision,
                            criteria: state.decision.criteria.filter(
                                (criterion) => criterion.id !== id
                            ),
                            options: state.decision.options.map((option) => {
                                const {
                                    [id]: removedRating,
                                    ...remainingRatings
                                } = option.ratings;

                                return {
                                    ...option,
                                    ratings: remainingRatings,
                                };
                            }),
                        },
                    };
                }),
            updateOptionRating: (optionId, criterionId, rating) =>
                set((state) => ({
                    decision: state.decision
                        ? {
                            ...state.decision,
                            options: state.decision.options.map((option) =>
                                option.id === optionId
                                    ? {
                                        ...option,
                                        ratings: {
                                            ...option.ratings,
                                            [criterionId]: rating,
                                        },
                                    }
                                    : option
                            ),
                        }
                        : null,
                })),
        }),
        {
            name: "venture-decision-storage",
        }
    )
);
