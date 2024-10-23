"use client";
import { DynamicGlowingTime } from "./glowingTime";

export default function TimeSection() {
  return (
    <section
      className="bg-[#111411] border-[#03B500] border p-4"
      style={{
        clipPath: "polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 18%)",
      }}
    >
      <p className="text-white text-center text-2xl mb-2">
        Guess the correct crypto personality and win rewards!
      </p>
      {<DynamicGlowingTime />}
    </section>
  );
}
