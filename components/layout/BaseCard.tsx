import React from "react";

interface BaseCardProps {
  title: string;
  className?: string;
  headerClassName?: string;
  children: React.ReactNode;
  optionalLabel?: React.ReactNode;
}

const BaseCard: React.FC<BaseCardProps> = ({
  title,
  className = "",
  headerClassName = "",
  optionalLabel,
  children,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden`}>
      <div
        className={`bg-blue-600 flex justify-between items-center text-white px-4 py-2 text-sm font-semibold whitespace-nowrap ${headerClassName}`}
      >
        <span>{title}</span>
        {optionalLabel && <span className="ml-2">{optionalLabel}</span>}
      </div>
      <div className={`flex flex-col gap-2  ${className}`}>{children}</div>
    </div>
  );
};

export default BaseCard;
