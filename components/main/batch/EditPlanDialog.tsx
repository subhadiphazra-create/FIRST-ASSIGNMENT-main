"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, PlusCircle } from "lucide-react";
import { TrainingPlan, PlanTopic } from "@/types/type";
import ShowTopicDialog from "./ShowTopicDialog";

interface Props {
  plan: TrainingPlan;
  onUpdatePlan: (updatedPlan: TrainingPlan) => void;
}

export default function EditPlanDialog({ plan, onUpdatePlan }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<PlanTopic | null>(null);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);

  const handleAddOrUpdateTopic = (topic: PlanTopic) => {
    let updatedTopics: PlanTopic[];

    if (editingTopic) {
      // update existing
      updatedTopics = plan.planTopics.map((t) =>
        t.topicId === topic.topicId ? topic : t
      );
    } else {
      // add new
      updatedTopics = [...plan.planTopics, topic];
    }

    const updatedPlan = { ...plan, planTopics: updatedTopics };
    onUpdatePlan(updatedPlan);

    setEditingTopic(null);
  };

  return (
    <div>
      {/* Plan Card */}
      <Card
        className="w-full cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setDetailsOpen(true)}
      >
        <CardContent className="p-4">
          <h1 className="text-xl font-bold">{plan.planTitle}</h1>
          <p className="text-sm text-gray-500">
            {plan.planStartDate} → {plan.planEndDate}
          </p>
          <p className="text-xs text-gray-400">
            {plan.planTopics.length} Topics
          </p>
        </CardContent>
      </Card>

      {/* Plan Preview Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-blue-600">
              {plan.planTitle}
            </DialogTitle>
          </DialogHeader>

          {/* Plan Info */}
          <div className="space-y-2 text-sm">
            <p>
              <b>Duration:</b> {plan.totalDurationInDays} days
            </p>
            <p>
              <b>Start:</b> {plan.planStartDate} {plan.planStartTime}
            </p>
            <p>
              <b>End:</b> {plan.planEndDate} {plan.planEndTime}
            </p>
          </div>

          {/* Topics */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Topics</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingTopic(null);
                  setTopicDialogOpen(true);
                }}
              >
                <PlusCircle className="w-4 h-4 mr-1" /> Add Topic
              </Button>
            </div>
            <ul className="space-y-2">
              {plan.planTopics.map((topic) => (
                <li
                  key={topic.topicId}
                  className="border rounded p-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{topic.topicTitle}</p>
                    <p className="text-xs text-gray-500">
                      {topic.topicDurationValue} {topic.topicDuration} —{" "}
                      {topic.topicDescription}
                    </p>
                    {topic.topicResources?.length > 0 && (
                      <ul className="list-disc ml-5 text-xs text-gray-400">
                        {topic.topicResources.map((res) => (
                          <li key={res.id}>{res.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTopic(topic);
                      setTopicDialogOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Topic Dialog */}
      {topicDialogOpen && (
        <ShowTopicDialog
          isOpen={topicDialogOpen}
          onClose={() => {
            setTopicDialogOpen(false);
            setEditingTopic(null);
          }}
          onAddTopic={handleAddOrUpdateTopic}
          topicToEdit={editingTopic}
        />
      )}
    </div>
  );
}
