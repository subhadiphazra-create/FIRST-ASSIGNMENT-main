import { mockEmployees } from "@/constants";

export function findNameById(id: string): string {
  const trainee = mockEmployees.find((e) => e.userId === id);

  if (!trainee) return "Unknown";
  return [
    trainee.basicData.firstName,
    trainee.basicData.middleName,
    trainee.basicData.lastName,
  ]
    .filter(Boolean)
    .join(" ");
}



export function findEmailById(id: string): string {
  const trainee = mockEmployees.find((e) => e.userId === id);

  if (!trainee) return "Unknown";
  return trainee.basicData.orgEmail
}