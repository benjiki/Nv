import { accountMangementService } from "@/utils/accountManagmentService";
import { socket } from "@/utils/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react";
import type { AccountManagementFilter } from "types";


export const useAccountManager = (filters?: AccountManagementFilter) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleUpdate = () => {
            queryClient.invalidateQueries({ queryKey: ["accountTransactions", filters] })
        }
        socket.on("accountTransactionUpdated", handleUpdate);

        return () => {
            socket.off("accountTransactionUpdated", handleUpdate)
        }
    }, [queryClient, filters])

    return useQuery({
        queryKey: ["accountTransactions", filters],
        queryFn: () => accountMangementService.getAllAccountTransactions(filters),
        placeholderData: (prev) => prev ?? { data: [], total: 0 },
        staleTime: 5000
    })
};


export const useLoanRepayment = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleUpdate = () => {
            queryClient.invalidateQueries({ queryKey: ["accountTransactions"] });
        };
        socket.on("accountTransactionUpdated", handleUpdate);

        return () => {
            socket.off("accountTransactionUpdated", handleUpdate);
        };
    }, [queryClient]);

    return useQuery({
        queryKey: ["accountTransactions"],
        queryFn: () => accountMangementService.getRepaymentLoans(),
    });
};