"use client";
import { Dispatch } from "react";

export default function Tabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: Dispatch<number>;
}) {
  const tabs = [
    { icon: "", tabName: "Wood Shop" },
    { icon: "", tabName: "Metal Shop" },
    { icon: "", tabName: "Sewing Studio" },
    { icon: "", tabName: "Laser Cutters" },
  ];
  return (
    <div className="flex flex-row gap-4">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`flex flex-row gap-2 items-center cursor-pointer mb-1 ${
            activeTab === index
              ? "text-blue-600 font-semibold border-b-blue-600 border-b-2"
              : ""
          }`}
          onClick={() => setActiveTab(index)}
        >
          <div className="w-4 h-4 bg-slate-200"></div>
          <p>{tab.tabName}</p>
        </div>
      ))}
    </div>
  );
}
