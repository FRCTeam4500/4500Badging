"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
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
import { UserBadgeGrid } from "../badges/badge-grid";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "../ui/select";
import { SelectGroup, SelectTrigger } from "@radix-ui/react-select";
import { Subteams } from "@prisma/client";
import { toast } from "../ui/use-toast";

const formSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  level: z.number().optional(),
  subteam: z.string().optional(),
});

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

export const EditBadgeModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const { badge } = data;
  const isModalOpen = isOpen && type === "editBadge";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      level: 0,
      subteam: Subteams.Programming,
    },
  });

  useEffect(() => {
    form.setValue("name", badge?.name);
    form.setValue("description", badge?.description);
    form.setValue("imageUrl", badge?.imageUrl);
    form.setValue("level", badge?.level);
    form.setValue("subteam", badge?.subteamType);
  }, [form, badge]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      (async () => {
        const rawResponse = await fetch(`/api/badges/${badge?.id}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            level: values.level,
            description: values.description,
            imageUrl: values.imageUrl,
            subteamType: values.subteam,
          }),
        });
        const content = await rawResponse.json();
        console.log(content); // TODO: DO SOMETHING ELSE WITH IT
        router.refresh();
      })();

      form.reset();
      router.refresh();
      toast({
        title: "Badge Updated",
        description: `Your badge, ${values.name} has been updated.`,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Badge
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-0 place-items-center">
                    <FormLabel className="uppercase text-xs font-bold">
                      Badge Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 w-30 text-center hover:bg-muted-foreground focus-visible:ring-2"
                        placeholder="Enter Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-3 place-items-center">
                    <FormLabel className="uppercase text-center text-xs font-bold">
                      Image URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 w-30 text-center hover:bg-muted-foreground focus-visible:ring-2 focus-visible:ring-offset-0"
                        placeholder="www.example.com/image.png"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subteam"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-0 place-items-center">
                    <FormLabel className="">Subteam</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="bg-muted rounded-2xl p-3">
                          <SelectValue placeholder="Select Subteam" />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectGroup>
                            <SelectLabel>Subteams</SelectLabel>
                            {subteams.map((subteam) => (
                              <SelectItem key={subteam.id} value={subteam.id}>
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
                name="level"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-0 place-items-center">
                    <FormLabel className="uppercase text-center text-xs font-bold">
                      Level (eg. 3)
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 w-16 text-center hover:bg-muted-foreground focus-visible:ring-2 focus-visible:ring-offset-0"
                        placeholder="3"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-3 place-items-center">
                    <FormLabel className="uppercase text-center text-xs font-bold">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        className="border-0 resize-none hover:bg-muted-foreground focus-visible:ring-2 focus-visible:ring-offset-0"
                        placeholder="Enter Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="grid grid-cols-1 px-6 py-4">
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
