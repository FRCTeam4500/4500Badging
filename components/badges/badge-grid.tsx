import { Toggle } from "@/components/ui/toggle";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const formSchema = z.object({
  badgeIds: z.array(z.string()).optional(),
});

export function UserBadgeGrid({
  className,
  modalType,
}: {
  className?: string;
  modalType: string;
}) {
  const [open, setOpen] = useState(false);
  const [badges, setBadges] = useState<any>();
  const [userBadges, setUserBadges] = useState<any>();

  const router = useRouter();

  const { onClose, data } = useModal();
  let { profile } = data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      badgeIds: [],
    },
  });

  useEffect(() => {
    const getBadges = async () => {
      return await fetch("/api/badges", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    };

    const getUserBadges = async () => {
      return await fetch(`/api/userbadges/${profile?.id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    };

    getBadges()
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setBadges(data);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    getUserBadges()
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setUserBadges(data);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // * Sets the default values of the form to the user's current badges
  useEffect(() => {
    if (userBadges) {
      const userBadgeBadgeIds = userBadges.map(
        (userBadge) => userBadge.badgeId
      );
      form.setValue("badgeIds", userBadgeBadgeIds);
    }
  }, [form, userBadges]);

  if (!badges) {
    router.refresh();
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      (async () => {
        console.log(profile?.id);
        const rawResponse = await fetch(`/api/userbadges/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            badgeIds: values.badgeIds,
            profileId: profile?.id,
          }),
        });
        const content = await rawResponse.json();
        console.log(content);
        router.refresh();
      })();

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className={cn(className)}>
      <DropdownMenu open={open}>
        <DropdownMenuTrigger className="bg-primary px-[0.5] py-1" asChild>
          <Button variant="ghost" onClick={() => setOpen(true)} size="icon">
            <BadgeCheck className="text-secondary" />
            <span className="sr-only">Do Stuff</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea>
                  <FormField
                    control={form.control}
                    name="badgeIds"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {badges.map((badge) => (
                          <FormControl>
                            <Toggle
                              variant={"default"}
                              pressed={field.value!.includes(badge.id)}
                              value={badge.id}
                              onPressedChange={(value) => {
                                return value
                                  ? field.onChange([...field.value!, badge.id])
                                  : field.onChange(
                                      field.value?.filter((v) => v !== badge.id)
                                    );
                              }}
                              className="bg-primary px-[0.5] py-1"
                            >
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Avatar>
                                      <AvatarImage src={badge.imageUrl} />
                                      <AvatarFallback className="bg-primary text-secondary">
                                        <Badge />
                                      </AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent>{badge.name}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Toggle>
                          </FormControl>
                        ))}
                      </FormItem>
                    )}
                  />
                </ScrollArea>
                <div className="grid grid-cols-1 mt-2">
                  <Button variant="default" disabled={isLoading}>
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </DropdownMenuItem>
          {/* <DropdownMenuItem >
          <Button onClick={() => handleSelectionEnd()} variant={"default"}>
            Submit Selection
          </Button>
        </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
