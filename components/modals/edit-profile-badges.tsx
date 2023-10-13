"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Toggle } from "@/components/ui/toggle";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

const FormSchema = z.object({
  subteams: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Please select subteam.",
  }),
});

export async function CheckboxSubteamForm({ onUpload }) {
  const profile = await initialProfile();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subteams: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data.subteams);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Dialog open>
      <DialogContent className="w-[300px] text-center rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Choose Preffered Subsystems</DialogTitle>
          <DialogDescription>
            These can be changed later in settings.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="subteams"
                render={() => (
                  <FormItem className="grid grid-cols-2 gap-3 items-center">
                    {subteams.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="subteams"
                        render={({ field }) => {
                          return (
                            <div className="">
                              <FormItem key={item.id} className="">
                                <FormControl>
                                  <Toggle
                                    className="w-full"
                                    pressed={field.value?.includes(item.id)}
                                    value={item.id}
                                    onPressedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  >
                                    {item.label}
                                  </Toggle>
                                </FormControl>
                              </FormItem>
                            </div>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant={"outline"} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
