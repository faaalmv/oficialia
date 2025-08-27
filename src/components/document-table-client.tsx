"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import type { Document, DocumentStatus } from "@/lib/types";
import { StatusOptions } from "@/lib/types";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { deleteDocumentAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

type DocumentTableClientProps = {
  documents: Document[];
};

export function DocumentTableClient({
  documents,
}: DocumentTableClientProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const { toast } = useToast();

  const filteredDocuments = React.useMemo(() => {
    return documents.filter((doc) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        doc.title.toLowerCase().includes(searchLower) ||
        doc.recipient.toLowerCase().includes(searchLower) ||
        doc.id.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || doc.status === statusFilter;
      
      const docDate = new Date(doc.createdAt).setHours(0,0,0,0);
      const fromDate = dateRange?.from ? new Date(dateRange.from).setHours(0,0,0,0) : null;
      const toDate = dateRange?.to ? new Date(dateRange.to).setHours(0,0,0,0) : null;

      const matchesDate = 
        !dateRange || 
        (!fromDate && !toDate) ||
        (fromDate && !toDate && docDate >= fromDate) ||
        (!fromDate && toDate && docDate <= toDate) ||
        (fromDate && toDate && docDate >= fromDate && docDate <= toDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, statusFilter, dateRange, documents]);

  const statusColors: { [key in DocumentStatus]: "default" | "secondary" | "success" | "outline" } = {
    Draft: "secondary",
    Sent: "default",
    "Received/Acknowledged": "success",
    Archived: "outline",
  };

  const handleDelete = async (id: string, title: string) => {
    if(confirm(`Are you sure you want to delete "${title}"?`)){
        await deleteDocumentAction(id);
        toast({
            title: "Document Deleted",
            description: `Document "${title}" has been deleted.`,
            variant: "destructive",
        });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by title, recipient, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {StatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {(statusFilter !== 'all' || dateRange) && <Button variant="ghost" onClick={() => { setStatusFilter('all'); setDateRange(undefined); }}>Clear Filters</Button>}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.id}</TableCell>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[doc.status]}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.recipient}</TableCell>
                  <TableCell>
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/documents/${doc.id}`} passHref legacyBehavior>
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <a><Eye className="mr-2 h-4 w-4" /> View</a>
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/documents/${doc.id}/edit`} passHref legacyBehavior>
                          <DropdownMenuItem asChild disabled={doc.status !== 'Draft'} className="cursor-pointer">
                            <a><Edit className="mr-2 h-4 w-4" /> Edit</a>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleDelete(doc.id, doc.title)} disabled={doc.status !== 'Draft'} className="text-destructive cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
