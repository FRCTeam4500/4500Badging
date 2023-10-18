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
  FormDescription,
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
import { Switch } from "../ui/switch";
import { Subteams } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1).max(255),
  imageUrl: z.string().optional(),
  email: z.string(),
  isRegistered: z.boolean().optional(),
  phoneNumber: z.string().optional(),
  mainSubteam: z.string().optional(),
  grade: z.string().optional(),
  graduationYear: z.string().optional(),
  role: z.string().optional(),
});

export const AddProfileModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "addProfile"; // && accessor?.role === Profile_role.COACH; // Only Coaches can Edit Other People And Change Everything

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      isRegistered: false,
      email: "",
      mainSubteam: Subteams.NONE,
      phoneNumber: "",
      grade: "9",
      graduationYear: "2025",
      role: "MEMBER",
    },
  });

  const roles = ["COACH", "MEMBER", "MENTOR", "CAPTAIN", "LEADERSHIP", "LEAD"];
  const grades = ["9", "10", "11", "12"];
  const graduationYears = ["2024", "2025", "2026", "2027"];

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      (async () => {
        const rawResponse = await fetch(`/api/profiles`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            imageUrl: values.imageUrl,
            isRegistered: values.isRegistered?.toString(),
            email: values.email,
            mainSubteam: values.mainSubteam,
            phoneNumber: values.phoneNumber,
            grade: values.grade,
            graduationYear: values.graduationYear,
            role: values.role,
          }),
        });
        const content = await rawResponse.json();
        console.log(content); // TODO: DO SOMETHING ELSE WITH IT
        router.refresh();
      })();

      form.reset();
      router.refresh();
      toast({
        title: "Profile Added",
        description: `The profile, ${values.name} has been added to the database.`,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const subteams = [
    {
      id: Subteams.NONE,
      label: "None",
    },
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
      label: "B,O,M",
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
      <DialogContent className="p-0 overflow-y-scroll max-y-screen">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add Profile
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
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 w-30 text-center hover:bg-muted-foreground focus-visible:ring-2"
                        placeholder="Enter Full Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-0 place-items-center">
                    <FormLabel className="uppercase text-xs font-bold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 w-30 text-center hover:bg-muted-foreground focus-visible:ring-2"
                        placeholder="Enter Email"
                        {...field}
                      />
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
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-0 place-items-center">
                    <FormLabel className="uppercase text-xs font-bold">
                      Image URL (optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 w-30 text-center hover:bg-muted-foreground focus-visible:ring-2"
                        placeholder="Enter Image URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Role</FormLabel>
                    </div>
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
                            <SelectLabel>Roles</SelectLabel>
                            {roles.map((role) => (
                              <SelectItem
                                className="lowercase"
                                key={role}
                                value={role}
                              >
                                {role}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainSubteam"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Main Subteam</FormLabel>
                    </div>
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isRegistered"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Registration Complete
                      </FormLabel>
                      <FormDescription>
                        Is the member registered with FIRST?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Grade Level</FormLabel>
                    </div>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="bg-muted rounded-2xl w-24 p-3">
                          <SelectValue placeholder="Select Grade Level" />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            {grades.map((grade) => (
                              <SelectItem
                                className="lowercase"
                                key={grade}
                                value={grade}
                              >
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="graduationYear"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Graduation Year
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="bg-muted rounded-2xl w-24 p-3">
                          <SelectValue placeholder="Select Subteam" />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectGroup>
                            <SelectLabel>Years</SelectLabel>
                            {graduationYears.map((grade) => (
                              <SelectItem
                                className="lowercase"
                                key={grade}
                                value={grade}
                              >
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
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
