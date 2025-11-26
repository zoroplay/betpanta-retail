/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Check,
  ChevronDown,
  Search,
  X,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
import SingleSearchInput from "./SingleSearchInput";
import UserAvatar from "./UserAvatar";
import { FaCheck } from "react-icons/fa6";
import { IoChevronDown, IoClose } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { WebHelper } from "@/lib/helpers";

interface Option {
  id: string;
  name: string;
  flag?: string;
  avatar_url?: string;
  avatar?: boolean;
  icon?: IconType;
}

interface SearchSelectProps {
  options: Option[];
  value?: (string | number)[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  height?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  bg_color?: string;
  border_color?: string;
  text_color?: string;
  accent_color?: string;
  isMulti?: boolean;
  rounded?: string;
  maxSelections?: number;
  required?: boolean;
  isLoading?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  name?: string;
  form?: string;
  validate?: (isValid: boolean) => void;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  height = "h-[38px]",
  label,
  error,
  disabled = false,
  searchPlaceholder = "Search...",
  border_color = "border-gray-300",
  bg_color = "bg-white",
  text_color = "text-gray-700",
  accent_color = "text-gray-500",
  isMulti = false,
  rounded = "rounded-md",
  maxSelections,
  required = false,
  onValidationChange,
  name,
  form,
  validate,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [showScrollArrows, setShowScrollArrows] = useState({
    up: false,
    down: true,
  });
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    if (value) {
      const selected = options.filter((opt) => value.includes(opt.id));
      setSelectedOptions(selected);
    } else {
      setSelectedOptions([]);
    }
  }, [value, options]);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    } else {
      setDropdownPosition(null);
    }
  }, [isOpen]);

  // Update position on window resize/scroll
  useEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  // Outside click handler for both input and dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        (!dropdownMenuRef.current || !dropdownMenuRef.current.contains(target))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
      const scrollAmount = 100; // Adjust this value to control scroll speed
      optionsListRef.current.scrollBy({
        top: direction === "up" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const optionsList = optionsListRef.current;
    if (optionsList) {
      optionsList.addEventListener("scroll", handleScroll);
      return () => optionsList.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Add initial scroll check when dropdown opens
  useEffect(() => {
    if (isOpen && optionsListRef.current) {
      const { scrollHeight, clientHeight } = optionsListRef.current;
      const isScrollable = scrollHeight > clientHeight;

      setShowScrollArrows({
        up: false,
        down: isScrollable,
      });
    }
  }, [isOpen]);

  // Expose validation method
  useEffect(() => {
    if (validate) {
      const isValid = !required || selectedOptions.length > 0;
      validate(isValid);
    }
  }, [validate, required, selectedOptions]);

  // Handle form submission
  useEffect(() => {
    if (form && name) {
      const formElement = document.getElementById(form) as HTMLFormElement;
      if (formElement) {
        const handleSubmit = (e: Event) => {
          if (required && selectedOptions.length === 0) {
            e.preventDefault();
            setIsSubmitted(true);
            setValidationError("This field is required");
            onValidationChange?.(false);
            validate?.(false);
            return false;
          }
          setIsSubmitted(false);
          setValidationError("");
          onValidationChange?.(true);
          validate?.(true);
          return true;
        };

        formElement.addEventListener("submit", handleSubmit);
        return () => formElement.removeEventListener("submit", handleSubmit);
      }
    }
  }, [form, name, required, selectedOptions, onValidationChange, validate]);

  // Add validation on blur
  const handleBlur = () => {
    if (required && selectedOptions.length === 0) {
      setIsSubmitted(true);
      setValidationError("This field is required");
      onValidationChange?.(false);
      validate?.(false);
    }
  };

  // Only show validation error if form was submitted or field was blurred
  const showError = (isSubmitted || !isFocused) && validationError;

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: Option) => {
    if (isMulti) {
      const isSelected = selectedOptions.some((opt) => opt.id === option.id);
      let newSelectedOptions: Option[];

      if (isSelected) {
        newSelectedOptions = selectedOptions.filter(
          (opt) => opt.id !== option.id
        );
      } else {
        if (maxSelections && selectedOptions.length >= maxSelections) {
          return;
        }
        newSelectedOptions = [...selectedOptions, option];
      }

      setSelectedOptions(newSelectedOptions);
      onChange(newSelectedOptions.map((opt) => opt.id));

      // Validate after selection change
      if (required) {
        const isValid = newSelectedOptions.length > 0;
        setValidationError(isValid ? "" : "This field is required");
        onValidationChange?.(isValid);
      }
    } else {
      // For single select, toggle the selection
      const isSelected = selectedOptions.some((opt) => opt.id === option.id);
      if (isSelected) {
        setSelectedOptions([]);
        onChange([]);
        setSearchTerm("");

        // Validate after clearing
        if (required) {
          setValidationError("This field is required");
          onValidationChange?.(false);
        }
      } else {
        setSelectedOptions([option]);
        onChange([option.id]);
        setSearchTerm("");

        // Validate after selection
        if (required) {
          setValidationError("");
          onValidationChange?.(true);
        }
      }
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent, optionId?: string | number) => {
    e.stopPropagation();
    if (isMulti && optionId) {
      const newSelectedOptions = selectedOptions.filter(
        (opt) => opt.id !== optionId
      );
      setSelectedOptions(newSelectedOptions);
      onChange(newSelectedOptions.map((opt) => opt.id));

      // Validate after clearing
      if (required) {
        const isValid = newSelectedOptions.length > 0;
        setValidationError(isValid ? "" : "This field is required");
        onValidationChange?.(isValid);
      }
    } else {
      setSelectedOptions([]);
      onChange([]);
      setSearchTerm("");

      // Validate after clearing
      if (required) {
        setValidationError("This field is required");
        onValidationChange?.(false);
      }
    }
  };

  const inputStyle = `flex w-full ${rounded} border border-input text-inherit ring-offset-background file:border-0 file:text-xs file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus:outline-none focus:ring-2 focus-within:ring-ring focus-within:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all  ${
    WebHelper.isDarkColor(bg_color)
      ? "focus-within:bg-blue-500/30 hover:bg-blue-500/30"
      : "focus-within:bg-blue-50 hover:bg-blue-50"
  } `;
  const getBorderColor = () => {
    if (error || validationError)
      return "ring-2 ring-[tomato] border-[tomato] border"; // tomato
    if (isFocused)
      return `ring-2 ring-[${border_color.replace("border-", "")}]`; // use the same color as border
    return `${border_color} border`; // gray-200
  };

  const renderSelectedValue = () => {
    if (selectedOptions.length === 0) {
      return (
        <span className="text-gray-500  font-semibold">{placeholder}</span>
      );
    }

    if (isMulti) {
      return (
        <span className="text-blue-700 font-semibold">
          {selectedOptions.length} selected
        </span>
      );
    }

    return <span className={`${text_color}`}>{selectedOptions[0].name}</span>;
  };

  const scrollToSelectedOption = () => {
    if (!isMulti && selectedOptions.length > 0 && optionsListRef.current) {
      const selectedElement = optionsListRef.current.querySelector(
        '[data-selected="true"]'
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToSelectedOption();
      }, 0);
    }
  }, [isOpen]);

  // Helper to scroll down a little or to bottom
  const scrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (optionsListRef.current) {
      optionsListRef.current.scrollBy({
        top: 100,
        behavior: "smooth",
      });
      setTimeout(() => {
        handleScroll();
      }, 200);
    }
  };

  // Helper to scroll up a little or to top
  const scrollUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (optionsListRef.current) {
      optionsListRef.current.scrollBy({
        top: -100,
        behavior: "smooth",
      });
      setTimeout(() => {
        handleScroll();
      }, 200);
    }
  };

  // Helper to scroll to bottom
  const scrollToBottom = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (optionsListRef.current) {
      optionsListRef.current.scrollTo({
        top: optionsListRef.current.scrollHeight,
        behavior: "smooth",
      });
      setTimeout(() => {
        handleScroll();
      }, 200);
    }
  };

  // Helper to scroll to top
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (optionsListRef.current) {
      optionsListRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setTimeout(() => {
        handleScroll();
      }, 200);
    }
  };

  // The dropdown menu to be portaled
  const dropdownMenu = (
    <div
      ref={dropdownMenuRef}
      className={`absolute z-[99999] min-w-60 max-h-56 text-xs overflow-hidden right-0 top-0 w-full  ${
        WebHelper.isDarkColor(bg_color)
          ? "bg-black/90 text-white border-slate-600/50"
          : bg_color
      } border ${border_color} rounded-xl shadow-lg`}
      style={
        dropdownPosition
          ? {
              position: "absolute",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              right: "unset",
              minWidth: undefined,
            }
          : undefined
      }
    >
      {/* Only show search if more than 6 options */}
      {filteredOptions.length > 6 && (
        <div className="p-2 border-b border-gray-200">
          <SingleSearchInput
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md"
            onSearch={() => {}}
            searchState={{
              isValid: false,
              isNotFound: false,
              isLoading: false,
              message: "",
            }}
            bg_color={bg_color}
            border_color={border_color}
            text_color={text_color}
            accent_color={accent_color}
            height={"h-11"}
          />
        </div>
      )}
      <div className="relative">
        {showScrollArrows.up && (
          <div
            className={`absolute top-0 left-0 right-0 backdrop-blur-[2px] h-8 transition-all duration-200 bg-gradient-to-b ${
              WebHelper.isDarkColor(bg_color)
                ? "from-black/60 hover:bg-gray-500/60"
                : "from-white hover:bg-gray-50"
            } to-transparent z-10 flex items-center justify-center cursor-pointer`}
            onMouseDown={scrollUp}
            onDoubleClick={scrollToTop}
          >
            <ChevronUp size={24} className={accent_color} />
          </div>
        )}
        <div
          ref={optionsListRef}
          className="max-h-60 p-1 scrollbar-hide flex flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          onScroll={handleScroll}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                data-selected={selectedOptions.some(
                  (opt) => opt.id === option.id
                )}
                className={`p-1 px-2 scrollbar-hide flex justify-between gap-2 items-center text-inherit cursor-pointer rounded-md font-semibold ${text_color} ${
                  WebHelper.isDarkColor(bg_color)
                    ? "hover:bg-blue-500/60"
                    : "hover:bg-blue-200"
                } ${
                  selectedOptions.some((opt) => opt.id === option.id)
                    ? WebHelper.isDarkColor(bg_color)
                      ? "bg-gradient-to-br from-blue-500/40 to-blue-700/40 text-white"
                      : "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
                    : ""
                }`}
                onMouseDown={() => handleSelect(option)}
              >
                <div className="flex gap-2 items-center">
                  {option.avatar && (
                    <div className="w-10 h-10 pointer-events-none">
                      <UserAvatar src={option.avatar_url} name={option.name} />
                    </div>
                  )}
                  {option.icon && <option.icon fontSize={20} />}
                  <p className={`truncate text-[10px]`}>{option.name}</p>
                </div>
                <div className="flex gap-2 items-center h-full">
                  {selectedOptions.some((opt) => opt.id === option.id) && (
                    <FaCheck size={20} />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-center">
              No options found
            </div>
          )}
        </div>
        {showScrollArrows.down && (
          <div
            className={`absolute bottom-0 left-0 right-0 backdrop-blur-[2px] h-8 transition-all duration-200     bg-gradient-to-t to-transparent z-10 flex items-center justify-center cursor-pointer ${
              WebHelper.isDarkColor(bg_color)
                ? "from-black/60 hover:bg-gray-500/60"
                : "from-white hover:bg-gray-50"
            } `}
            onMouseDown={scrollDown}
            onDoubleClick={scrollToBottom}
          >
            <ChevronDownIcon className={accent_color} size={24} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full flex flex-col gap-0.5"
      ref={dropdownRef}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={(e) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.relatedTarget as Node)
        ) {
          setTimeout(() => {
            setIsFocused(false);
            setIsOpen(false);
            handleBlur();
          }, 100);
        }
      }}
      tabIndex={-1}
    >
      {label && (
        <label
          className={`text-[11px] font-semibold tracking-wide ${
            showError ? "text-[tomato]" : text_color
          }`}
          htmlFor={name}
        >
          {label} {required && <span className="text-[tomato] ml-1">*</span>}
        </label>
      )}
      {isLoading ? (
        <div
          className={`relative ${height} w-full ${inputStyle} ${getBorderColor()} border ${bg_color} flex items-center justify-between px-3 ${className} bg-gray-200 animate-pulse`}
        >
          {/* <div className="w-full h-6 rounded bg-gray-200 animate-pulse" /> */}
        </div>
      ) : (
        <>
          <div
            className={`relative ${height} w-full ${inputStyle} ${getBorderColor()} border ${bg_color} flex items-center justify-between px-3 cursor-pointer ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) {
                setIsOpen(!isOpen);
                setIsFocused(true);
              }
            }}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={name ? `${name}-listbox` : undefined}
            aria-required={required}
            aria-invalid={!!showError}
          >
            <div className="flex-1 truncate text-[11px]">
              {renderSelectedValue()}
            </div>
            <div className="flex items-center gap-2">
              {/* {selectedOptions.length > 0 && !disabled && isMulti && (
            <div className="flex items-center gap-2 h-10 w-10 bg">
              <button
                onClick={(e) => handleClear(e)}
                className="p-1 cursor-pointer bg-gray-100 rounded-full"
              >
                <IoClose size={20} className={accent_color} />
              </button>
            </div>
          )} */}
              <IoChevronDown
                size={18}
                className={`${accent_color} transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </>
      )}

      {/* Hidden input for form submission */}
      {required && (
        <input
          type="hidden"
          name={name}
          value={
            selectedOptions.length > 0
              ? selectedOptions.map((opt) => opt.id).join(",")
              : ""
          }
          form={form}
          required={required}
          aria-required={required}
          aria-invalid={!!showError}
        />
      )}

      {showError && (
        <p
          className="text-[10px] text-[tomato] font-semibold  tracking-wide"
          role="alert"
        >
          {validationError}
        </p>
      )}

      {isOpen && dropdownPosition && typeof window !== "undefined"
        ? ReactDOM.createPortal(dropdownMenu, document.body)
        : null}
    </div>
  );
};

export default SearchSelect;
