import { useQuery, useQueryClient } from "@tanstack/react-query";
import { accountHolderService } from "../utils/accountHolderService";
import { useEffect } from "react";
import { socket } from "@/utils/socket";
import type { AccountHolder, AccountHolderFilter, AccountHolderStats } from "types";


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
        placeholderData: (prev) => prev ?? { data: [], total: 0 },
        staleTime: 5000, // optional
    });
};

export const useAccountHolderStats = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleUpdate = () => {
            queryClient.invalidateQueries({ queryKey: ["accountHoldersStats"] });
        }
        socket.on("accountHoldersUpdated", handleUpdate)
        return () => {
            socket.off("accountHoldersUpdated", handleUpdate)
        }
    }, [queryClient]);

    return useQuery<AccountHolderStats>({
        queryKey: ["accountHoldersStats"],
        queryFn: accountHolderService.getAccountHolderStats,
    });
}


export const useAccountHolder = (id?: number) =>
    useQuery<AccountHolder>({
        queryKey: ["accountHolder", id],
        queryFn: () => accountHolderService.getAccountHolderById(id!),
        enabled: !!id,
    });
