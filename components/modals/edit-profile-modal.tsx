"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Profile_role } from "@prisma/client";
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

const formSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  imageUrl: z.string().optional(),
  isRegistered: z.boolean().optional(),
  isTravelCertified: z.boolean().optional(),
  userBadges: z.array(z.string()).optional(), // Array of Badge IDs, Creates it all.
  phoneNumber: z.string().optional(),
  grade: z.number().max(4).min(1).optional(),
  graduationYear: z.number().optional(),
});

export const EditProfileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  let { profile, accessor } = data;
  const isModalOpen =
    isOpen && type === "editProfile" && accessor?.role === Profile_role.COACH; // Only Coaches can Edit Other People And Change Everything

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      isRegistered: false,
      isTravelCertified: false,
      userBadges: [],
      phoneNumber: "",
      grade: 0,
      graduationYear: 0,
    },
  });

  useEffect(() => {
    if (profile) {
      form.setValue("phoneNumber", profile?.phoneNumber);
      form.setValue("grade", profile?.grade);
      form.setValue("graduationYear", profile?.graduationYear);
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
            grade: values.grade,
            graduationYear: values.graduationYear,
          }),
        });
        const content = await rawResponse.json();
        console.log(content); // TODO: DO SOMETHING ELSE WITH IT
        router.refresh();
      })();

      form.reset();
      router.refresh();
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
      <DialogContent className="p-0 overflow-hidden bg-primary-foreground">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
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
                        className="border-0 w-30 text-center focus-visible:ring-0"
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
                name="grade"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-0 place-items-center">
                    <FormLabel className="uppercase text-center text-xs font-bold">
                      Grade (1-4)
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 w-16 text-center focus-visible:ring-0 focus-visible:ring-offset-0"
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
                name="graduationYear"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-3 place-items-center">
                    <FormLabel className="uppercase text-center text-xs font-bold">
                      Graduation Year (eg. 2025)
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 w-16 text-center focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="2025"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
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
