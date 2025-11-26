import React, { useState } from "react";
import RadioSwitchInput from "./RadioSwitchInput";

interface Option {
  id: string;
  icon: React.ReactNode;
  head: string;
  disabled?: boolean;
}

interface RadioSwitchGroupProps {
  options: Option[];
  onChange: (selectedId: string) => void;
  defaultSelectedId?: string;
}

const RadioSwitchGroup: React.FC<RadioSwitchGroupProps> = ({
  options,
  onChange,
  defaultSelectedId,
}) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    defaultSelectedId
  );

  const handleChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedId(id);
      onChange(id);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {options.map((option) => (
        <RadioSwitchInput
          key={option.id}
          icon={option.icon}
          head={option.head}
          checked={selectedId === option.id}
          onChange={(checked) => handleChange(option.id, checked)}
          disabled={option.disabled}
          onClick={() => handleChange(option.id, true)}
        />
      ))}
    </div>
  );
};

export default RadioSwitchGroup;
