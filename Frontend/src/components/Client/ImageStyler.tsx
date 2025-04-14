/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Download, RefreshCw, Loader2 } from "lucide-react";
import { generateText } from "ai";
import { createGoogleGenerativeAI} from "@ai-sdk/google";
import { base64ToDataURL } from "@/lib/api/gemini";
const google = createGoogleGenerativeAI({
  apiKey:"AIzaSyCKQzob4du2lWW_10YelhHfpsM45YthEq0"
})
type StyleOption = {
  id: string;
  name: string;
  description: string;
  previewImage: string;
};

const styleOptions: StyleOption[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, simple lines with a focus on negative space",
    previewImage: "/assets/styles/minimalist.svg",
  },
  {
    id: "abstract",
    name: "Abstract",
    description: "Bold colors and geometric shapes",
    previewImage: "/assets/styles/abstract.svg",
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Nostalgic feel with retro elements",
    previewImage: "/assets/styles/vintage.svg",
  },
  {
    id: "futuristic",
    name: "Futuristic",
    description: "High-tech, sleek and modern aesthetic",
    previewImage: "/assets/styles/futuristic.svg",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft, flowing colors with artistic brush strokes",
    previewImage: "/assets/styles/watercolor.svg",
  },
  {
    id: "neon",
    name: "Neon",
    description: "Vibrant, glowing colors on dark backgrounds",
    previewImage: "/assets/styles/neon.svg",
  },
];

const ImageStyler = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50); // Default to middle (50%)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setTransformedImage(null); // Reset transformed image when new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setTransformedImage(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // function getStyleDescription(style: string): string {
  //   const styleDescriptions: Record<string, string> = {
  //     minimalist: "a minimalist style with clean, simple lines and a focus on negative space",
  //     abstract: "an abstract style with bold colors and geometric shapes",
  //     vintage: "a vintage style with a nostalgic feel and retro elements",
  //     futuristic: "a futuristic style with high-tech, sleek and modern aesthetic",
  //     watercolor: "a watercolor style with soft, flowing colors and artistic brush strokes",
  //     neon: "a neon style with vibrant, glowing colors on dark backgrounds"
  //   };
  
  //   return styleDescriptions[style] || `${style} style`;
  // }

  const handleStyleSelect = async (styleId: string) => {
    setSelectedStyle(styleId);

    // Call the Vercel AI SDK to transform the image
    if (originalImage) {
      try {
        setIsProcessing(true);

        const result = await generateText({
          model: google("gemini-2.0-flash-exp-image-generation",{

          }),
          headers:{
            "x-goog-api-key":"AIzaSyCKQzob4du2lWW_10YelhHfpsM45YthEq0"
          },
          
          providerOptions: {
            google: { responseModalities: ["TEXT", "IMAGE"] },
          },
          prompt: `
          Remodel the room shown in the image into a ${styleId} interior design. 
          Maintain the same camera angle, perspective, and room dimensions. 
          Keep the room’s structural layout intact (walls, windows, doors) but replace the furniture, color scheme, textures, and decorations to reflect the ${styleId} style. 
          The result should look like a professionally designed ${styleId} styled room with photorealistic quality.
        `
        });
        console.log(result)
        // @ts-ignore
        const generatedImageBase64 = result.response.messages[0].content.find(content => content.type === 'file')?.data
        // Convert the base64 back to a data URL
        const generatedImageDataURL = base64ToDataURL(generatedImageBase64);

        // Set the transformed image
        setTransformedImage(generatedImageDataURL);
      } catch (error) {
        console.error("Error generating styled image:", error);
        // In case of error, show a notification or fallback
        alert("Failed to generate styled image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setTransformedImage(null);
    setSelectedStyle(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (transformedImage) {
      const link = document.createElement("a");
      link.href = transformedImage;
      link.download = `styled-image-${selectedStyle}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h1 className="text-3xl font-bold mb-2">AI Style Transformer</h1>
        <p className="text-gray-600">
          Upload an image and select a style to transform it with AI
        </p>
      </motion.div>

      <div
        className={`flex flex-col flex-grow  ${
          transformedImage ? "hidden" : "flex"
        }`}
      >
        {/* Image upload area (full width when no image is selected) */}
        {!originalImage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-grow w-full"
          >
            <div
              className={`relative border-2 border-dashed rounded-lg h-full flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              <div className="text-center p-6">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mx-auto mb-4 bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center"
                >
                  <Upload className="text-gray-500" size={24} />
                </motion.div>
                <h3 className="text-lg font-medium mb-1">Upload an image</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supports JPG, PNG (max 5MB)
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Style selection grid (shown when image is uploaded but not yet transformed) */}
        {originalImage && !transformedImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mb-4"
          >
            <h3 className="text-lg font-medium mb-3">Select a style</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {styleOptions.map((style) => (
                <div
                  key={style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                    selectedStyle === style.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="aspect-video mb-2 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={style.previewImage}
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm">{style.name}</h4>
                  <p className="text-xs text-gray-500">{style.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mx-auto mb-4 flex items-center justify-center"
              >
                <Loader2 size={40} />
              </motion.div>
              <p className="text-lg font-medium">Transforming your image...</p>
            </div>
          </div>
        )}
      </div>

      {/* Full-page slider comparison (shown when there's a transformed image) */}
      {transformedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-grow w-full flex flex-col"
        >
          {/* Style indicator and controls */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Style:</span>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {styleOptions.find((s) => s.id === selectedStyle)?.name}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                title="Download"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <RefreshCw size={14} />
                <span>New Image</span>
              </button>
            </div>
          </div>

          {/* Image comparison slider (full height) */}
          <div
            className="relative border rounded-lg overflow-hidden shadow-sm flex-grow w-full cursor-col-resize h-[70vh] select-none"
            ref={sliderContainerRef}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent image selection
              setIsDraggingSlider(true);
              // Calculate slider position based on mouse position
              if (sliderContainerRef.current) {
                const rect = sliderContainerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const newPosition = (x / rect.width) * 100;
                setSliderPosition(Math.max(0, Math.min(100, newPosition)));
              }
            }}
            onMouseMove={(e) => {
              if (isDraggingSlider) {
                e.preventDefault(); // Prevent image selection while dragging
                if (sliderContainerRef.current) {
                  const rect =
                    sliderContainerRef.current.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const newPosition = (x / rect.width) * 100;
                  setSliderPosition(Math.max(0, Math.min(100, newPosition)));
                }
              }
            }}
            onMouseUp={() => setIsDraggingSlider(false)}
            onMouseLeave={() => setIsDraggingSlider(false)}
            onTouchStart={(e) => {
              e.preventDefault(); // Prevent default touch behavior
              setIsDraggingSlider(true);
              if (sliderContainerRef.current) {
                const rect = sliderContainerRef.current.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const newPosition = (x / rect.width) * 100;
                setSliderPosition(Math.max(0, Math.min(100, newPosition)));
              }
            }}
            onTouchMove={(e) => {
              if (isDraggingSlider) {
                e.preventDefault(); // Prevent default touch behavior while dragging
                if (sliderContainerRef.current) {
                  const rect =
                    sliderContainerRef.current.getBoundingClientRect();
                  const x = e.touches[0].clientX - rect.left;
                  const newPosition = (x / rect.width) * 100;
                  setSliderPosition(Math.max(0, Math.min(100, newPosition)));
                }
              }
            }}
            onTouchEnd={() => setIsDraggingSlider(false)}
          >
            {/* Transformed image (shown fully) */}
            <div className="absolute top-0 left-0 w-full h-full">
              <img
                src={transformedImage}
                alt="Transformed"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                {styleOptions.find((s) => s.id === selectedStyle)?.name} Style
              </div>
            </div>

            {/* Original image (shown based on slider position) */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={originalImage!}
                alt="Original"
                className="w-full h-full object-cover"
                style={{
                  width: `${100 / (sliderPosition / 100)}%`,
                  maxWidth: "none",
                }}
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                Original
              </div>
            </div>

            {/* Slider divider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-md"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 hover:shadow-xl">
                <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5"></div>
                <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5"></div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Drag the slider to compare the original and transformed images
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ImageStyler;
