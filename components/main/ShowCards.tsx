"use client";

import { useState, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTimeAgo } from "@/hooks/useTimeAgo";

type ShowEntityCardProps = {
  id: string;
  title: string;
  createdAt: string;
  onDelete: (id: string) => void;
  description?: string;
  onClick?: () => void;
  confirmTitle?: string;
  extraContent?:
    | ReactNode
    | ((isOpen: boolean, onClose: (open: boolean) => void) => ReactNode);
};

export default function ShowCards({
  id,
  title,
  createdAt,
  description,
  onDelete,
  onClick,
  confirmTitle = "Delete Item?",
  extraContent,
}: ShowEntityCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const timeAgoText = useTimeAgo(createdAt);

  const handleDelete = () => {
    onDelete(id);
    setConfirmOpen(false);
  };

  return (
    <div>
      {/* Card */}
      <Card
        className="w-full cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => {
          if (extraContent) {
            setDetailsOpen(true);
          } else if (onClick) {
            onClick();
          }
        }}
      >
        <CardContent className="p-4">
          {/* Header Row */}
          <div className="flex items-start justify-between">
            {/* Title + Time */}
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {title}
              </h1>
              <p className="text-sm flex items-center gap-2 text-gray-400">
                <Clock size={12} /> {timeAgoText}
              </p>
            </div>

            {/* Delete Button */}
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>

          {/* Description */}
          {description && (
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
              {description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600">
              {confirmTitle}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <b>{title}</b>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Extra Dialog / Content */}
      {extraContent &&
        (typeof extraContent === "function"
          ? extraContent(detailsOpen, setDetailsOpen)
          : extraContent)}
    </div>
  );
}
