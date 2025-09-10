"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import BatchCard from "@/components/main/batch/BatchCard";
import { CalendarProvider } from "@/components/calendar/contexts/calendar-context";
import { ClientContainer } from "@/components/calendar/components/client-container";
import { mockEmployees } from "@/constants";
import { useState } from "react";
import { TCalendarView } from "@/components/calendar/types";

export default function BatchDetails() {
  const router = useRouter();
  const { batchId } = useParams();

  const batches = useSelector((state: RootState) => state.training.batches);
  const events = useSelector((state: RootState) => state.events.events);
  const batch = batches.find((b) => b.batchId === batchId);

  const [view, setView] = useState<TCalendarView>("month"); // local state

  // ✅ Build users from employees
  const users = mockEmployees.map((emp) => ({
    id: emp.userId,
    name: `${emp.basicData.firstName} ${emp.basicData.lastName}`.trim(),
    picturePath: emp.basicData.profilePicture?.originalImageName
      ? `/images/${emp.basicData.profilePicture.originalImageName}`
      : undefined,
  }));

  return (
    <div>
      <div
        className="flex w-fit items-center justify-start gap-3 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft width={18} height={18} />
        <p className="text-xl font-medium">Back</p>
      </div>

      <div className="w-full flex flex-col md:flex-row">
        {batch && <BatchCard batch={batch} />}

        <div className="w-full">
          <CalendarProvider events={events} users={users}>
            <div className="mx-auto flex max-w-screen-2xl flex-col  gap-4 p-4">
              <ClientContainer view={view} onChangeView={setView} />
            </div>
          </CalendarProvider>
        </div>
      </div>
    </div>
  );
}
