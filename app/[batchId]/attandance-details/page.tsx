"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  CircleCheckBig,
  Clock,
  Users,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AttandancePlanCard from "@/components/main/attandance/AttandancePlanCard";
import { parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import AttendanceTableView from "@/components/main/attandance/AttendanceTableView";
import AttendanceSummaryView from "@/components/main/attandance/AttendanceSummaryView";
import { AddAttendance } from "@/components/main/attandance/AddAttandance";

const AttandancePage = () => {
  const router = useRouter();
  const params = useParams();
  const batchId = params?.batchId as string;

  const plans = useSelector((state: RootState) => state.plans.plans);
  const batches = useSelector((state: RootState) => state.training.batches);
  const events = useSelector((state: RootState) => state.events.events);
  const attendances = useSelector(
    (state: RootState) => state.attendances.attendances
  );

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    "table" | "summary" | "takeAttandance"
  >("table");

  const now = new Date();

  // 🔹 Active Programs
  const activePrograms = plans.filter((plan) => {
    const start = parseISO(plan.planStartDate);
    const end = parseISO(plan.planEndDate);
    return isWithinInterval(now, { start, end });
  }).length;

  // 🔹 Total Trainees (from current batch)
  const currentBatch = batches.find((b) => b.batchId === batchId);
  const totalTrainees = currentBatch ? currentBatch.batchTrainee.length : 0;

  // 🔹 Sessions Today
  const todaySessions = events.filter((event) =>
    isWithinInterval(now, {
      start: startOfDay(parseISO(event.startDate)),
      end: endOfDay(parseISO(event.endDate)),
    })
  ).length;

  // 🔹 Avg Attendance % (calculated dynamically across all plans)
  let totalPresent = 0;
  let totalPossible = 0;

  plans.forEach((plan) => {
    const batch = batches.find((b) => b.batchId === plan.batchId);
    const trainees = batch ? batch.batchTrainee : [];

    const planAttendances = attendances.filter((a) => a.planId === plan.planId);

    planAttendances.forEach((a) => {
      const statuses = Object.values(a.traineeList);
      totalPresent += statuses.filter((s) => s === "present").length;
      totalPossible += statuses.length; // all trainees had to be marked
    });
  });

  const avgAttendancePercentage =
    totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;

  const basicData = [
    {
      upperText: "Active Programs",
      icon: <Calendar size={16} />,
      output: activePrograms,
    },
    {
      upperText: "Total Trainees",
      icon: <Users size={16} />,
      output: totalTrainees,
    },
    {
      upperText: "Avg Attendance",
      icon: <CircleCheckBig size={16} />,
      output: `${avgAttendancePercentage}%`,
    },
    {
      upperText: "Sessions Today",
      icon: <Clock size={16} />,
      output: todaySessions,
    },
  ];

  return (
    <div>
      {/* Back Button */}
      <div
        className="flex w-fit items-center justify-start gap-3 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft width={18} height={18} />
        <p className="text-xl font-medium">Back</p>
      </div>

      <div>
        {/* Header */}
        <div className="mt-5">
          <h1 className="text-lg font-bold">Training Attendance</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
            Track attendance across all training programs
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3 md:flex-row mt-5">
          {basicData.map((data, index) => (
            <Card className="md:w-1/4 w-full" key={index}>
              <CardHeader className="flex justify-between w-full">
                <h1>{data.upperText}</h1>
                <p>{data.icon}</p>
              </CardHeader>
              <CardContent>
                <h1 className="font-bold mt-7">{data.output}</h1>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Training Programs */}
        <Card className="mt-5">
          <CardHeader>
            <h1 className="text-lg font-bold">Training Programs</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
              Overview of all training programs and their attendance rates.
            </p>
          </CardHeader>
          <CardContent>
            {/* 🔹 SCROLL CONTAINER */}
            <div className="flex gap-4 overflow-x-auto pb-3 scroll-bar-hide flex-nowrap">
              {plans.map((plan) => {
                const batch = batches.find((b) => b.batchId === plan.batchId);
                const trainees = batch ? batch.batchTrainee : [];
                return (
                  <button
                    key={plan.planId}
                    className="flex-shrink-0 w-1/4" // fixed width card, scrolls horizontally
                    onClick={() => setSelectedPlanId(plan.planId)}
                  >
                    <AttandancePlanCard
                      plan={plan}
                      trainees={trainees}
                      attendances={attendances.filter(
                        (a) => a.planId === plan.planId
                      )}
                      totalTrainees={trainees.length}
                    />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Attendance (only after selecting a plan) */}
        {selectedPlanId && (
          <Card className="mt-5">
            <CardHeader>
              <h1 className="text-lg font-bold">Detailed Attendance</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                Date-wise attendance tracking for the selected training program
              </p>
            </CardHeader>

            {/* Toggle Buttons */}
            <div className="flex w-full gap-2 px-4">
              <Button
                className="w-1/3"
                variant={viewMode === "table" ? "default" : "outline"}
                onClick={() => setViewMode("table")}
              >
                Table View
              </Button>
              <Button
                className="w-1/3"
                variant={viewMode === "summary" ? "default" : "outline"}
                onClick={() => setViewMode("summary")}
              >
                Summary View
              </Button>
              <Button
                className="w-1/3"
                variant={viewMode === "takeAttandance" ? "default" : "outline"}
                onClick={() => setViewMode("takeAttandance")}
              >
                Add Attandance
              </Button>
            </div>

            <CardContent>
              {viewMode === "table" ? (
                <AttendanceTableView
                  attendances={attendances.filter(
                    (a) => a.planId === selectedPlanId
                  )}
                  totalTrainees={totalTrainees}
                />
              ) : viewMode === "summary" ? (
                <AttendanceSummaryView
                  attendances={attendances.filter(
                    (a) => a.planId === selectedPlanId
                  )}
                  totalTrainees={totalTrainees}
                  plan={plans.find((p) => p.planId === selectedPlanId)!}
                />
              ) : (
                <AddAttendance planId={selectedPlanId} />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AttandancePage;
