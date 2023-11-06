import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";

/**
 * Mobile toggle for the sidebar
 */
export function MobileToggle() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden mr-3">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex w-60 gap-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
