"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { findNameById } from "@/lib/employeeUtils";
import { FeedBack } from "@/types/type";

interface DiscussionCardProps {
  fb: FeedBack;
  onEdit: (feedback: FeedBack) => void;
  onDelete: (feedbackId: string) => void;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  fb,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      key={fb.feedbackId}
      className="relative group shadow-sm transition mb-2 bg-slate-100"
    >
      <CardContent className="px-3">
        <p className="text-md text-gray-700 dark:text-gray-300">
          {fb.feedBackText}
        </p>

        {/* Multiple Resources */}
        {fb.feedBackResources?.length > 0 && (
          <div className="mt-2 space-y-2">
            {fb.feedBackResources.map((res) => (
              <div
                key={res.resorceId}
                className="flex items-center justify-between text-xs border p-2 rounded bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <Paperclip className="h-3 w-3 text-gray-500" />
                  <div>
                    <p className="font-medium">{res.resourceName}</p>
                    <p className="text-gray-500">
                      {res.resourceSize} | {res.resourceType}
                    </p>
                  </div>
                </div>
                <a
                  href={res.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {findNameById(fb.userId)}
          </span>
          <span className="text-xs text-gray-400">
            {format(new Date(fb.feedbackDate), "d MMM yyyy, h:mm")}
          </span>
        </div>
      </CardContent>

      {/* Hover Actions */}
      <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onEdit(fb)}
          className="h-7 w-7"
        >
          <Edit2 className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => onDelete(fb.feedbackId)}
          className="h-7 w-7"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};
