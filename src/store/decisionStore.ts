
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Decision } from "../lib/schema";

interface DecisionState {
    decision: Decision | null;
    originalDecision: Decision | null;

    initializeDecision: (data: Decision) => void;
    setDecision: (data: Decision) => void;
    resetToOriginal: () => void;
}

export const useDecisionStore = create<DecisionState>()(
    persist(
        (set, get) => ({
            decision: null,
            originalDecision: null,

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

            resetToOriginal: () => {
                const original = get().originalDecision;

                if (!original) return;

                set({
                    decision: structuredClone(original),
                });
            },
        }),
        {
            name: "venture-decision-storage",
        }
    )
);
