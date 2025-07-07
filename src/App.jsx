import "./App.css";
import { useState, useCallback, useEffect } from "react";
import Viewer from "./component/viewer.jsx";
import Sidemenu from "./component/sidemenu.jsx";

export default function App() {
  // Shared state
  const [modelFile, setModelFile] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [variantsData, setVariantsData] = useState(null);

  // Drag and drop handlers
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files[0] && files[0].name.toLowerCase().endsWith(".glb")) {
        const file = files[0];
        setModelFile(file);
        if (modelUrl) {
          URL.revokeObjectURL(modelUrl);
        }
        setModelUrl(URL.createObjectURL(file));
      }
    },
    [modelUrl]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith(".glb")) {
      setModelFile(file);
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
      setModelUrl(URL.createObjectURL(file));
    }
  };

  const clearModel = () => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl);
    }
    setModelFile(null);
    setModelUrl(null);
    setVariantsData(null);
  };

  useEffect(() => {
    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  return (
    <div className="min-h-screen flex justify-center items-center polka-bg">
      <div className="flex gap-10 items-start">
        {/* Left Side - 3D Viewer */}
        <div className="w-[648px] h-[648px] rounded-3xl shadow-lg overflow-hidden bg-white">
          <Viewer
            modelUrl={modelUrl}
            isDragOver={isDragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onFileSelect={handleFileSelect}
            clearModel={clearModel}
            setVariantsData={setVariantsData}
          />
        </div>
        {/* Right Side - Sidemenu */}
        <Sidemenu
          modelFile={modelFile}
          variantsData={variantsData}
          onSelectVariant={variantsData?.selectVariant}
          clearModel={clearModel}
        />
      </div>
    </div>
  );
}
