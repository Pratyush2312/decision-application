import { useQuery } from "@tanstack/react-query";
import { getDecision } from "../lib/api";

export const useDecision = () => {
    return useQuery({
        queryKey: ['decision'],
        queryFn: getDecision,
    })
}