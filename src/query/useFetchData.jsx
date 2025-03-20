import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

const useFetchData = (endpoint, params = {}) => {
    return useQuery({
        queryKey: [endpoint, params],
        queryFn: async () => {
            const queryString = new URLSearchParams(params).toString()
            const response = await api.get(`${endpoint}?${queryString}`)
            return response.data
        },
        staleTime: 30000
    })
}

export default useFetchData;