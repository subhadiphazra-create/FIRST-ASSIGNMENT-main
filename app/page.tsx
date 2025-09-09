"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Batch } from "@/types/type";
import { Input } from "@/components/ui/input";
import AppTraineeDialog from "@/components/main/AppTraineeDialog";
import { mockEmployees } from "@/constants";
import ShowCards from "@/components/main/ShowCards";

const Home = () => {
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
      <div className="flex flex-col gap-4 overflow-x-auto scroll-bar-hide">
        {filteredBatches?.length === 0 ? (
          <h1>No Data Found</h1>
        ) : (
          filteredBatches?.map((batch: Batch) => (
            <ShowCards key={batch.batchId} batch={batch} />
          ))
        )}
      </div>
    </>
  );
};

export default Home;
