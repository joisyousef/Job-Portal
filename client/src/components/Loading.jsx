import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      <p className="text-gray-500 text-lg mt-4"></p>
    </div>
  );
};
export default Loading;
