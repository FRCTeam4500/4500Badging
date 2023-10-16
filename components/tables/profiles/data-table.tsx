"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  VisibilityState,
  makeStateUpdater,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, Plus, RefreshCcw, RefreshCw } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export async function fetchDelete({ id }: { id: string }) {
  await fetch(`/api/profiles/${id}`, {
    method: "DELETE",
  });
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  function DataTablePagination<TData>() {
    return (
      <div className="flex items-center justify-between px-2 pt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
                setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                table.setPageIndex(0);
                setPage(0);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                table.previousPage();
                setPage(page - 1);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                table.nextPage();
                setPage(page + 1);
              }}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
                setPage(table.getPageCount() - 1);
              }}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [internalData, setInternalData] = React.useState(data);
  const initialRenderRef = React.useRef(true);

  const table = useReactTable({
    data: internalData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  async function parseData(d: any) {
    const data = d;

    if (!data) {
      return;
    }

    /* Processing Chosen Profiles */
    const send: any = [];

    console.log(data);

    let numBadges;
    let accBadge;

    for (let i = 0; i < data.length; i++) {
      const profile = data[i];
      const badges = data[i].badges;
      if (badges != null) {
        numBadges = badges.length;
        const iterBadges = numBadges > 5 ? badges.slice(0, 5) : badges;
        accBadge = (
          <div className="flex justify-center">
            <TooltipProvider>
              {iterBadges.map((badge) => {
                return (
                  <Tooltip key={badge.badge.id}>
                    <TooltipTrigger asChild>
                      <Avatar>
                        <AvatarImage src={badge.badge.imageUrl} />
                        <AvatarFallback>
                          <Badge />
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{badge.badge.name}</TooltipContent>
                  </Tooltip>
                );
              })}
              {numBadges > 5 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="focus:outline-none"
                      onClick={() =>
                        (location.href = `/coach/profiles/${profile.id}`)
                      }
                    >
                      <Avatar className="select-none">
                        <AvatarFallback>+{numBadges - 5}</AvatarFallback>
                      </Avatar>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>View Profile For More</TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        );
      }
      send.push({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        numBadges: numBadges,
        badges: accBadge,
        role: profile.role,
        isRegistered: profile.isRegistered,
        isTravelCertified: profile.isTravelCertified,
      });
    }

    console.log(send);

    return send;
  }

  const [maxPages, setMaxPages] = React.useState(1);
  const [update, setUpdate] = React.useState(false);

  // React.useEffect(() => {
  //   if (initialRenderRef.current) {
  //     initialRenderRef.current = false;
  //     return;
  //   }

  //   const mm = async () => {
  //     const yeah = await fetch(
  //       `/api/profiles/table/page=${page}&pageSize=${pageSize}`,
  //       {
  //         method: "GET",
  //       }
  //     );
  //     const mmhm = await fetch(`/api/profiles/table`, {
  //       method: "GET",
  //     });
  //     const content = await yeah.json();
  //     const maxcon = await mmhm.json();
  //     setMaxPages(await maxcon);
  //     setInternalData(await parseData(content));
  //   };

  //   mm();
  // }, [page, pageSize, update]);

  const { onOpen } = useModal();

  return (
    <div className="min-w-full -mx-2 flex-col">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-2" asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                let names = "";
                table.getRowModel().rows?.length
                  ? (names = table
                      .getRowModel()
                      .rows.map((row) =>
                        row.getIsSelected()
                          ? names.concat(row.getValue("name"))
                          : null
                      )
                      .join("\n"))
                  : toast({ title: "No Profiles" });
                names != "" ? navigator.clipboard.writeText(names) : null;
                names != "" ? toast({ title: "Copied Names" }) : null;
              }}
            >
              Copy Names
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                let emails = "";
                table.getRowModel().rows?.length
                  ? (emails = table
                      .getRowModel()
                      .rows.map((row) =>
                        row.getIsSelected()
                          ? emails.concat(row.getValue("email"))
                          : null
                      )
                      .join("\n"))
                  : toast({ title: "No Profiles" });
                emails != "" ? navigator.clipboard.writeText(emails) : null;
                emails != "" ? toast({ title: "Copied Emails" }) : null;
              }}
            >
              Copy Emails
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* TODO: See if this functions prop */}
            <DropdownMenuItem
              onClick={() => {
                table.getRowModel().rows?.length
                  ? table.getRowModel().rows.map((row) =>
                      row.getIsSelected()
                        ? fetchDelete({
                            id: row.getValue("id"),
                          })
                            .then(() => {
                              toast({ title: "Profile deleted" });
                            })
                            .catch(() => {
                              toast({ title: "Error deleting profile" });
                            })
                        : null
                    )
                  : toast({ title: "No Profiles" });
              }}
            >
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          size={"icon"}
          variant="outline"
          className="ml-2"
          onClick={() => {
            setUpdate(!update);
          }}
        >
          <RefreshCw />
        </Button>
        <Button
          size={"icon"}
          variant="outline"
          className="ml-2"
          onClick={() => {
            onOpen("addProfile");
          }}
        >
          <Plus />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={"text-center"}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination />
    </div>
  );
}
