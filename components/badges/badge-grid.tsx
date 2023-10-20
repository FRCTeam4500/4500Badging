import { Toggle } from "@/components/ui/toggle";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import React from "react";
import { Badge as BD, UserBadge } from "@prisma/client";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

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
  const [bdgs, setBdgs] = useState<any>();
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
      try {
        const response = await fetch(`/api/profiles/${profile?.id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserBadges(data);
          const userBadgeBadgeIds = Array.from(data.badges).map((badge: any) => badge.badgeId)
          form.setValue("badgeIds", userBadgeBadgeIds);
        } else {
          console.error("Failed to fetch user badges");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getBadges()
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setBdgs(data);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    getUserBadges()

    if (!bdgs) {
      router.refresh();
    }
  }, []);

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
      })();

      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  function groupBadgesBySubteamType(badges) {
    const groupedBadges = {};
    badges.forEach((badge) => {
      const subteamType = badge.subteamType;
      if (!groupedBadges[subteamType]) {
        groupedBadges[subteamType] = [];
      }
      groupedBadges[subteamType].push(badge);
    });
    return groupedBadges;
  }

  const groupedBadges: { [subteamType: string]: BD[] } = bdgs ? groupBadgesBySubteamType(bdgs) : {};

  const isLoading = form.formState.isSubmitting;

  return (
    <div>
      <Dialog open={open}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger
                className={cn("bg-primary px-[0.5]", className)}
                asChild
              >
                <Button
                  variant="default"
                  onClick={() => setOpen(true)}
                  size="icon"
                >
                  Badges&nbsp;
                  <BadgeCheck className="text-secondary" />
                  <span className="sr-only">Do Stuff</span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Edit Profile Badges</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="max-h-screen overflow-y-scroll">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea>
                <FormField
                  control={form.control}
                  name="badgeIds"
                  key="badgeIds"
                  render={({ field }) => (
                    <FormItem className="grid gap-1 grid-cols-5 items-start">
                      {Object.entries(groupedBadges).map(([subteamType, badges]: [string, BD[]]) => (
                        <React.Fragment key={subteamType}>
                          <div className="col-span-5">
                            <h5>{subteamType}</h5>
                          </div>
                          {badges.map((badge: BD) => (
                            <FormField
                              key={badge.id}
                              control={form.control}
                              name="badgeIds"
                              render={({ field }) => {
                                return (
                                  <FormItem>
                                    <FormControl>
                                      <Toggle
                                        variant={"outline"}
                                        className="px-[0.5] py-1"
                                        pressed={field.value && field.value.includes(badge.id)}
                                        value={badge.id}
                                        key={badge.id}
                                        onPressedChange={(value) => {
                                          return value
                                            ? field.onChange([...field.value!, badge.id])
                                            : field.onChange(
                                              field.value?.filter((v) => v !== badge.id)
                                            );
                                        }}
                                      >
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Avatar>
                                                <AvatarImage src={badge.imageUrl} />
                                                <AvatarFallback className="bg-transparent text-primary">
                                                  ?
                                                </AvatarFallback>
                                              </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>{badge.name}</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </Toggle>
                                    </FormControl>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </React.Fragment>
                      ))}
                    </FormItem>
                  )}
                />
              </ScrollArea>
              <div className="grid grid-cols-1 mt-2">
                <Button
                  variant="default"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
