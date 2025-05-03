import React, { useState } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const FileActivityCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-sm mx-auto p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">File Activity Calendar</h3>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          sx={{
            width: '100%',
            '& .MuiPickersDay-dayWithMargin': {
              fontWeight: 'bold',
            },
            '& .MuiPickersCalendarHeader-label': {
              fontWeight: 600,
              fontSize: '1rem',
            },
          }}
        />
      </LocalizationProvider>

      <div className="mt-4 grid grid-cols-3 text-sm text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          Uploaded
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          Shared
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          Modified
        </div>
      </div>
    </div>
  );
};

export default FileActivityCalendar;
