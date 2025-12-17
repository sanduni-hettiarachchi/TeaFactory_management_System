import React from "react";

function SummaryCard({ icon, text, number, color }) {
  return (
    <div
      className={`flex items-center gap-4 ${color} p-3 bg-green-500 rounded-md shadow-md min-h-[60px] transition-transform duration-200 hover:scale-[1.02]`}
    >
      {/* Icon */}
      <div className="text-3xl text-[rgb(31,127,31)] flex-shrink-0 ">
        {icon}
      </div>

      {/* Text + number */}
      <div className="flex flex-col leading-tight">
        <span className="text-[1.125rem] font-semibold text-[rgb(21,84,21)]">
          {text}
        </span>
        <span className="text-[1.25rem] font-bold text-[rgb(21,84,21)]">
          {number}
        </span>
      </div>
    </div>
  );
}

export default SummaryCard;
