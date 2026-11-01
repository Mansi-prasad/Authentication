import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#042F2E]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-[#2DD4BF] rounded-full animate-spin"></div>

        <p className="text-white text-sm font-medium tracking-wide">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default Loading;
