"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeedbackDiscussionLocal } from "./AddFedbackDialog";
import { Pencil, Trash2 } from "lucide-react"; // ✅ Import icons

type Props = {
  discussions: FeedbackDiscussionLocal[];
  onEditCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
  onEditSubCategory: (d: FeedbackDiscussionLocal) => void;
  onRemoveSubCategory: (id: string) => void;
};

export default function FeedbackDiscussionsAccordion({
  discussions,
  onEditCategory,
  onRemoveCategory,
  onEditSubCategory,
  onRemoveSubCategory,
}: Props) {
  // Group discussions by category
  const grouped = discussions.reduce<Record<string, FeedbackDiscussionLocal[]>>(
    (acc, d) => {
      acc[d.category] = acc[d.category] || [];
      acc[d.category].push(d);
      return acc;
    },
    {}
  );

  const categories = Object.keys(grouped);

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No Feedback Parameters added yet.
      </p>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {categories.map((category) => (
        <AccordionItem key={category} value={category}>
          <div className="flex items-center justify-between pr-2">
            <AccordionTrigger className="flex-1">{category}</AccordionTrigger>
            <div className="flex gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => onEditCategory(category)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => onRemoveCategory(category)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>

          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead className="w-[90%]">Subcategory</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grouped[category].map((d, idx) => (
                  <TableRow key={d.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{d.subCategory}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => onEditSubCategory(d)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => onRemoveSubCategory(d.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
