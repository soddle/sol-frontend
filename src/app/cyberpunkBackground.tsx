"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CyberpunkBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Original background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/backgrounds/background_darkened_2.png')",
        }}
      />

      {/* Animated cyber grid overlay */}
      {/* <motion.div
        className="fixed inset-0 opacity-20 z-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(3, 181, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(3, 181, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      /> */}

      {/* Glowing particles effect */}
      <motion.div
        className="fixed inset-0 z-20 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle, rgba(3,181,0,0.2) 0%, rgba(3,181,0,0) 50%)",
            "radial-gradient(circle, rgba(3,181,0,0.3) 0%, rgba(3,181,0,0) 40%)",
            "radial-gradient(circle, rgba(3,181,0,0.2) 0%, rgba(3,181,0,0) 50%)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Interactive light beam */}
      {/* <motion.div
        className="fixed w-[200px] h-[200px] rounded-full z-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(3,181,0,0.2) 0%, rgba(3,181,0,0) 70%)",
          boxShadow: "0 0 20px rgba(3,181,0,0.3)",
        }}
        animate={{
          x: mousePosition.x - 100,
          y: mousePosition.y - 100,
        }}
      /> */}

      {/* Scanning line effect */}
      <motion.div
        className="fixed inset-0 z-40 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-full h-1 bg-gradient-to-r from-transparent via-[#03B500] to-transparent"
          animate={{
            y: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Random glitch effects */}
      {/* {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="fixed inset-0 bg-[#03B500] mix-blend-screen z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: Math.random() * 10,
          }}
        />
      ))} */}
    </>
  );
};

export default CyberpunkBackground;
