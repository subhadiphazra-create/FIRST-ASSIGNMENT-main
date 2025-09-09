import { Batch } from "@/types/type";

type BatchTableProps = {
  batch: Batch;
  onClose: () => void;
};

export default function BatchTable({ batch }: BatchTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="border px-4 py-2 font-semibold">Batch ID</td>
            <td className="border px-4 py-2">{batch.batchId}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Status</td>
            <td className="border px-4 py-2">{batch.batchStatus}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Region</td>
            <td className="border px-4 py-2">{batch.batchRegion}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Start Date</td>
            <td className="border px-4 py-2">{batch.batchStartDate}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">End Date</td>
            <td className="border px-4 py-2">{batch.batchEndDate}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Mentors</td>
            <td className="border px-4 py-2">{batch.batchMentor.join(", ")}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Reviewers</td>
            <td className="border px-4 py-2">
              {batch.batchReviewer.join(", ")}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Trainers</td>
            <td className="border px-4 py-2">
              {batch.batchTrainer.join(", ")}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Trainees</td>
            <td className="border px-4 py-2">
              {batch.batchTrainee.join(", ")}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Company ID</td>
            <td className="border px-4 py-2">{batch.companyId}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Description</td>
            <td className="border px-4 py-2">{batch.courseDescription}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
