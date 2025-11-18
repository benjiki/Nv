import { useQuery, useQueryClient } from "@tanstack/react-query";
import { accountHolderService } from "../utils/accountHolderService";
import { useEffect } from "react";
import { socket } from "@/utils/socket";
import type { AccountHolderFilter } from "types";

export const useAccountHolders = (filters?: AccountHolderFilter) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleUpdate = () => {
            queryClient.invalidateQueries({ queryKey: ["accountHolders", filters] });
        };

        socket.on("accountHoldersUpdated", handleUpdate);

        return () => {
            socket.off("accountHoldersUpdated", handleUpdate);
        };
    }, [queryClient, filters]);

    return useQuery({
        queryKey: ["accountHolders", filters],
        queryFn: () => accountHolderService.getAllAccountHolders(filters),
        placeholderData: (prevData) => prevData, // ← retains previous data while loading
        staleTime: 5000, // optional
    });
};
