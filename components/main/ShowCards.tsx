"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Batch } from "@/types/type";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { removeBatch } from "@/store/trainingSlice";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { useRouter } from "next/navigation";

type ShowCardProps = {
  batch: Batch;
};

export default function ShowCards({ batch }: ShowCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const deleteCard = () => {
    dispatch(removeBatch(batch.batchId));
    setConfirmOpen(false);
  };

  const timeAgoText = useTimeAgo(batch.uploadDate);

  return (
    <div>
      {/* Card */}
      <Card
        className="w-full cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => router.push(`/${batch.batchId}`)}
      >
        <div className="flex items-center justify-between">
          <CardContent>
            <h1 className="text-xl font-bold font-sans text-gray-900 dark:text-gray-100">
              {batch.batchTitle}
            </h1>
            <p className="text-sm text-gray-400">{timeAgoText}</p>
          </CardContent>
          <div
            className="pr-4"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmOpen(true); // 🔔 Open delete confirmation dialog
            }}
          >
            <Trash2 />
          </div>
        </div>
      </Card>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600">
              Delete Batch?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <b>{batch.batchTitle}</b>? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteCard}>
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
