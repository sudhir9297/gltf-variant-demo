import { Suspense, useEffect, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, Bounds, Center } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import Button from "./Button.jsx";
import { Card, CardContent } from "./Card.jsx";
import { Upload } from "lucide-react";

function extractGLBInfo(gltf) {
  const info = {
    version: gltf.asset?.version || "Unknown",
    generator: gltf.asset?.generator || "Unknown",
    extensions: [],
    meshes: [],
    totalVertices: 0,
    totalIndices: 0,
    totalSize: 0,
  };
  if (gltf.userData?.gltfExtensions) {
    info.extensions = Object.keys(gltf.userData.gltfExtensions);
  }
  if (gltf.parser?.json?.extensionsUsed) {
    info.extensions = [
      ...new Set([...info.extensions, ...gltf.parser.json.extensionsUsed]),
    ];
  }
  let meshId = 0;
  gltf.scene.traverse((object) => {
    if (object.isMesh && object.geometry) {
      const geometry = object.geometry;
      const attributes = Object.keys(geometry.attributes);
      const vertices = geometry.attributes.position?.count || 0;
      const indices = geometry.index?.count || 0;
      let size = 0;
      attributes.forEach((attr) => {
        const attribute = geometry.attributes[attr];
        if (attribute) {
          size += attribute.array.byteLength;
        }
      });
      if (geometry.index) {
        size += geometry.index.array.byteLength;
      }
      const meshInfo = {
        id: meshId++,
        name: object.name || `Mesh_${meshId}`,
        mode: "TRIANGLES",
        vertices,
        indices,
        attributes: attributes.map((attr) => {
          const attribute = geometry.attributes[attr];
          const itemSize = attribute?.itemSize || 1;
          const type = attribute?.array?.constructor?.name || "unknown";
          return `${attr.toUpperCase()}: ${type
            .replace("Array", "")
            .toLowerCase()}${itemSize > 1 ? itemSize : ""}`;
        }),
        size: Math.round((size / 1024) * 100) / 100,
        primitives: 1,
      };
      info.meshes.push(meshInfo);
      info.totalVertices += vertices;
      info.totalIndices += indices;
      info.totalSize += meshInfo.size;
    }
  });
  return info;
}

function GLBModel({ url, setVariantsData }) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );
    loader.setDRACOLoader(dracoLoader);
  });
  useEffect(() => {
    if (!gltf) return;
    // Extract GLB info
    const glbInfo = extractGLBInfo(gltf);
    // Handle variants
    let variants = [];
    let currentVariant = null;
    let selectVariant = null;
    let variantsExtension = null;
    if (gltf.userData && gltf.userData.gltfExtensions) {
      variantsExtension =
        gltf.userData.gltfExtensions["KHR_materials_variants"];
    }
    if (variantsExtension && variantsExtension.variants) {
      variants = variantsExtension.variants.map((variant) => variant.name);
      if (variants.length > 0) {
        currentVariant = variants[0];
      }
      selectVariant = async (variantName) => {
        if (!gltf || !gltf.parser) return;
        const parser = gltf.parser;
        const variantIndex = variantsExtension.variants.findIndex(
          (v) => v.name === variantName
        );
        if (variantIndex === -1) return;
        const updateMaterials = async (object) => {
          if (object.isMesh) {
            if (!object.userData.gltfExtensions) return;
            const meshVariantDef =
              object.userData.gltfExtensions["KHR_materials_variants"];
            if (!meshVariantDef || !meshVariantDef.mappings) return;
            if (!object.userData.originalMaterial) {
              object.userData.originalMaterial = Array.isArray(object.material)
                ? [...object.material]
                : object.material;
            }
            let materialChanged = false;
            for (const mapping of meshVariantDef.mappings) {
              if (mapping.variants && mapping.variants.includes(variantIndex)) {
                try {
                  const material = await parser.getDependency(
                    "material",
                    mapping.material
                  );
                  if (Array.isArray(object.material)) {
                    const materialIndex = mapping.material_index || 0;
                    object.material[materialIndex] = material;
                  } else {
                    object.material = material;
                  }
                  materialChanged = true;
                } catch (error) {
                  console.error("Error loading material:", error);
                }
              }
            }
            if (materialChanged) {
              if (parser.assignFinalMaterial) {
                parser.assignFinalMaterial(object);
              }
            } else {
              object.material = object.userData.originalMaterial;
            }
          }
        };
        gltf.scene.traverse(updateMaterials);
        setVariantsData((prev) => ({ ...prev, currentVariant: variantName }));
      };
    }
    setVariantsData({
      variants,
      currentVariant,
      selectVariant,
      glbInfo,
    });
  }, [gltf, setVariantsData]);
  return (
    <Bounds fit clip observe margin={1.3}>
      <primitive object={gltf.scene} />
    </Bounds>
  );
}

export default function Viewer({
  modelUrl,
  isDragOver,
  onDrop,
  onDragOver,
  onDragLeave,
  clearModel,
  setVariantsData,
}) {
  const fileInputRef = useRef();

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith(".glb")) {
      // Simulate a drop event for parent handler
      const dt = new DataTransfer();
      dt.items.add(file);
      const event = {
        preventDefault: () => {},
        dataTransfer: { files: dt.files },
      };
      onDrop(event);
    }
  };

  return (
    <div className="relative w-full h-full">
      {!modelUrl && (
        <div
          className="absolute inset-0 flex items-center justify-center z-50 w-full h-full"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          style={{ cursor: "pointer" }}
        >
          <Card
            className={`w-96 transition-all duration-200 ${
              isDragOver
                ? "border-blue-500 border-2 bg-blue-50"
                : "border-dashed border-2 border-gray-300 bg-white"
            } flex flex-col items-center justify-center`}
          >
            <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="mb-6">
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Drop GLB Model Here
                </h2>
                <p className="text-gray-600 mb-6">
                  Supports models with material variants
                </p>
              </div>
              <Button
                className="w-full mt-2"
                onClick={handleButtonClick}
                type="button"
              >
                Select GLB File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb"
                className="hidden"
                onChange={handleFileChange}
              />
            </CardContent>
          </Card>
        </div>
      )}
      <Canvas
        camera={{ position: [3, 2, 5], fov: 75 }}
        className="w-full h-full"
      >
        <Environment preset="apartment" />
        {modelUrl && (
          <Suspense fallback={null}>
            <GLBModel url={modelUrl} setVariantsData={setVariantsData} />
          </Suspense>
        )}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
      {modelUrl && (
        <Button
          onClick={clearModel}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
