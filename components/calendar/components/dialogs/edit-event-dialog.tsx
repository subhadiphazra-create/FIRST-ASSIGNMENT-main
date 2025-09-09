"use client";

import { parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import { updateEvent as updateEventAction } from "@/store/eventsSlice";
import { updateTopicDescription } from "@/store/plansSlice";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogHeader,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { eventSchema, TEventFormData } from "../../schemas";
import { useCalendar } from "../../contexts/calendar-context";
import { IEvent } from "../../interfaces";
import { RootState } from "@/store";
import { PlanTopic } from "@/types/type";

interface IProps {
  children: React.ReactNode;
  event: IEvent;
}

export function EditEventDialog({ children, event }: IProps) {
  const dispatch = useDispatch();
  const { users } = useCalendar();
  const [open, setOpen] = useState(false);

  const currentEvent = useSelector((state: RootState) =>
    state.events.events.find((e) => e.id === event.id)
  );

  const plans = useSelector((state: RootState) => state.plans.plans);
  const [topicData, setTopicData] = useState<PlanTopic>();

  useEffect(() => {
    if (!currentEvent) return;
    const plan = plans.find((p) => p.planId === currentEvent.planId);
    if (plan) {
      const topic = plan.planTopics.find(
        (t) => t.topicId === currentEvent.topicId
      );
      setTopicData(topic);
    }
  }, [currentEvent, plans]);

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      startTime: { hour: 9, minute: 30 },
      endTime: { hour: 18, minute: 30 },
      color: "blue",
      user: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (currentEvent) {
      const payload: TEventFormData = {
        title: currentEvent.title,
        description: topicData?.topicDescription ?? "",
        startDate: parseISO(currentEvent.startDate),
        endDate: parseISO(currentEvent.endDate),
        startTime: { hour: 9, minute: 30 },
        endTime: { hour: 18, minute: 30 },
        color: currentEvent.color,
        user: currentEvent.user.id,
      };
      form.reset(payload, { keepDefaultValues: false });
    }
  }, [currentEvent, topicData, form]);

  const onSubmit = (values: TEventFormData) => {
    if (!currentEvent) return;

    const user = users.find((u) => u.id === values.user);
    if (!user) return;

    const startDateTime = new Date(values.startDate);
    startDateTime.setHours(
      values.startTime.hour,
      values.startTime.minute,
      0,
      0
    );

    const endDateTime = new Date(values.endDate);
    endDateTime.setHours(values.endTime.hour, values.endTime.minute, 0, 0);

    // Update event core data
    dispatch(
      updateEventAction({
        ...currentEvent,
        user,
        title: values.title,
        color: values.color,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      })
    );

    // Update topic description separately
    dispatch(
      updateTopicDescription({
        planId: currentEvent.planId,
        topicId: currentEvent.topicId,
        topicDescription: values.description,
      })
    );

    setOpen(false);
  };

  const colorOptions = useMemo(
    () => ["blue", "green", "red", "yellow", "purple", "orange", "gray"],
    []
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="md:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update your event details and save the changes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            {/* Responsible */}
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsible</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="size-6">
                                <AvatarImage
                                  src={user.picturePath ?? undefined}
                                  alt={user.name}
                                />
                                <AvatarFallback className="text-xxs">
                                  {user.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <p className="truncate">{user.name}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input id="title" placeholder="Enter a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          type="button"
                        >
                          {field.value
                            ? field.value.toDateString()
                            : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(d) => field.onChange(d ?? field.value)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          type="button"
                        >
                          {field.value
                            ? field.value.toDateString()
                            : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(d) => field.onChange(d ?? field.value)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((c) => (
                          <SelectItem key={c} value={c}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`size-3.5 rounded-full bg-${c}-600`}
                              />
                              {c.charAt(0).toUpperCase() + c.slice(1)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button id="saveChanges" type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
