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
import { useDispatch } from "react-redux";
import { addActivity } from "@/store/activitySlice";
import { useParams } from "next/navigation";
import { Badge } from "../ui/badge";

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
  badgeAvilable?: boolean;
  badgeText?: string;
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
  badgeAvilable,
  badgeText,
}: ShowEntityCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dispatch = useDispatch();
  const timeAgoText = useTimeAgo(createdAt);

  const params = useParams();
  const batchId = params?.batchId as string;

  const handleDelete = () => {
    onDelete(id);

    // ✅ Log activity in store
    dispatch(
      addActivity({
        batchId: batchId ? batchId : id,
        userId: "U101", // replace with real user
        action: "deleted",
        activityText: `Plan ${title} was deleted.`,
        actionDate: new Date().toISOString(),
      })
    );

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
              <div className="flex">
                <h1 className="text-lg font-bold text-gray-900 truncate max-w-[50px] dark:text-gray-100">
                  {title}
                </h1>
                {badgeAvilable && <Badge>{badgeText}</Badge>}
              </div>
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
