import { useQuery, useQueryClient } from "@tanstack/react-query";
import { accountHolderService } from "../utils/accountHolderService";
import { useEffect } from "react";
import { socket } from "@/utils/socket";

export const useAccountHolders = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        // Listen for backend events
        socket.on("accountHoldersUpdated", () => {
            queryClient.invalidateQueries({
                queryKey: ["accountHolders"],
            });
        });
        return () => {
            socket.off("accountHoldersUpdated");
        };
    }, [queryClient]);

    // ⬅️ MUST return this
    return useQuery({
        queryKey: ["accountHolders"],
        queryFn: accountHolderService.getAllAccountHolders,
    });
};
