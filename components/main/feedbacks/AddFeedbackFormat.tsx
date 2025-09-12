"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SmartSelect } from "@/components/ui/multi-select";

export type TFeedbackDetailsForm = {
  feedbackCategory: string;
  feedbackSubCategory: string;
};

type Props = {
  onSave: (details: TFeedbackDetailsForm) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: TFeedbackDetailsForm;
  existingCategories?: string[];
  onlyEditCategory?: boolean; // ✅ new flag
};

export default function AddFeedbackFormat({
  onSave,
  open: controlledOpen,
  onOpenChange,
  initialData,
  existingCategories = [],
  onlyEditCategory = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;

  const [feedbackCategory, setFeedbackCategory] = useState("");
  const [feedbackSubCategory, setFeedbackSubCategory] = useState("");
  const [useExisting, setUseExisting] = useState("no");

  useEffect(() => {
    if (initialData) {
      setFeedbackCategory(initialData.feedbackCategory);
      setFeedbackSubCategory(initialData.feedbackSubCategory);
    }
  }, [initialData]);

  const handleSave = () => {
    if (!feedbackCategory.trim() || (!onlyEditCategory && !feedbackSubCategory.trim())) {
      return;
    }
    onSave({ feedbackCategory, feedbackSubCategory });
    if (!initialData) {
      setFeedbackCategory("");
      setFeedbackSubCategory("");
      setUseExisting("no");
    }
    if (isControlled && onOpenChange) onOpenChange(false);
    else setOpen(false);
  };

  return (
    <Dialog open={isControlled ? controlledOpen : open} onOpenChange={(o) => (isControlled && onOpenChange ? onOpenChange(o) : setOpen(o))}>
      <DialogContent className="min-w-4xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>{onlyEditCategory ? "Edit Category" : initialData ? "Edit Feedback Discussion" : "Add Feedback Discussion"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1">
              {onlyEditCategory ? (
                <Input placeholder="Enter category name" value={feedbackCategory} onChange={(e) => setFeedbackCategory(e.target.value)} />
              ) : useExisting === "yes" ? (
                existingCategories.length > 0 ? (
                  <SmartSelect
                    options={existingCategories.map((c) => ({ label: c, value: c }))}
                    value={feedbackCategory}
                    onChange={(val) => setFeedbackCategory(val)}
                    placeholder="Select category"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No categories found</p>
                )
              ) : (
                <Input placeholder="Enter category" value={feedbackCategory} onChange={(e) => setFeedbackCategory(e.target.value)} />
              )}
            </div>

            {!onlyEditCategory && (
              <div className="flex items-center gap-4 w-1/2">
                <Label className="text-sm font-medium">Use existing category?</Label>
                <RadioGroup value={useExisting} onValueChange={setUseExisting} className="flex flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Subcategory */}
          {!onlyEditCategory && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Sub Category</label>
              <Input placeholder="Enter sub-category" value={feedbackSubCategory} onChange={(e) => setFeedbackSubCategory(e.target.value)} />
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            {onlyEditCategory ? "Update Category" : initialData ? "Update Discussion" : "Save Discussion"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
