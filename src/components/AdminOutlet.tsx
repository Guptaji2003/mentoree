"use client";

import React from "react";

interface AdminOutletProps {
  children?: React.ReactNode;
}

/**
 * AdminOutlet component provides a structured, responsive container
 * for nested sub-routes inside the Admin Portal dashboard layout.
 */
export const AdminOutlet: React.FC<AdminOutletProps> = ({ children }) => {
  return (
    <div className="w-full flex-1 flex flex-col min-w-0 transition-all duration-200">
      {children}
    </div>
  );
};

export default AdminOutlet;
