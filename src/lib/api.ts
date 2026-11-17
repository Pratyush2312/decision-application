import axios from "axios";
import { DecisionSchema } from "./schema";

const API_URL = import.meta.env.VITE_API_URL;

export const getDecision = async () => {
    const response = await axios.get(API_URL);
    const data: unknown = response.data;

    return DecisionSchema.parse(data);
};