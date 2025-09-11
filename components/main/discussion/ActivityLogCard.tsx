"use client";

import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { findNameById } from "@/lib/employeeUtils";

interface ActivityLog {
  userId: string;
  action: string;
  actionDate: string;
  activityText: string;
}

interface ActivityLogCardProps {
  act: ActivityLog;
}

export const ActivityLogCard: React.FC<ActivityLogCardProps> = ({ act }) => {
  return (
    <Card
      className={`shadow-sm ${
        act.action === "updated"
          ? "bg-amber-300"
          : act.action === "deleted"
          ? "bg-red-400"
          : "bg-slate-100"
      } mb-2`}
    >
      <CardContent className="px-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium dark:text-black">
            {findNameById(act.userId)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-700">
            {format(new Date(act.actionDate), "d MMM yyyy, h:mm a")}
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-500 mt-1">
          {act.activityText}
        </p>
      </CardContent>
    </Card>
  );
};
