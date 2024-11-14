"use client";
import { useState } from "react";
import Tabs from "../_components/calendar/tabs";
import { CalendarComponent } from "../_components/calendar/dndCalendar";
import Navigation from "../_components/nav";

export default function Calendar() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="flex flex-col h-screen" id="firstFold">
      <Navigation />
      <div className="px-10 py-4 flex flex-col gap-4 h-full overflow-hidden mt-2 mb-10">
        <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />
        <CalendarComponent />
      </div>
    </div>
  );
}
