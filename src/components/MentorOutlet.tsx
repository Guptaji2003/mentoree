"use client";

import React from "react";

interface MentorOutletProps {
  children?: React.ReactNode;
}

/**
 * MentorOutlet component provides a structured, responsive container
 * for nested sub-routes inside the Mentor Portal dashboard layout.
 */
export const MentorOutlet: React.FC<MentorOutletProps> = ({ children }) => {
  return (
    <div className="w-full flex-1 flex flex-col min-w-0 transition-all duration-200">
      {children}
    </div>
  );
};

export default MentorOutlet;
