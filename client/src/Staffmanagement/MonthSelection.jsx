import React, { useState } from "react";
import moment from "moment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

function MonthSelection({ onMonthChange }) {
  const nextMonth = addMonths(new Date(), 0);
  const [month, setMonth] = useState(nextMonth);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleMonthChange = (value) => {
    setMonth(value);
    if (onMonthChange) {
      onMonthChange(value);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onMonthChange) {
      onMonthChange(date);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex gap-2 items-center text-slate-500"
          >
            <CalendarDays className="h-5 w-5" />
            {selectedDate
              ? moment(selectedDate).format("MM YYYY")
              : moment(month).format("MM YYYY")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2">
          <Calendar
            mode="single"
            month={month}
            onMonthChange={handleMonthChange}
            onSelect={handleDateSelect}
            selected={selectedDate}
            className="flex flex-1 justify-center"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default MonthSelection;
