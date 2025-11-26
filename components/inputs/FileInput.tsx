import { getToken } from "@/redux/actions/getAccessToken";
import { Loader } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  BsFillFileEarmarkArrowUpFill,
  BsFileEarmarkSpreadsheetFill,
} from "react-icons/bs";
import { toast } from "sonner";
import Image from "next/image";
import { handleFileUpload } from "@/redux/services";
import { FaFilePdf } from "react-icons/fa6";

type Props = {
  onChange: (t: { target: { name: string; value: string } }) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
  name?: string;
  optionalLabel?: React.ReactElement;
  bottomLabel?: React.ReactElement;
  error?: null | string;
  label?: string;
  accept?: any;
  height?: string;
  bg_color?: string;
  border_color?: string;
  icon_bg_color?: string;
  accent_color?: string;
  button_class?: string;
};

const FileInput = ({
  onChange,
  optionalLabel,
  value,
  required,
  bottomLabel,
  placeholder,
  label,
  error,
  accept,
  name,
  height,
  bg_color = "bg-[#F5F9FF]",
  border_color = "border-[#c1d9ff]",
  icon_bg_color = "bg-[#EBF3FF]",
  accent_color = "text-[#0A112F]",
  button_class = "border-white text-white",
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<string>(value);
  const [fileType, setFileType] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const token = await getToken();
    setLoading(true);
    setFileType(file.type);
    setUploadProgress(0);

    try {
      const res = await handleFileUpload({
        event,
        setLoading,
        setUploadProgress,
        setUploadedImage: setFile,
      });

      onChange({
        target: { name: name || "file", value: res || "" },
      });
      setShowError(false);
    } catch (error: any) {
      toast("File Uopload Failed    ");
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    handleUpload({
      target: { files: acceptedFiles },
    } as React.ChangeEvent<HTMLInputElement>);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ?? {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "video/*": [".mp4", ".mov", ".avi"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  const renderPreview = () => {
    if (
      fileType.startsWith("video/") ||
      file.endsWith(".mp4") ||
      file.endsWith(".webm")
    ) {
      return (
        <video src={file} controls className="w-full h-full object-contain" />
      );
    } else if (fileType.startsWith("image/")) {
      return (
        <Image
          src={file}
          alt={fileName}
          width={360}
          height={360}
          className="w-full h-full object-contain"
        />
      );
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return (
        <div className="flex flex-col items-center justify-center p-4 bg-green-100 border border-green-300 rounded-lg">
          <BsFileEarmarkSpreadsheetFill size={48} color="#217346" />
          <p className="text-center mt-2 text-green-700">{fileName}</p>
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <div className="flex flex-col items-center justify-center p-4 bg-red-100 border border-red-300 rounded-lg">
          {/* You can use a PDF icon from react-icons */}
          <FaFilePdf size={48} color="#FF0000" /> {/* Add this import */}
          <p className="text-center mt-2 text-red-700">{fileName}</p>
        </div>
      );
    }

    return (
      <Image
        src={file}
        alt={fileName}
        width={360}
        height={360}
        className="w-full h-full object-contain"
      />
    );
  };

  const handleBlur = () => {
    if (required && !file) {
      setShowError(true);
    }
  };

  const handleInvalid = (event: React.InvalidEvent<HTMLInputElement>) => {
    event.preventDefault();
    setValidationMessage(event.target.validationMessage);
    setShowError(true);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30)
      return "bg-gradient-to-r from-blue-300/30 to-blue-500/30";
    if (progress < 70)
      return "bg-gradient-to-r from-blue-400/30 to-blue-600/30";
    return "bg-gradient-to-r from-blue-500/30 to-blue-700/30 bg-opacity-30";
  };

  const getProgressText = (progress: number) => {
    if (progress < 20) return "Preparing...";
    if (progress < 70) return `Uploading... ${progress}%`;
    if (progress < 85) return "Processing...";
    if (progress < 100) return "Finalizing...";
    return "Complete!";
  };

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col gap-1 w-full h-full`}>
      {label && (
        <div className="flex justify-between items-center gap-4">
          <label className="text-sm font-semibold" htmlFor="">
            {label}
          </label>
          {optionalLabel && (
            <span className="text-xs text-slate-700">{optionalLabel}</span>
          )}
        </div>
      )}
      {file ? (
        <div
          className={`flex flex-col relative items-center overflow-hidden justify-center ${
            height ? height : "max-h-[22rem] h-full min-h-[14rem]"
          }  border-2 rounded-lg`}
          style={{
            height: height ? `${height}` : "auto",
          }}
        >
          {renderPreview()}
          {loading && (
            <div
              className={`w-full absolute h-full ${
                uploadProgress > 45 ? "opacity-50" : ""
              }`}
            >
              <div className="w-full bg-gray-100 rounded-md h-full dark:bg-gray-700">
                <div
                  className={`h-full flex  justify-center items-center rounded-md transition-all duration-300 ${getProgressColor(
                    uploadProgress
                  )}`}
                  style={{
                    width: `${uploadProgress}%`,
                    transition: "width 0.3s ease-in-out",
                  }}
                >
                  <span className="text-xs text-white px-2 leading-4 inline-block">
                    {getProgressText(uploadProgress)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex ${
            height ? height : "max-h-[22rem] h-full min-h-[16rem]"
          } flex-col items-center justify-center relative p-8 border-3 border-dashed rounded-lg ${
            isDragActive
              ? "bg-[#87b7ff] border-[#3981F7]"
              : `${bg_color} ${border_color}`
          }`}
        >
          <input
            {...getInputProps()}
            onChange={handleUpload}
            onBlur={handleBlur}
            onInvalid={handleInvalid}
            required={required}
          />
          <div className="text-center flex flex-col justify-between items-center gap-4">
            <div className="mb-4 w-full flex justify-center items-center ">
              <span
                className={`p-4 h-full w-[64px] flex justify-center items-center rounded-full  ${icon_bg_color}`}
              >
                {loading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <BsFillFileEarmarkArrowUpFill
                    fontSize={32}
                    className={`${accent_color}`}
                  />
                )}
              </span>
            </div>
            <p
              className={`text-inherit text-sm cursor-pointer ${accent_color}`}
            >
              Click here or drag file to upload
            </p>
            {placeholder && (
              <span className="text-[#9096A2] text-sm">{placeholder}</span>
            )}
          </div>
          {loading && (
            <div
              className={`w-full absolute h-full ${
                uploadProgress > 65 ? "opacity-50" : ""
              }`}
            >
              <div className="w-full bg-gray-100 rounded-md h-full dark:bg-gray-700">
                <div
                  className={`h-full flex  justify-center items-center rounded-md transition-all duration-300 ${getProgressColor(
                    uploadProgress
                  )}`}
                  style={{
                    width: `${uploadProgress}%`,
                    transition: "width 0.3s ease-in-out",
                  }}
                >
                  <span className="text-xs text-white px-2 leading-4 inline-block">
                    {getProgressText(uploadProgress)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-end items-center gap-4 w-full">
        {bottomLabel && <>{bottomLabel}</>}
      </div>

      {file && (
        <div className="w-full justify-center items-center flex">
          <button
            type="button"
            onClick={openImagePicker}
            className={`text-sm cursor-pointer  border rounded-full px-4 py-2 ${button_class}`}
          >
            {loading ? <Loader /> : "Change Media"}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
      <div
        className={`overflow-hidden  ${
          showError ? "h-6" : "h-0"
        } transition-all`}
      >
        <p
          className={`text-xs font-bold text-red transition-all ${
            showError ? "opacity-1" : "opacity-0"
          }`}
        >
          * {validationMessage || error}
        </p>
      </div>
    </div>
  );
};

export default FileInput;
