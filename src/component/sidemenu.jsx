import React from "react";
import Button from "./Button.jsx";
import { Card, CardContent } from "./Card.jsx";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./Collapsible.jsx";

export default function Sidemenu({
  modelFile,
  variantsData,
  onSelectVariant,
  clearModel,
}) {
  return (
    <div
      className="bg-white rounded-2xl shadow-md p-6 w-80 flex flex-col gap-6"
      style={{ height: "648px", overflowY: "auto" }}
    >
      <div className="flex-1">
        {modelFile && variantsData?.glbInfo ? (
          <>
            {/* Model Info */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {modelFile.name.replace(".glb", "")}
              </h1>
              <div className="text-sm text-gray-600 mb-4">
                <p>Size: {(modelFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p>Format: GLB</p>
              </div>
            </div>

            {/* GLB Metadata Box */}
            <div className="mb-6">
              <div className="font-medium text-gray-900 mb-2">GLB Metadata</div>
              <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Version:</span>
                  <span className="text-gray-900">
                    {variantsData.glbInfo.version}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Generator:</span>
                  <span className="text-gray-900 text-right max-w-60 break-words">
                    {variantsData.glbInfo.generator}
                  </span>
                </div>
              </div>
            </div>

            {/* Extensions Box */}
            {variantsData.glbInfo.extensions.length > 0 && (
              <div className="mb-6">
                <div className="font-medium text-gray-900 mb-2">Extensions</div>
                <div className="border border-gray-200 rounded-lg bg-gray-50 max-h-32 overflow-y-auto divide-y divide-gray-100">
                  {variantsData.glbInfo.extensions.map((ext, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 text-sm text-blue-800 font-mono"
                    >
                      {ext}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Material Variants Box */}
            {variantsData?.variants?.length > 0 && (
              <div className="mb-6">
                <div className="font-medium text-gray-900 mb-2">
                  Material Variants ({variantsData.variants.length})
                </div>
                <div className="border border-gray-200 rounded-lg bg-gray-50 max-h-32 overflow-y-auto p-2 flex flex-col gap-2">
                  {variantsData.variants.map((variant, index) => (
                    <Button
                      key={index}
                      onClick={() =>
                        onSelectVariant && onSelectVariant(variant)
                      }
                      className={`w-full justify-start text-sm ${
                        variantsData.currentVariant === variant
                          ? "bg-blue-100"
                          : ""
                      }`}
                    >
                      {variant}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Mesh List Box */}
            <div className="mb-6">
              <div className="font-medium text-gray-900 mb-2">
                Mesh List ({variantsData.glbInfo.meshes.length})
              </div>
              <div className="border border-gray-200 rounded-lg bg-gray-50 max-h-64 overflow-y-auto divide-y divide-gray-100">
                {variantsData.glbInfo.meshes.map((mesh) => (
                  <div key={mesh.id} className="p-3">
                    <div className="mb-1 font-semibold text-gray-800">
                      {mesh.name}
                    </div>
                    <div className="flex text-xs text-gray-600 gap-4">
                      <span>
                        Size:{" "}
                        <span className="text-gray-900">{mesh.size} KB</span>
                      </span>
                      <span>
                        Vertices:{" "}
                        <span className="text-gray-900">
                          {mesh.vertices.toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Box */}
            <div className="mb-6">
              <div className="font-medium text-gray-900 mb-2">Statistics</div>
              <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Total Meshes:</span>
                  <span className="text-gray-900">
                    {variantsData.glbInfo.meshes.length}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Total Vertices:</span>
                  <span className="text-gray-900">
                    {variantsData.glbInfo.totalVertices.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Total Indices:</span>
                  <span className="text-gray-900">
                    {variantsData.glbInfo.totalIndices.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Geometry Size:</span>
                  <span className="text-gray-900">
                    {variantsData.glbInfo.totalSize.toFixed(2)} KB
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-center h-full">
            No Model Loaded
          </div>
        )}
      </div>
      {modelFile && (
        <Button onClick={clearModel} className="w-full mt-4">
          Clear Model
        </Button>
      )}
    </div>
  );
}
