import React from "react";

export default function Sidemenu() {
  return (
    <div
      className="bg-white rounded-2xl shadow-md p-6 w-80 flex flex-col gap-6"
      style={{ height: "648px", overflowY: "auto" }}
    >
      <div>
        <div className="font-semibold text-gray-700 mb-2">Gradient</div>
        <select className="w-full border border-gray-200 rounded px-2 py-1 text-sm">
          <option>Sharp Bézier</option>
        </select>
      </div>
      <div>
        <div className="font-semibold text-gray-700 mb-2">Warp Shape</div>
        <select className="w-full border border-gray-200 rounded px-2 py-1 text-sm mb-2">
          <option>Value Noise</option>
        </select>
        <div className="flex gap-2 text-xs text-gray-500 mb-1">
          <span>W 648</span>
          <span>H 648</span>
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500">Warp</label>
            <input type="range" className="w-full" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Warp Size</label>
            <input type="range" className="w-full" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Noise</label>
            <input type="range" className="w-full" />
          </div>
        </div>
      </div>
      <div>
        <div className="font-semibold text-gray-700 mb-2">Colors</div>
        <div className="flex flex-col gap-2">
          {[
            { hex: "#0F2F65" },
            { hex: "#E687D8" },
            { hex: "#347BD1" },
            { hex: "#6890E2" },
            { hex: "#07265C" },
            { hex: "#A88BDF" },
          ].map((color, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-5 h-5 rounded bg-[var(--color)] border"
                style={{ backgroundColor: color.hex }}
              ></span>
              <span className="text-xs font-mono">{color.hex}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="mt-2 w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
        Download
      </button>
    </div>
  );
}
