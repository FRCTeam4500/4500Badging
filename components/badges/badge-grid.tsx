import { Toggle } from "@/components/ui/toggle";
import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, BadgeCheck } from "lucide-react";
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
import { Form, FormField, FormItem } from "../ui/form";
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

export function UserBadgeGrid({ modalType }: { modalType: string }) {
  const [open, setOpen] = useState(false);
  const [badges, setBadges] = useState();
  const [userBadges, setUserBadges] = useState();

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

  async function handleSelectionEnd() {
    setOpen(false);
  }

  return (
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
            <form>
              <ScrollArea>
                <FormField
                  control={form.control}
                  name="badgeIds"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      // TODO ADD BADGES
                      <Toggle
                        variant={"default"}
                        className="bg-primary px-[0.5] py-1"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar>
                                <AvatarImage />
                                <AvatarFallback className="bg-primary text-secondary">
                                  <Badge />
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>This is a badge.</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Toggle>
                    </FormItem>
                  )}
                />
              </ScrollArea>
            </form>
          </Form>
        </DropdownMenuItem>
        <DropdownMenuItem className="grid grid-cols-1">
          <Button onClick={() => handleSelectionEnd()} variant={"default"}>
            Submit Selection
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
