"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Upload, Send, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  addFeedback,
  updateFeedback,
  removeFeedback,
} from "@/store/feedbackSlice";
import { useParams } from "next/navigation";
import { IResource } from "@/types/type";
import { v4 as uuidv4 } from "uuid";
import { DiscussionCard } from "./DiscussionCard";
import { ActivityLogCard } from "./ActivityLogCard";

interface DiscussionForumProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DiscussionForum: React.FC<DiscussionForumProps> = ({
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState("discussion");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const feedbacks = useSelector((state: RootState) => state.feedback.feedbacks);
  const activity = useSelector((state: RootState) => state.activity.activities);

  const dispatch = useDispatch();
  const params = useParams();
  const batchId = params?.batchId as string;

  // Convert files to IResource[]
  const mapFilesToResources = (files: File[]): IResource[] => {
    return files.map((file, idx) => ({
      resorceId: `${Date.now()}-${idx}`,
      resourceName: file.name,
      resourceType: file.type,
      resourceSize: `${(file.size / 1024).toFixed(1)} KB`,
      resourceUrl: URL.createObjectURL(file),
    }));
  };

  // Submit new or edited message
  const handleSend = () => {
    if (!message.trim() && files.length === 0) return;

    const resources = mapFilesToResources(files);

    if (editId) {
      const existing = feedbacks.find((f) => f.feedbackId === editId);
      if (!existing) return;

      dispatch(
        updateFeedback({
          ...existing,
          feedBackText: message,
          feedBackResources: resources,
          feedbackDate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
      setEditId(null);
    } else {
      dispatch(
        addFeedback({
          feedbackId: uuidv4(),
          batchId,
          userId: "U001",
          feedBackText: message,
          feedBackResources: resources,
          feedbackDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
    }

    setMessage("");
    setFiles([]);
  };

  const handleDelete = (feedbackId: string) => {
    dispatch(removeFeedback(feedbackId));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles((prev) => [...prev, ...Array.from(event.target.files)]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-80 sm:w-96 p-0 flex flex-col h-screen"
      >
        <SheetHeader className="p-3 border-b">
          <SheetTitle>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-9/12 grid grid-cols-2">
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="activity">Activity Logs</TabsTrigger>
              </TabsList>
            </Tabs>
          </SheetTitle>
        </SheetHeader>

        {/* Tabs Content */}
        <Tabs value={activeTab} className="flex-1 flex flex-col min-h-0">
          {/* Discussion Tab */}
          <TabsContent
            value="discussion"
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Scrollable messages */}
            <ScrollArea className="flex-1 min-h-0 p-3">
              {feedbacks.length > 0 ? (
                feedbacks.map((fb) => (
                  <DiscussionCard
                    key={fb.feedbackId}
                    fb={fb}
                    onEdit={(fb) => {
                      setMessage(fb.feedBackText);
                      setEditId(fb.feedbackId);
                      setFiles([]); // reset files when editing
                    }}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 border rounded-full px-3 py-1 w-fit mx-auto">
                  No Discussion Yet
                </div>
              )}
            </ScrollArea>

            {/* Fixed input at bottom */}
            <div className="sticky bottom-0 bg-white border-t p-3 flex flex-col gap-2">
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border rounded-md bg-gray-50 px-2 py-1 text-xs shadow-sm w-full"
                    >
                      <div className="truncate">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB | {file.type}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(idx)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter Comments"
                  className="flex-1"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="text-primary border-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="text-primary border-primary"
                  onClick={handleSend}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent
            value="activity"
            className="flex flex-col flex-1 min-h-0"
          >
            <ScrollArea className="flex-1 min-h-0 p-4 space-y-3">
              {activity.length > 0 ? (
                activity.map((act, idx) => (
                  <ActivityLogCard key={idx} act={act} />
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 border rounded-full px-3 py-1 w-fit mx-auto">
                  No Activity Logs Found
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
