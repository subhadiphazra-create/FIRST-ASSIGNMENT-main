"use client";


import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const ViewPlanPage = (props: Props) => {
  const router = useRouter();

  return (
    <div>
      <div
        className="flex w-fit items-center justify-start gap-3 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft width={18} height={18} />
        <p className="text-xl font-medium">Back</p>
      </div>
      <div>
      </div>
    </div>
  );
};

export default ViewPlanPage;
