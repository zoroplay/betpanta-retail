import React, { useState, useRef, useEffect } from "react";
import { FaChevronUp, FaTrash } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { ChevronUp, ChevronDown, Loader2, Loader, Trash2 } from "lucide-react";
import { WebHelper } from "@/lib/helpers";
import { InvalidHandler } from "./Input";
import { IoChevronDown } from "react-icons/io5";

type Option = {
  data_id: string;
  key: string;
  name: string;
  is_global: boolean;
};

type SelectAddProps = {
  options: Option[];
  value?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onChange: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
  required?: boolean;
  bg_color?: string;
  border_color?: string;
  text_color?: string;
  accent_color?: string;
  height?: string;
  rounded?: string;
  className?: string;
  isLoading?: boolean;
  isCreating?: boolean;
  isDeleting?: boolean;
};

const SelectAddInput: React.FC<SelectAddProps> = ({
  options,
  value,
  label,
  placeholder = "Select or create...",
  disabled,
  error,
  onChange,
  onCreate,
  onDelete,
  required = false,
  border_color = "border-gray-300",
  bg_color = "bg-white",
  text_color = "text-gray-700",
  accent_color = "text-gray-500",
  rounded = "rounded-md",
  height = "h-[46px]",
  className,
  isLoading,
  isCreating,
  isDeleting,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [showScrollArrows, setShowScrollArrows] = useState({
    up: false,
    down: true,
  });
  const [dropdownUp, setDropdownUp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsListRef = useRef<HTMLUListElement>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string | null>(null);

  const filtered = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );
  const exists = filtered.some(
    (opt) => opt.name.toLowerCase() === search.toLowerCase()
  );

  // Scroll arrow logic
  const handleScroll = () => {
    if (optionsListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = optionsListRef.current;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      const isScrollable = scrollHeight > clientHeight;
      setShowScrollArrows({
        up: scrollTop > 0,
        down: !isAtBottom && isScrollable,
      });
    }
  };

  const scrollOptions = (direction: "up" | "down") => {
    if (optionsListRef.current) {
      const scrollAmount = 100;
      optionsListRef.current.scrollBy({
        top: direction === "up" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (open && optionsListRef.current) {
      const { scrollHeight, clientHeight } = optionsListRef.current;
      const isScrollable = scrollHeight > clientHeight;
      setShowScrollArrows({ up: false, down: isScrollable });
    }
  }, [open, filtered.length]);

  useEffect(() => {
    const optionsList = optionsListRef.current;
    if (optionsList) {
      optionsList.addEventListener("scroll", handleScroll);
      return () => optionsList.removeEventListener("scroll", handleScroll);
    }
  }, [open]);

  // Overflow escape (dropdown flip)
  useEffect(() => {
    if (open && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const dropdownHeight = 260; // estimate: input + dropdown
      // Use the nearest scrollable parent for bounds if available
      let parent = dropdownRef.current.parentElement;
      let parentRect = null;
      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        if (style.overflowY === "auto" || style.overflowY === "scroll") {
          parentRect = parent.getBoundingClientRect();
          break;
        }
        parent = parent.parentElement;
      }
      let spaceBelow, spaceAbove;
      if (parentRect) {
        spaceBelow = parentRect.bottom - rect.bottom;
        spaceAbove = rect.top - parentRect.top;
      } else {
        spaceBelow = window.innerHeight - rect.bottom;
        spaceAbove = rect.top;
      }
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownUp(true);
      } else {
        setDropdownUp(false);
      }
    }
  }, [open]);

  // Validation logic
  const validate = () => {
    if (required && !value) {
      setInternalError("This field is required");
      return false;
    } else {
      setInternalError(null);
      return true;
    }
  };

  // On blur, validate if required
  const handleBlur = () => {
    if (required) {
      setIsSubmitted(true);
      validate();
    }
  };

  const handleInvalid: InvalidHandler = (e) => {
    e.preventDefault();
    setInternalError("Please select an option");
    // setShowError(true);
  };

  const inputStyle = `flex w-full ${rounded} border border-input text-inherit ring-offset-background file:border-0 file:text-xs file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus:outline-none focus:ring-2 focus-within:ring-ring focus-within:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus-within:bg-blue-50/20 hover:bg-blue-50/20 ${
    WebHelper.isDarkColor(bg_color)
      ? "focus-within:bg-blue-500/30 hover:bg-blue-500/30"
      : "hover:bg-blue-50"
  }`;
  const getBorderColor = () => {
    if (internalError || error)
      return "ring-2 ring-[#ff6347] border-[#ff6347] border"; // tomato
    if (isFocused)
      return `ring-2 ring-[${border_color.replace("border-", "")}]`; // use the same color as border
    return `${border_color} border`; // gray-200
  };

  // On submit, validate if required
  useEffect(() => {
    if (isSubmitted) {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted, value]);

  // Only show validation error if form was submitted or field was blurred
  const showError = internalError || error;
  // const showError =
  //   ((isSubmitted || focused === false) && internalError) || error;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setIsFocused(open);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full flex flex-col gap-1" ref={dropdownRef}>
      {label && (
        <label
          className={`text-xs font-semibold tracking-wide ${
            showError ? "text-[tomato]" : text_color
          }`}
        >
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {isLoading ? (
        <div
          className={`relative ${height} w-full ${inputStyle} ${getBorderColor()} border ${bg_color} flex items-center justify-between px-3 ${className} bg-gray-200 animate-pulse`}
        >
          {/* <div className="w-full h-6 rounded bg-gray-200 animate-pulse" /> */}
        </div>
      ) : (
        <div
          className={`relative text-xs ${height} w-full ${inputStyle} ${getBorderColor()} border ${bg_color} flex items-center justify-between px-3 cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
          onClick={() => {
            if (!disabled && !isLoading) setOpen(true);
          }}
          tabIndex={0}
        >
          <span>
            {value ? (
              options.find((opt) => opt.key === value)?.name || ""
            ) : (
              <span className="text-gray-500  font-semibold">
                {placeholder}
              </span>
            )}
          </span>
          <IoChevronDown
            className={`${
              open ? "rotate-180" : ""
            } transition-all duration-300 ${accent_color}`}
            size={20}
          />
        </div>
      )}
      {required && (
        <div className="hidden">
          <input
            ref={hiddenInputRef}
            required
            type="text"
            value={value}
            onBlur={handleBlur}
            onInvalid={handleInvalid}
            disabled={disabled}
          />
        </div>
      )}
      {!isLoading && open && (
        <div
          className={`absolute w-full z-10 backdrop-blur-lg border ${
            WebHelper.isDarkColor(bg_color)
              ? "bg-black/90 text-white border-slate-600/50"
              : bg_color
          } rounded-xl flex flex-col gap-2 w-full shadow-lg p-2 ${
            dropdownUp ? "bottom-4 mb-2" : "top-[90%] mt-1"
          }`}
          style={{ minWidth: 180 }}
        >
          <input
            className={`w-full text-xs h-10 px-2 py-1 rounded-lg mb-2 border border-gray-100/20 outline-0 ${bg_color} ${text_color} ${accent_color}`}
            placeholder="Search or create..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !exists && search.trim()) {
                onCreate(search.trim());
                setSearch("");
                setOpen(false);
              }
            }}
          />
          <div className="relative">
            {showScrollArrows.up && (
              <div
                className="absolute top-0 left-0 right-0 backdrop-blur-[2px] h-8 transition-all duration-200 bg-gradient-to-b from-white/30 to-transparent z-10 flex items-center justify-center cursor-pointer hover:bg-gray-500/30"
                onClick={() => scrollOptions("up")}
              >
                <ChevronUp size={20} className={accent_color} />
              </div>
            )}
            <ul
              ref={optionsListRef}
              className="max-h-48 overflow-y-auto hide-scrollbar scrollbar-hide"
              style={{
                paddingTop: showScrollArrows.up ? 8 : 0,
                paddingBottom: showScrollArrows.down ? 8 : 0,
              }}
              onScroll={handleScroll}
            >
              {filtered.length > 0 ? (
                filtered.map((opt) => (
                  <li
                    key={opt.key}
                    className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer text-xs transition-all duration-300 h-9 ${
                      WebHelper.isDarkColor(bg_color)
                        ? "hover:bg-black/60"
                        : "hover:bg-blue-100"
                    } ${
                      value === opt.key
                        ? WebHelper.isDarkColor(bg_color)
                          ? "bg-gradient-to-r from-blue-500/40 to-blue-700/40"
                          : "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => {
                      onChange(opt.key);
                      setOpen(false);
                      setIsSubmitted(true);
                      validate();
                      setSearch("");
                    }}
                  >
                    <span>{opt.name}</span>
                    <span className="flex items-center gap-2">
                      {value === opt.key && (
                        <FaCheck className="text-blue-500" />
                      )}
                      {!opt.is_global && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteKey(opt.key);
                            onDelete(opt.data_id);
                          }}
                          className={`p-1 cursor-pointer ${
                            WebHelper.isDarkColor(bg_color)
                              ? "text-gray-500 hover:bg-red-800/40 hover:text-red-500"
                              : "text-gray-600 hover:bg-red-100 hover:text-red-500"
                          } duration-300  rounded-full transition-colors w-7 h-7 flex items-center justify-center`}
                        >
                          {deleteKey === opt.key && isDeleting ? (
                            <Loader className="animate-spin text-red-500" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      )}
                    </span>
                  </li>
                ))
              ) : (
                <div className="text-gray-400 px-2 py-1">No options found</div>
              )}
            </ul>
            {showScrollArrows.down && (
              <div
                className="absolute bottom-0 left-0 right-0 backdrop-blur-[2px] h-8 transition-all duration-200 bg-gradient-to-t from-white/30 to-transparent z-10 flex items-center justify-center cursor-pointer hover:bg-gray-500/30"
                onClick={() => scrollOptions("down")}
              >
                <ChevronDown size={20} className="text-gray-500" />
              </div>
            )}
          </div>
          {!exists && search.trim() && (
            <div className="flex justify-center items-center gap-2 w-full">
              <button
                className=" mt-2 w-24 bg-blue-500 text-white py-1 rounded-full h-9 hover:bg-blue-600 flex items-center justify-center px-4 text-xs cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  // setLastCreated(search.trim());
                  onCreate(search.trim());
                  setIsSubmitted(true);

                  validate();
                }}
              >
                {isCreating ? <Loader className="animate-spin" /> : "Add"}
              </button>
            </div>
          )}
        </div>
      )}
      {(showError || error) && (
        <div className="text-[10px] mt-1 text-[tomato] font-semibold">
          {showError || error}
        </div>
      )}
    </div>
  );
};

export default SelectAddInput;
