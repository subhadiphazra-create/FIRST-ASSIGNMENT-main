"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FeedbackDiscussionLocal } from "./AddFedbackDialog";

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
  const grouped = discussions.reduce<Record<string, FeedbackDiscussionLocal[]>>((acc, d) => {
    acc[d.category] = acc[d.category] || [];
    acc[d.category].push(d);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  if (categories.length === 0) {
    return <p className="text-sm text-muted-foreground">No discussions added yet.</p>;
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
                size="sm"
                variant="outline"
                onClick={() => onEditCategory(category)}
              >
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onRemoveCategory(category)}
              >
                Remove
              </Button>
            </div>
          </div>

          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Subcategory</TableHead>
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
                        size="sm"
                        variant="outline"
                        onClick={() => onEditSubCategory(d)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => onRemoveSubCategory(d.id)}
                      >
                        Remove
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
