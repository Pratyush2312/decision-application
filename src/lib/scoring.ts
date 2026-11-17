
import type { Decision } from "./schema";

export interface ScoredOption {
    id: string;
    name: string;
    score: number;
    rank: number;
    breakdown: {
        criterionId: string;
        criterionName: string;
        rating: number;
        weight: number;
        contribution: number;
    }[];
}

export const calculateScores = (
    decision: Decision
): ScoredOption[] => {
    const totalWeight = decision.criteria.reduce(
        (sum, criterion) => sum + criterion.weight,
        0
    );

    if (totalWeight === 0) return [];

    const results = decision.options.map((option) => {
        const breakdown = decision.criteria.map((criterion) => {
            const rating = option.ratings[criterion.id] ?? 0;

            return {
                criterionId: criterion.id,
                criterionName: criterion.name,
                rating,
                weight: criterion.weight,
                contribution: rating * criterion.weight,
            };
        });
        const weightedTotal = breakdown.reduce(
            (sum, item) => sum + item.contribution,
            0
        );

        const rawScore = (weightedTotal / (5 * totalWeight)) * 100;

        return {
            id: option.id,
            name: option.name,
            score: Number(rawScore.toFixed(2)),
            rank: 0,
            breakdown,
            weightedTotal,
        };
    });
    console.log(results);
    results.sort((a, b) => b.weightedTotal - a.weightedTotal);

    let currentRank = 1;

    results.forEach((option, index) => {
        if (
            index > 0 &&
            option.weightedTotal !== results[index - 1].weightedTotal
        ) {
            currentRank = index + 1;
        }

        option.rank = currentRank;
    });

    return results.map(({ weightedTotal, ...option }) => option);
};
