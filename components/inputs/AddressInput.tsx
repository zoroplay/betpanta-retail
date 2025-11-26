import React, { useState, useEffect, useRef } from "react";
import Input, { InvalidHandler } from "./Input";
import { cn } from "@/lib/utils";
import { MapPin, Map } from "lucide-react";
import { PiMapPinArea, PiMapPinAreaBold } from "react-icons/pi";
import { WebHelper } from "@/lib/helpers";
import dynamic from "next/dynamic";
import { useTheme } from "../providers/ThemeProvider";
import SingleSearchInput from "./SingleSearchInput";

const GoogleMap = dynamic(() => import("@/components/maps/GoogleMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-white/10 rounded-lg flex items-center justify-center">
      <div className="text-center text-white">
        <Map size={48} className="mx-auto mb-4" />
        <h4 className="text-lg font-semibold mb-2">Loading Map...</h4>
      </div>
    </div>
  ),
});

interface AddressInputProps {
  index: number;
  className?: string;
  label?: string;
  address: {
    street?: string;
    building?: string;
    apartment?: string;
    district?: string;
    landmark?: string;
    instruction_enter_building?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    direction_url?: string;
  };
  card_color?: string;
  input_bg?: string;
  input_text?: string;
  map_height?: string;
  optionalLabel?: React.ReactElement;
  border_color?: string;
  bg_color?: string;
  text_color?: string;
  onChange: ({
    index,
    field,
    value,
  }: {
    index: number;
    field: string;
    value: string | number;
  }) => void;
  disabled?: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({
  index,
  address,
  label = "Address Details",
  className,
  onChange,
  card_color = "bg-[#2a3c52]",
  input_bg = "bg-[#496684]",
  input_text,
  optionalLabel,
  map_height = "h-[400px]",
  disabled = false,
  border_color = "border-gray-300",
  bg_color = "bg-white",
  text_color = "text-gray-700",
}) => {
  const [mapMode, setMapMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [addresses, setAddresses] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const { theme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Initialize Google Places services when Google Maps is available
  useEffect(() => {
    const initPlacesServices = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        placesService.current = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );
      }
    };

    // Try to initialize immediately
    initPlacesServices();

    // Also set up an interval to check periodically
    const interval = setInterval(initPlacesServices, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get array of visible input fields - only include fields that exist in the address prop
  const visibleFields = Object.entries(address || {})
    .filter(([key, value]) => {
      // Exclude coordinates and direction_url from visible fields
      return (
        !["latitude", "longitude", "direction_url"].includes(key) &&
        value !== undefined
      );
    })
    .map(([key, value]) => ({
      key,
      value: value as string,
    }))
    .sort((a, b) => {
      // Ensure street is always first
      if (a.key === "street") return -1;
      if (b.key === "street") return 1;
      return 0;
    });

  // Store the original field keys to know which fields to update
  const originalFieldKeys = new Set(visibleFields.map((field) => field.key));

  const totalVisibleFields = visibleFields.length;
  const isOddInputs = totalVisibleFields % 2 !== 0;

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length > 3) {
        setDebouncedQuery(query);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  // Handle search results
  useEffect(() => {
    if (debouncedQuery && autocompleteService.current) {
      setLoading(true);
      autocompleteService.current.getPlacePredictions(
        {
          input: debouncedQuery,
          types: ["address"],
        },
        (predictions, status) => {
          setLoading(false);
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setAddresses(predictions);
            setShowDropdown(true);
          } else {
            setAddresses([]);
            setShowDropdown(false);
          }
        }
      );
    }
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPlaceDetails = (placeId: string) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId,
        fields: ["address_components", "formatted_address", "geometry", "name"],
      },
      (place, status) => {
        console.log("place", place);
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const addressComponents = place.address_components || [];
          const details = {
            formatted: place.formatted_address || "",
            street: "",
            building: "",
            apartment: "",
            district: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            landmark: "",
            instruction_enter_building: "",
          };

          addressComponents.forEach((component) => {
            const types = component.types;
            if (types.includes("street_number")) {
              details.street = component.long_name;
            }
            if (types.includes("route")) {
              details.street = details.street
                ? `${details.street} ${component.long_name}`
                : component.long_name;
            }
            if (types.includes("premise")) {
              details.building = component.long_name;
            }
            if (types.includes("subpremise")) {
              details.apartment = component.long_name;
            }
            if (
              types.includes("sublocality_level_1") ||
              types.includes("sublocality")
            ) {
              details.district = component.long_name;
            }
            if (types.includes("locality") || types.includes("postal_town")) {
              details.city = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) {
              details.state = component.long_name;
            }
            if (types.includes("postal_code")) {
              details.postalCode = component.long_name;
            }
            if (types.includes("country")) {
              details.country = component.long_name;
            }
            if (types.includes("point_of_interest")) {
              details.landmark = component.long_name;
            }
          });

          handleLocationSelect({
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
            address: details,
          });
        }
      }
    );
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: {
      formatted: string;
      street: string;
      building: string;
      apartment: string;
      district: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      landmark: string;
      instruction_enter_building: string;
    };
  }) => {
    setLoading(true);
    setError(null);
    setShowDropdown(false);

    try {
      // Create a single update object with all address fields
      const updates = {
        latitude: location.lat,
        longitude: location.lng,
        direction_url: `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
        street: location.address.street || "",
        building: location.address.building || "",
        apartment: location.address.apartment || "",
        district: location.address.district || "",
        city: location.address.city || "",
        state: location.address.state || "",
        postal_code: location.address.postalCode || "",
        country: location.address.country || "",
        landmark: location.address.landmark || "",
        instruction_enter_building:
          location.address.instruction_enter_building || "",
      };

      // Only update fields that were originally passed to the component
      Object.entries(updates).forEach(([field, value]) => {
        if (
          field === "latitude" ||
          field === "longitude" ||
          field === "direction_url" ||
          originalFieldKeys.has(field)
        ) {
          onChange({ index, field, value });
        }
      });
    } catch (err) {
      setError("Failed to update address fields");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle validation on blur
  const handleBlur = () => {
    if (hiddenInputRef.current) {
      const isValid = hiddenInputRef.current.checkValidity();
      if (!isValid) {
        setError("Please fill in all required fields");
      } else {
        setError(null);
      }
    }
  };

  const handleInvalid: InvalidHandler = (e) => {
    e.preventDefault();
    // Cast to HTMLInputElement to access validationMessage
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setError("Please select an address");
  };

  return (
    <div className={`${card_color} p-2 rounded-md flex flex-col gap-6`}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center w-full gap-2">
          <div className="flex flex-col justify-start items-start gap-2">
            {label && (
              <h4 className={`${input_text} font-semibold text-xl`}>{label}</h4>
            )}
            {optionalLabel && optionalLabel}
          </div>
          {/* View Mode Toggle */}
          <button
            type="button"
            onClick={() => setMapMode(!mapMode)}
            className={`flex group cursor-pointer h-8 items-center border gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
              mapMode
                ? `${
                    WebHelper.isDarkColor(
                      bg_color
                        .replace("bg-[", "")
                        .replace("]", "")
                        .replace("bg-", "")
                    )
                      ? "border-gray-400 bg-blue-500 text-white"
                      : "border-blue-600 bg-blue-600 text-white"
                  } `
                : `border ${
                    WebHelper.isDarkColor(
                      bg_color
                        .replace("bg-[", "")
                        .replace("]", "")
                        .replace("bg-", "")
                    )
                      ? "border-gray-600 text-gray-300"
                      : "border-gray-600 text-[#5c606e]"
                  }`
            }`}
          >
            <PiMapPinAreaBold size={18} />
            <span className="text-xs font-semibold tracking-wider transition-all duration-300">
              {mapMode ? "Enter Address Manually" : "Pick location on map"}
            </span>
          </button>
        </div>
      </div>

      {!mapMode ? (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
          {visibleFields.map((field, idx) => {
            const isLastInput = idx === totalVisibleFields - 1;
            const shouldSpanTwo = isOddInputs && isLastInput;

            if (field.key === "street") {
              return (
                <div
                  key={field.key}
                  ref={dropdownRef}
                  className={cn(
                    "relative",
                    shouldSpanTwo ? "md:col-span-2" : ""
                  )}
                >
                  <SingleSearchInput
                    placeholder={getPlaceholder(field.key)}
                    label={`${getLabel(field.key)}`}
                    value={field.value || ""}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      onChange({
                        index,
                        field: field.key,
                        value: e.target.value,
                      });
                    }}
                    className={`${input_bg} border-[${input_bg
                      .replace("bg-[", "")
                      .replace("]", "")}] w-full`}
                    name={`${field.key}-${index}`}
                    required
                    bg_color={bg_color}
                    border_color={border_color}
                    text_color={text_color}
                    onSearch={() => {}}
                    searchState={{
                      isValid: false,
                      isNotFound: false,
                      isLoading: loading,
                      message: "",
                    }}
                  />
                  {/* {loading && (
                    <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                      <div className="progress w-full h-full bg-slate-500 left-right" />
                    </div>
                  )} */}
                  {showDropdown && addresses.length > 0 && (
                    <div
                      className={`absolute z-[800] top-[6rem] gap-2 left-0 max-h-[34rem] min-w-[18rem] w-full max-w-[24rem] border overflow-y-auto  shadow-md rounded-lg flex flex-col justify-center items-start p-2 ${
                        theme === "dark"
                          ? "bg-black/50 backdrop-blur-lg border-gray-700/50 text-gray-300"
                          : "bg-white text-gray-700 border-[#e6e6e6] "
                      }`}
                    >
                      {addresses.map((place) => (
                        <div
                          key={place.place_id}
                          onClick={() => {
                            setShowDropdown(false);
                            getPlaceDetails(place.place_id);
                          }}
                          className={`${
                            theme === "dark"
                              ? "hover:bg-blue-600/10"
                              : "hover:bg-blue-200"
                          } rounded-md text-sm cursor-pointer p-2 px-4 w-full`}
                        >
                          {place.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={field.key}
                className={shouldSpanTwo ? "md:col-span-2" : ""}
              >
                <Input
                  placeholder={getPlaceholder(field.key)}
                  label={getLabel(field.key)}
                  value={field.value || ""}
                  onChange={(e) =>
                    onChange({ index, field: field.key, value: e.target.value })
                  }
                  className={`${input_bg} border-[${input_bg
                    .replace("bg-[", "")
                    .replace("]", "")}] w-full`}
                  name={`${field.key}-${index}`}
                  disabled={disabled}
                  bg_color={bg_color}
                  border_color={border_color}
                  text_color={text_color}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="min-h-[200px] bg-white/10 rounded-lg overflow-hidden">
          <div className="hidden">
            <input
              ref={hiddenInputRef}
              required
              type="text"
              value={address.street && address.country ? "valid" : ""}
              onBlur={handleBlur}
              onInvalid={handleInvalid}
              disabled={disabled}
            />
          </div>
          <div
            className={`overflow-hidden ${
              error ? "h-6" : "h-0"
            } transition-all duration-200`}
          >
            <p
              className={`text-sm font-semibold tracking-wider text-[tomato] transition-all ${
                error ? "opacity-100" : "opacity-0"
              }`}
            >
              {error}
            </p>
          </div>
          <GoogleMap
            onLocationSelect={handleLocationSelect}
            initialLocation={
              address.latitude && address.longitude
                ? { lat: address.latitude, lng: address.longitude }
                : undefined
            }
            loading={loading}
            enableSearch={true}
            error={error}
            height={map_height}
            bg_color={bg_color}
            border_color={border_color}
            text_color={text_color}
          />
        </div>
      )}
    </div>
  );
};

// Helper functions for input labels and placeholders
const getPlaceholder = (key: string): string => {
  const placeholders: Record<string, string> = {
    street: "Street",
    building: "Building",
    apartment: "Apartment/Suite",
    district: "District",
    city: "City",
    state: "State/Province",
    postal_code: "Postal Code",
    country: "Country",
    landmark: "Landmark (Optional)",
    instruction_enter_building: "Entry Instructions (Optional)",
  };
  return placeholders[key] || key;
};

const getLabel = (key: string): string => {
  const labels: Record<string, string> = {
    street: "Street",
    building: "Building",
    apartment: "Apartment/Suite",
    district: "District",
    city: "City",
    state: "State/Province",
    postal_code: "Postal Code",
    country: "Country",
    landmark: "Landmark",
    instruction_enter_building: "Entry Instructions",
  };
  return labels[key] || key;
};

export default AddressInput;
