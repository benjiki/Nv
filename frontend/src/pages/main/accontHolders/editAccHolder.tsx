import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { accountHolderService } from "@/utils/accountHolderService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useAccountHolder } from "@/hooks/useAccountHolder";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useEffect } from "react";

const schema = z.object({
  name: z.string(),
  accountNumber: z.string().trim(),
});

type FormData = z.infer<typeof schema>;

const EditAccHolder = () => {
  const { id } = useParams();
  const accountId = Number(id);

  const { data, isLoading } = useAccountHolder(accountId);
  console.log("FORM RESET DATA:", data);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      accountNumber: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        accountNumber: data.accountNumber,
      });
    }
  }, [data, form]);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (values: FormData) =>
      accountHolderService.updateAccountHolder(accountId, values),

    onSuccess: (res) => {
      toast.success(res.message || "Account updated");

      queryClient.invalidateQueries({ queryKey: ["accountHolders"] });
      navigate("/accountholders");
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full h-screen">
      <div className="w-full flex justify-center mt-20">
        <div className="w-full lg:w-1/3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="account holders name"
                        {...field}
                        autoComplete="off"
                        autoCorrect="false"
                        className=""
                      />
                    </FormControl>
                    <FormDescription>
                      Account Holder name is required
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* account Number */}
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Account Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="account holders accNumber"
                        {...field}
                        autoComplete="off"
                        autoCorrect="false"
                        className=""
                      />
                    </FormControl>
                    <FormDescription>
                      Account Holder Acc Number is required
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {mutation.isPending ? "Updating…" : "Update"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditAccHolder;
