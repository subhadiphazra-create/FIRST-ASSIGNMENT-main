"use client";

import AddFeedbackDialog from "@/components/main/feedbacks/AddFedbackDialog";
import AssignMentorsDialog from "@/components/main/feedbacks/AssignMentors";
import ShowCards from "@/components/main/ShowCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockEmployees } from "@/constants";
import { TFeedbackForm } from "@/schemas/feedbackSchema";
import { RootState } from "@/store";
import { deleteMentorFeedback } from "@/store/mentorFeedbacksSlice";
import { ArrowLeft, GraduationCap, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const FeedbackPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showAddFeedbackDialog, setShowAddFeedbackDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const dispatch = useDispatch();

  const plans = useSelector((state: RootState) => state.plans.plans);

  // ✅ Get feedbacks from store
  const feedbacks = useSelector(
    (state: RootState) => state.mentorFeedback.feedbacks
  );

  // ✅ Filter feedbacks by name
  const filteredFeedbacks = feedbacks?.filter((fb: TFeedbackForm) =>
    fb.feedbackName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Back button */}
      <div
        className="flex w-fit items-center justify-start gap-3 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft width={18} height={18} />
        <p className="text-xl font-medium">Back</p>
      </div>

      {/* Search + Actions */}
      <div className="flex items-center gap-4 mt-4 w-full">
        <Input
          type="text"
          placeholder="Search feedbacks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 md:w-[75%]"
        />
        <Button onClick={() => setShowAssignDialog(true)}>
          <GraduationCap size={16} /> Assign Mentors
        </Button>
        <Button onClick={() => setShowAddFeedbackDialog(true)}>
          <PlusCircle className="mr-1" />
          Create Feedback
        </Button>
      </div>

      <div className="my-3">
        <h1 className="text-xl font-semibold">All Feedbacks</h1>
      </div>

      {/* Feedback Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredFeedbacks?.length === 0 ? (
          <h1>No Feedback Found</h1>
        ) : (
          filteredFeedbacks?.map((fb) => (
            <ShowCards
              cardFor="Feedback"
              key={fb.feedbackId}
              id={fb.feedbackId}
              title={fb.feedbackName}
              createdAt={fb.createdAt}
              onDelete={(id) => dispatch(deleteMentorFeedback(id))}
              confirmTitle="Delete Feedback?"
              badgeAvilable={true} // ✅ Enable badge
              badgeText={fb.status} // ✅ Pass status from schema
              extraContent={(isOpen, onClose) => (
                <AddFeedbackDialog
                  isOpen={isOpen}
                  onClose={() => onClose(false)}
                  plans={plans}
                  feedback={fb}
                  mode="edit"
                />
              )}
            />
          ))
        )}
      </div>

      {/* Create Feedback Dialog */}
      {showAddFeedbackDialog && (
        <AddFeedbackDialog
          isOpen={showAddFeedbackDialog}
          onClose={() => setShowAddFeedbackDialog(false)}
          plans={plans}
          mode="create"
        />
      )}

      {/* Assign Mentors Dialog */}
      {showAssignDialog && (
        <AssignMentorsDialog
          isOpen={showAssignDialog}
          onClose={() => setShowAssignDialog(false)}
          employees={mockEmployees} // from constants or API
        />
      )}
    </div>
  );
};

export default FeedbackPage;
