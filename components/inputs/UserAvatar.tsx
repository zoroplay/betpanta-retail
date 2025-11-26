/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@heroui/skeleton";
import { useTheme } from "../providers/ThemeProvider";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { MODAL_COMPONENTS } from "@/redux/features/types";
import { showModal } from "@/redux/features/slice/modal.slice";

interface Props {
  srcs?: string[];
  names?: string[];
  src?: string;
  name?: string;
}

const sanitizeImageUrl = (src: string | undefined): string | null => {
  if (!src) {
    return null;
  }

  // Check if it's already a valid URL or starts with a slash
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  ) {
    return src;
  }

  // If it's not a valid image URL, return null
  if (!src.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return null;
  }

  return ""; // Return null instead of trying to fix the path
};
const Avatar = ({
  src,
  name,
  className,
  style,
}: {
  src: string;
  name: string;
  className?: string;
  style?: any;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [image_src, setImageSrc] = useState(sanitizeImageUrl(src));
  useEffect(() => {
    setImageSrc(sanitizeImageUrl(src));
  }, [src]);

  return (
    <div
      className={`w-full h-full cursor-pointer relative overflow-hidden rounded-full ${className}`}
      style={style}
      onClick={() => {
        if (image_src) {
          // const params = new URLSearchParams(window.location.search);
          // dispatch(
          //   showModal({
          //     image_url: src,
          //     previous_image_url: `?${params.toString()}`,
          //   })
          // );
          // params.set("modal", MODAL_COMPONENTS.IMAGE_PREVIEW);
          // router.replace(`?${params.toString()}`);
        }
      }}
    >
      {!isLoaded && image_src && (
        <div className="absolute w-full h-full ">
          <Skeleton className="w-full min-h-[74px] min-w-[74px] h-full" />
        </div>
      )}
      {image_src ? (
        <Image
          className="bg-black object-top text-white w-full object-cover h-full flex justify-center items-center rounded-full"
          src={image_src || ""}
          alt={name || ""}
          width={320}
          height={320}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setImageSrc(null);
          }}
        />
      ) : (
        <div className="w-full h-full text-inherit flex bg-blueprimary  items-center justify-center rounded-full">
          <p className="text-center text-inherit capitalize font-semibold z-10">
            {name
              ? name.split(" ").length > 1
                ? `${name.split(" ")[0].charAt(0)}${name
                    .split(" ")[1]
                    .charAt(0)}`
                : name.charAt(0)
              : "_"}
          </p>
        </div>
      )}
    </div>
  );
};

const UserAvatar = ({ src, name, srcs, names }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [image_src, setImageSrc] = useState(sanitizeImageUrl(src));
  const { theme } = useTheme();

  useEffect(() => {
    const sanitizedSrc = sanitizeImageUrl(src);
    if (sanitizedSrc !== image_src) {
      setImageSrc(sanitizedSrc);
      setIsLoaded(true);
    }
  }, [src]);

  if (src || name) {
    return (
      <div
        className="w-full h-full cursor-pointer rounded-full relative overflow-hidden"
        onClick={() => {
          if (src) {
            // const params = new URLSearchParams(window.location.search);
            // dispatch(
            //   openComponentModal({
            //     image_url: src,
            //     previous_image_url: `?${params.toString()}`,
            //   })
            // );
            // params.set("modal", MODAL_COMPONENTS.IMAGE_PREVIEW);
            // router.replace(`?${params.toString()}`);
          }
        }}
      >
        {/* {!isLoaded && !image_src && (
          <div className="absolute w-full h-full">
            <Skeleton className="w-full min-h-[74px] min-w-[74px] h-full" />
          </div>
        )} */}

        {image_src ? (
          <Image
            className={` object-top text-white w-full object-cover h-full flex justify-center items-center rounded-full ${
              theme === "dark" ? "bg-black" : "bg-black/80"
            }`}
            src={image_src}
            alt={name || ""}
            width={320}
            height={320}
            onLoad={() => {
              console.log("loaded");
              setIsLoaded(true);
              // setImageSrc(sanitizeImageUrl(src));
            }}
            onError={() => {
              console.log("error");
              setIsLoaded(true);
              setImageSrc(null);
            }}
          />
        ) : (
          <div
            className={`w-full h-full  border flex bg-blueprimary text-white items-center justify-center rounded-full ${
              theme === "dark"
                ? "bg-black border-gray-700"
                : "bg-blue-900 border-gray-200"
            }`}
          >
            <p className="text-center text-inherit capitalize font-semibold z-10">
              {name
                ? name.split(" ").length > 1
                  ? `${name.split(" ")[0].charAt(0)}${name
                      .split(" ")[1]
                      .charAt(0)}`
                  : name.charAt(0)
                : "_"}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-full bg-blueprimary overflow-hidden">
      {(srcs || names)?.length === 2 ? (
        <div className="grid grid-cols-2 w-full h-full relative">
          <div
            className="absolute top-0 left-0 w-full h-full z-10"
            style={{
              background:
                "linear-gradient(45deg, transparent calc(50% - 1px), rgba(255,255,255,1) calc(50% - 1px), rgba(255,255,255,1) calc(50% + 1px), transparent calc(50% + 1px))",
            }}
          />

          {[0, 1].map((index) => (
            <Avatar
              key={index}
              src={sanitizeImageUrl(srcs?.[index])!}
              name={names?.[index]!}
              className="w-full h-full relative"
              style={{
                clipPath:
                  index === 0
                    ? "polygon(0 0, 100% 0, 0 100%)"
                    : "polygon(100% 0, 100% 100%, 0 100%)",
              }}
            />
          ))}
        </div>
      ) : (srcs || names)?.length! > 2 ? (
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full relative">
          <div
            className="absolute top-0 left-0 w-full h-full z-10"
            style={{
              background: `
                linear-gradient(45deg, transparent calc(50% - 1px), rgba(255,255,255,1) calc(50% - 1px), rgba(255,255,255,1) calc(50% + 1px), transparent calc(50% + 1px)),
                linear-gradient(-45deg, transparent calc(50% - 1px), rgba(255,255,255,1) calc(50% - 1px), rgba(255,255,255,1) calc(50% + 1px), transparent calc(50% + 1px))
              `,
            }}
          />

          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="relative w-full h-full">
              {index < 3 ? (
                srcs && (
                  <Avatar
                    src={sanitizeImageUrl(srcs[index])!}
                    name={names?.[index]!}
                    className="w-full h-full"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blueprimary">
                  <p className="text-white text-center font-semibold">
                    {`+${(srcs?.length || names?.length || 0) - 3}`}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full">
          {srcs && (
            <Avatar
              src={sanitizeImageUrl(srcs[0])!}
              name={names?.[0]!}
              className="w-full h-full"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
