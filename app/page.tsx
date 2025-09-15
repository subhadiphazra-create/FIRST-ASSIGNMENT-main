"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Batch } from "@/types/type";
import { Input } from "@/components/ui/input";
import AppTraineeDialog from "@/components/main/AppTraineeDialog";
import { mockEmployees } from "@/constants";
import ShowCards from "@/components/main/ShowCards";
import { useRouter } from "next/navigation";
import { removeBatch } from "@/store/trainingSlice";

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const batches = useSelector((state: RootState) => state.training.batches);

  const filteredBatches = batches?.filter((batch: Batch) =>
    batch.batchTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center gap-4 w-full">
        <Input
          type="text"
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 md:w-[75%]"
        />
        <AppTraineeDialog employees={mockEmployees} />
      </div>

      <div>
        <h1 className="text-xl font-semibold">All Batches</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredBatches?.length === 0 ? (
          <h1>No Data Found</h1>
        ) : (
          filteredBatches?.map((batch: Batch, index) => (
            <ShowCards
              cardFor="Batch"
              key={index}
              id={batch.batchId}
              description={batch.courseDescription}
              title={batch.batchTitle}
              createdAt={batch.uploadDate}
              onDelete={(id) => dispatch(removeBatch(id))}
              confirmTitle="Delete Batch?"
              onClick={() => router.push(`/${batch.batchId}`)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Home;
