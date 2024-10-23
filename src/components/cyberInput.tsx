import React, { forwardRef } from "react";
import { motion } from "framer-motion";

interface CyberpunkInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  success?: boolean;
}

const CyberpunkInput = forwardRef<HTMLInputElement, CyberpunkInputProps>(
  ({ icon, error, success, className = "", ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {/* Animated background gradient */}
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-green-500/50 via-emerald-300/50 to-green-500/50 opacity-75 
                     group-hover:opacity-100 group-focus-within:opacity-100 blur-sm transition duration-300"
          animate={{
            background: [
              "linear-gradient(90deg, rgba(34,197,94,0.5), rgba(16,185,129,0.5), rgba(34,197,94,0.5))",
              "linear-gradient(180deg, rgba(34,197,94,0.5), rgba(16,185,129,0.5), rgba(34,197,94,0.5))",
              "linear-gradient(270deg, rgba(34,197,94,0.5), rgba(16,185,129,0.5), rgba(34,197,94,0.5))",
              "linear-gradient(0deg, rgba(34,197,94,0.5), rgba(16,185,129,0.5), rgba(34,197,94,0.5))",
              "linear-gradient(90deg, rgba(34,197,94,0.5), rgba(16,185,129,0.5), rgba(34,197,94,0.5))",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative">
          {/* Main input container */}
          <div
            className={`
              relative bg-[#111411] 
              border border-green-500/30
              transition-all duration-300
              group-hover:border-green-400/50
              group-focus-within:border-green-400
              ${error ? "border-red-500/50" : ""}
              ${success ? "border-green-400" : ""}
              ${className}
            `}
            style={{
              clipPath:
                "polygon(1rem 0, calc(100% - 1rem) 0, 100% 50%, calc(100% - 1rem) 100%, 1rem 100%, 0 50%)",
            }}
          >
            {/* Cyber grid background */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(#03B500 1px, transparent 1px), linear-gradient(90deg, #03B500 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            {/* Input wrapper */}
            <div className="relative flex items-center">
              {icon && (
                <div className="absolute left-3 flex items-center justify-center text-green-500">
                  {icon}
                </div>
              )}

              <input
                ref={ref}
                className={`
                  w-full bg-transparent px-4 py-3
                  ${icon ? "pl-10" : ""}
                  text-white placeholder-green-500/50
                  focus:outline-none focus:ring-0
                  transition-colors duration-300
                `}
                {...props}
              />

              {/* Animated focus lines */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-green-500/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 top-full mt-1 text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}

          {/* Corner decorations */}
          <div className="absolute top-0 left-4 w-2 h-2 border-l-2 border-t-2 border-green-500/50 group-hover:border-green-400 transition-colors duration-300" />
          <div className="absolute top-0 right-4 w-2 h-2 border-r-2 border-t-2 border-green-500/50 group-hover:border-green-400 transition-colors duration-300" />
          <div className="absolute bottom-0 left-4 w-2 h-2 border-l-2 border-b-2 border-green-500/50 group-hover:border-green-400 transition-colors duration-300" />
          <div className="absolute bottom-0 right-4 w-2 h-2 border-r-2 border-b-2 border-green-500/50 group-hover:border-green-400 transition-colors duration-300" />
        </div>
      </div>
    );
  }
);

CyberpunkInput.displayName = "CyberpunkInput";

export default CyberpunkInput;
