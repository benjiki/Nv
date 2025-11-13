import { useQuery } from "@tanstack/react-query";
import { accountHolderService } from "../utils/accountHolderService";
export const useAccountHolders = () =>
    useQuery({
        queryKey: ["accountHolders"],
        queryFn: accountHolderService.getAllAccountHolders,
    });