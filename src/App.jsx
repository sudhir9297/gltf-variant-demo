import "./App.css";
import { useState, useCallback, useEffect } from "react";
import Viewer from "./component/viewer.jsx";
import Sidemenu from "./component/sidemenu.jsx";

export default function App() {
  const [modelFile, setModelFile] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [variantsData, setVariantsData] = useState(null);

  const handleDrop = useCallback(
    (e, sampleUrl) => {
      e.preventDefault();
      setIsDragOver(false);
      if (sampleUrl || e.sampleUrl) {
        const url = sampleUrl || e.sampleUrl;
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            setModelFile({
              name: url.split("/").pop(),
              size: blob.size,
              type: blob.type || "model/gltf-binary",
            });
            setModelUrl(url);
          });
        return;
      }
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
      <div className="flex gap-10 items-center">
        <div className="w-[648px] h-[648px] rounded-3xl shadow-lg overflow-hidden bg-white">
          <Viewer
            modelUrl={modelUrl}
            isDragOver={isDragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            clearModel={clearModel}
            setVariantsData={setVariantsData}
          />
        </div>
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
