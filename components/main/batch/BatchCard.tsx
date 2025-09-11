"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookCheck,
  BookPlus,
  CheckCheck,
  CirclePlus,
  Eye,
  FolderOpen,
  History,
  LayoutList,
  MessageCirclePlus,
  NotebookPen,
  Pencil,
  Percent,
  Route,
  ScanEye,
  SendHorizonal,
  SquarePen,
  SquarePlus,
  UserCheck,
  UserRoundCheck,
} from "lucide-react";
import { mockEmployees } from "@/constants";
import { Batch } from "@/types/type";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddPlanDialog from "./AddPlanDialog";
import { findNameById } from "@/lib/employeeUtils";
import { useRouter } from "next/navigation";
import ViewAssignmentDialog from "@/components/calendar/components/dialogs/view-assignment-dialog";

interface BatchCardProps {
  batch: Batch;
}

export default function BatchCard({ batch }: BatchCardProps) {
  // Separate states for each dialog
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMarksDialog, setShowMarksDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showAddAssgDialog, setShowAddAssgDialog] = useState(false);
  const [showAttandanceDialog, setShowAttandanceDialog] = useState(false);

  const router = useRouter();
  const checkIsComplete = (endDate: string) => {
    return new Date() > new Date(endDate);
  };

  const batchId = batch.batchId;

  const options = [
    {
      label: "Training Details",
      action: () => router.push(`/${batchId}/edit-plan`),
      icon: <Route size={16} />,
    },
    {
      label: "Assignments Details",
      action: () => setShowAddAssgDialog(true),
      icon: <BookCheck size={16} />,
    },
    {
      label: "Attandance Details",
      action: () => router.push(`/${batchId}/attandance-details`),
      icon: <SquarePlus size={16} />,
    },
    {
      label: "Feedbacks Details",
      action: () => router.push(`/${batchId}/feedback-details`),
      icon: <MessageCirclePlus size={16} />,
    },
    { label: "Open Folder", action: () => {}, icon: <FolderOpen size={16} /> },
  ];

  return (
    <>
      <Card className="w-full md:max-w-md mt-4">
        <CardHeader>
          <CardTitle className="border-b pb-5 flex justify-between items-center">
            <h2 className="text-md font-semibold flex items-center gap-3">
              <SendHorizonal width={16} height={16} /> {batch.batchTitle}
            </h2>
            <div className="flex items-center gap-3">
              {!checkIsComplete(batch.batchEndDate) ? (
                <p className="text-5xl text-green-400 mb-2 animate-pulse">•</p>
              ) : (
                <CheckCheck width={18} height={18} color="green" />
              )}
              {checkIsComplete(batch.batchEndDate) ? "Completed" : "Active"}

              {/* DropdownMenu for Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-transparent border text-black dark:text-white hover:bg-slate-100 dark:hover:bg-black">
                    <LayoutList />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={5}>
                  {options.map((option, key) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={option.action}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {option.icon}
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Trainees */}
          <div>
            <h1 className="font-bold text-xl">Trainees</h1>
            {batch.batchTrainee.map((trainee, key) => (
              <div key={key}>
                <div className="flex justify-between items-center">
                  <p className="text-md font-semibold flex items-center gap-3 my-4">
                    <UserRoundCheck width={18} height={18} />
                    {findNameById(trainee)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowHistoryDialog(true)}
                      className="bg-transparent border text-black dark:text-white hover:bg-slate-100 dark:hover:bg-black"
                    >
                      <History />
                    </Button>
                    <Button
                      onClick={() => setShowEditDialog(true)}
                      className="bg-transparent border text-black dark:text-white hover:bg-slate-100 dark:hover:bg-black"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      onClick={() => setShowMarksDialog(true)}
                      className="bg-transparent border text-black dark:text-white hover:bg-slate-100 dark:hover:bg-black"
                    >
                      <NotebookPen />
                    </Button>
                    <Button
                      onClick={() => setShowFeedbackDialog(true)}
                      className="bg-transparent border text-black dark:text-white hover:bg-slate-100 dark:hover:bg-black"
                    >
                      <Eye />
                    </Button>
                  </div>
                </div>
                <hr />
                <p className="text-md font-semibold flex items-center gap-3 my-4">
                  <Percent width={16} height={16} />
                  Assignment Marks: <span className="font-extralight">n/a</span>
                </p>
                <hr />
              </div>
            ))}
          </div>

          {/* Batch Seniors */}
          <div>
            <h1 className="font-bold text-xl mt-7">Batch Seniors</h1>
            {[
              { label: "Trainers", members: batch.batchTrainer },
              { label: "Mentors", members: batch.batchMentor },
              { label: "Reviewers", members: batch.batchReviewer },
            ].map((section, idx) => (
              <div key={idx}>
                <h3 className="text-md font-semibold flex items-center gap-3 mt-4 mb-1">
                  <UserCheck width={16} height={16} />
                  {section.label}:
                </h3>
                <p className="text-sm font-normal">
                  {section.members.map((id, key) => (
                    <span key={key}>
                      {findNameById(id)}
                      {key < section.members.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
                <hr className="my-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAddAssgDialog && (
        <ViewAssignmentDialog
          isOpen={showAddAssgDialog}
          onClose={() => setShowAddAssgDialog(false)}
        />
      )}
    </>
  );
}
