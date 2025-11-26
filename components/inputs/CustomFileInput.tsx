import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { IoMdImage, IoMdCloudUpload } from "react-icons/io";

interface CustomFileInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  accept?: string;
  loading?: boolean;
  label?: string;
  previewType?: "image" | "audio" | "none";
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({
  onChange,
  value,
  accept = "*/*",
  loading = false,
  label = "Select File",
  previewType = "none",
}) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview if needed
      if (previewType !== "none") {
        const url = URL.createObjectURL(file);
        setPreview(url);
      }
    }
    onChange(e);
  };

  // Handle drag events
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Check file type based on accept prop
      const file = files[0];
      const fileType = file.type;

      // Simple validation based on accept prop
      if (accept !== "*/*") {
        const acceptTypes = accept.split(",");
        const isAccepted = acceptTypes.some((type) => {
          if (type.endsWith("/*")) {
            const category = type.split("/")[0];
            return fileType.startsWith(`${category}/`);
          }
          return type === fileType;
        });

        if (!isAccepted) {
          console.error("File type not accepted");
          return;
        }
      }

      // Create a synthetic change event
      const syntheticEvent = {
        target: {
          files: files,
        },
      } as unknown as ChangeEvent<HTMLInputElement>;

      // Create preview if needed
      if (previewType !== "none") {
        const url = URL.createObjectURL(file);
        setPreview(url);
      }

      onChange(syntheticEvent);
    }
  };

  return (
    <div className="w-full">
      {/* File input preview */}
      {preview && previewType === "image" && (
        <div className="mb-3 flex justify-center">
          <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-600">
            <img
              src={preview}
              alt="File preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Audio preview */}
      {preview && previewType === "audio" && (
        <div className="mb-3 flex justify-center">
          <audio controls src={preview} className="w-full max-w-md" />
        </div>
      )}

      {/* Drag and drop area */}
      {!preview && (
        <div
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50/10"
              : "border-gray-500 hover:border-blue-500"
          }`}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <IoMdCloudUpload className="w-10 h-10 mb-3 text-blue-500" />
            <p className="mb-2 text-sm text-white">
              <span className="font-semibold">Click to browse</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-400">
              {accept === "image/*"
                ? "JPG, PNG, GIF up to 5MB"
                : accept === "audio/*"
                ? "MP3, WAV, OGG up to 10MB"
                : "Select a file to upload"}
            </p>
          </div>
        </div>
      )}

      {/* File input button (shown when preview exists) */}
      {preview && (
        <div className="flex justify-center mt-3">
          <button
            type="button"
            onClick={handleClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <IoMdImage className="text-white" size={20} />
                <span>Change File</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />
    </div>
  );
};

export default CustomFileInput;
