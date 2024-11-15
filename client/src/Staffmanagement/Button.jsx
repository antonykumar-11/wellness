import React from "react";

export const Button = ({ onClick, children, variant = "default" }) => {
  const baseStyle = "px-4 py-2 rounded-md text-white font-semibold";
  const variantStyle =
    variant === "outline"
      ? "bg-transparent border border-gray-300"
      : "bg-blue-500";

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} hover:bg-blue-600 focus:outline-none`}
    >
      {children}
    </button>
  );
};
