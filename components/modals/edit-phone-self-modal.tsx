"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";
import { toast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Subteams } from "@prisma/client";

const formSchema = z.object({
  phoneNumber: z.string().optional(),
  mainSubteam: z.string().optional(),
});

export const EditPhoneSelfModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "editProfileSelf";
  let { profile } = data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      mainSubteam: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.setValue("phoneNumber", profile?.phoneNumber);
    }
  }, [form, profile]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      (async () => {
        console.log(profile?.id);
        const rawResponse = await fetch(`/api/profiles/${profile?.id}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: values.phoneNumber,
            mainSubteam: values.mainSubteam,
            isSelf: true,
          }),
        });
        const content = await rawResponse.json();
        console.log(content); // TODO: DO SOMETHING ELSE WITH IT
        router.refresh();
      })();

      form.reset();
      router.refresh();
      toast({
        title: "Phone Number Updated",
        description: "Your phone number has been updated.",
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const subteams = [
    {
      id: Subteams.Programming,
      label: "Programming",
    },
    {
      id: Subteams.Cad,
      label: "Cad",
    },
    {
      id: Subteams.Mechanical,
      label: "Mechanical",
    },
    {
      id: Subteams.BusinessOutreachMedia,
      label: "Business & Outreach",
    },
    {
      id: Subteams.Pit,
      label: "Pit",
    },
    {
      id: Subteams.Strategy,
      label: "Strategy",
    },
  ] as const;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Phone Number
          </DialogTitle>
          <DialogDescription>
            If you wish to change your name or avatar image, click on the
            profile instead of this button.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2 px-6">
              <FormField
                control={form.control}
                name="mainSubteam"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-0 place-items-center">
                    <FormLabel className="">Main Subteam</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="bg-muted rounded-2xl w-36 p-3">
                          <SelectValue placeholder="Select Subteam" />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectGroup>
                            <SelectLabel>Main Subteam</SelectLabel>
                            {subteams.map((subteam) => (
                              <SelectItem
                                className="lowercase"
                                key={subteam.id}
                                value={subteam.id}
                              >
                                {subteam.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-0 place-items-center">
                    <FormLabel className="uppercase text-xs font-bold">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 w-30 text-center hover:bg-muted-foreground focus-visible:ring-2"
                        placeholder="Enter Phone Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="grid grid-cols-1 px-6 py-0">
              <Button variant="default" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
