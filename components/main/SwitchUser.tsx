"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setSelectedUserId } from "@/store/usersSlice";
import { mockEmployees } from "@/constants";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SwitchUser() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedUserId = useSelector(
    (state: RootState) => state.users.selectedUserId
  );

  const users = mockEmployees.map((emp) => ({
    id: emp.userId,
    fname: emp.basicData.firstName,
    lname: emp.basicData.lastName,
    picturePath: emp.basicData.profilePicture,
  }));

  return (
    <Select
      value={selectedUserId ?? "all"}
      onValueChange={(val) => dispatch(setSelectedUserId(val))}
    >
      <SelectTrigger className="flex-1 md:w-48">
        <SelectValue />
      </SelectTrigger>

      <SelectContent align="end">
        {/* Individual users */}
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id} className="flex-1">
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={user.picturePath ?? undefined}
                  alt={user.fname[0]}
                />
                <AvatarFallback className="text-xxs">
                  {user.fname[0]}
                </AvatarFallback>
              </Avatar>
              <p className="truncate">{user.fname + user.lname}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
