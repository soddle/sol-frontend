import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZapOff, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import CyberpunkEmptyState from "@/app/(activityPages)/leaderboard/_components/cyberpunkEmptyState";

const CyberpunkTable = ({
  data,
  headers,
  isLoading,
}: {
  data: any;
  headers: any;
  isLoading: boolean;
}) => {
  const [hoveredCell, setHoveredCell] = React.useState<string | null>(null);
  const [scanLine, setScanLine] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [showFullContent, setShowFullContent] = React.useState<string | null>(
    null
  );

  // Adjusted items per page based on screen size
  const itemsPerPage = React.useMemo(() => {
    if (isMobile) return 5;
    if (window.innerWidth < 1024) return 6;
    return 7;
  }, [isMobile]);

  // Enhanced mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Reset current page when screen size changes to prevent empty pages
      setCurrentPage(0);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const processData = (guessData: any) => {
    if (!guessData?.length) return [];
    return guessData.map((guess: any) => {
      const row = [];
      row.push({
        value: guess.guessedKOL.pfp,
        feedback: guess.guessedKOL.pfp,
        type: "pfp",
      });
      const fieldsToInclude = [
        "country",
        "ageRange",
        "twitterAccountCreationYear",
        "twitterFollowersRange",
        "pfpType",
        "ecosystem",
      ];
      fieldsToInclude.forEach((field) => {
        row.push({
          value: guess.guessedKOL[field],
          feedback: guess.feedback[field],
          type: "text",
        });
      });
      return row;
    });
  };

  const processedData = React.useMemo(() => processData(data), [data]);
  const totalPages = Math.ceil((processedData?.length || 0) / itemsPerPage);
  const currentData = processedData?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(true);
      setTimeout(() => setScanLine(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <TableLoader headers={headers} isMobile={isMobile} />;

  if (!processedData?.length) {
    return <CyberpunkEmptyState />;
  }

  return (
    <div className="w-full max-w-full lg:max-w-[900px] mx-auto relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 via-emerald-300/30 to-green-500/30 opacity-75 blur group-hover:opacity-100 transition duration-1000" />

      <div className="relative bg-[#111411] p-2 md:p-4 overflow-hidden">
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

        <AnimatePresence>
          {scanLine && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "linear" }}
              className="absolute top-0 left-0 w-1 h-full bg-green-500/50 z-20 mix-blend-overlay"
            />
          )}
        </AnimatePresence>

        <div className="absolute top-0 left-0 w-4 md:w-6 h-4 md:h-6 border-l-2 border-t-2 border-green-500/50" />
        <div className="absolute top-0 right-0 w-4 md:w-6 h-4 md:h-6 border-r-2 border-t-2 border-green-500/50" />
        <div className="absolute bottom-0 left-0 w-4 md:w-6 h-4 md:h-6 border-l-2 border-b-2 border-green-500/50" />
        <div className="absolute bottom-0 right-0 w-4 md:w-6 h-4 md:h-6 border-r-2 border-b-2 border-green-500/50" />

        <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-500/20">
          <div className="min-w-[320px] md:min-w-[640px]">
            <div
              className="grid gap-px"
              style={{
                gridTemplateColumns: `repeat(${headers.length}, minmax(${
                  isMobile ? "60px" : "80px"
                }, 1fr))`,
              }}
            >
              {headers.map((header: any, idx: number) => (
                <HeaderCell key={idx} isMobile={isMobile}>
                  {header}
                </HeaderCell>
              ))}

              {currentData.map((row: any, rowIndex: number) => (
                <React.Fragment key={rowIndex}>
                  {row.map((cell: any, cellIndex: number) => (
                    <DataCell
                      key={`${rowIndex}-${cellIndex}`}
                      value={cell.value}
                      isHovered={hoveredCell === `${rowIndex}-${cellIndex}`}
                      onHover={() => setHoveredCell(`${rowIndex}-${cellIndex}`)}
                      onLeave={() => setHoveredCell(null)}
                      feedback={cell.feedback}
                      isPfp={cell.type === "pfp"}
                      isMobile={isMobile}
                      isExpanded={
                        showFullContent === `${rowIndex}-${cellIndex}`
                      }
                      onToggleExpand={() => {
                        setShowFullContent(
                          showFullContent === `${rowIndex}-${cellIndex}`
                            ? null
                            : `${rowIndex}-${cellIndex}`
                        );
                      }}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 md:gap-4 mt-2 md:mt-4 text-green-500">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-1 disabled:opacity-50 hover:text-green-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <span className="font-mono text-sm md:text-base">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="p-1 disabled:opacity-50 hover:text-green-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const HeaderCell = ({
  children,
  isMobile,
}: {
  children: React.ReactNode;
  isMobile: boolean;
}) => (
  <motion.div
    className={`p-1 md:p-3 text-green-400 font-bold ${
      isMobile ? "text-xs" : "text-sm"
    } relative overflow-hidden`}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="truncate">{children}</div>
    <motion.div
      className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    />
  </motion.div>
);

const DataCell = ({
  value,
  isHovered,
  onHover,
  onLeave,
  feedback,
  isPfp,
  isMobile,
  isExpanded,
  onToggleExpand,
}: {
  value: any;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  feedback: any;
  isPfp: boolean;
  isMobile: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  const getBackgroundColor = () => {
    switch (feedback) {
      case "correct":
        return "bg-green-500/20";
      case "incorrect":
      case "higher":
      case "lower":
        return "bg-red-500/20";
      case "partially_correct":
        return "bg-yellow-500/20";
      default:
        return "";
    }
  };

  return (
    <motion.div
      className={`relative p-1 md:p-2 border border-green-500/20 m-px overflow-hidden group ${getBackgroundColor()}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: isMobile ? 1 : 1.02, zIndex: 10 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={!isPfp ? onToggleExpand : undefined}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative z-10 flex items-center justify-center">
        {isPfp ? (
          <div
            className={`relative ${
              isMobile ? "w-6 h-6" : "w-8 h-8 md:w-10 md:h-10"
            } rounded-full overflow-hidden group-hover:ring-2 ring-green-500 transition-all`}
          >
            <Image
              src={value}
              alt="Profile"
              layout="fill"
              objectFit="cover"
              className="transform group-hover:scale-110 transition-transform"
            />
          </div>
        ) : (
          <motion.div
            className={`text-white/90 ${isMobile ? "text-xs" : "text-sm"} ${
              isExpanded ? "" : "truncate"
            } max-w-full px-1`}
            animate={
              isHovered
                ? {
                    color: "#4ade80",
                    textShadow: "0 0 8px rgba(74, 222, 128, 0.5)",
                  }
                : {}
            }
          >
            {value}
          </motion.div>
        )}
      </div>

      {feedback === "higher" && (
        <div className="absolute top-0 right-1 text-red-500 text-xs">↑</div>
      )}
      {feedback === "lower" && (
        <div className="absolute top-0 right-1 text-red-500 text-xs">↓</div>
      )}
    </motion.div>
  );
};

const TableLoader = ({
  headers,
  isMobile,
}: {
  headers: any;
  isMobile: boolean;
}) => (
  <div className="w-full max-w-full lg:max-w-[900px] mx-auto relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 via-emerald-300/20 to-green-500/20 opacity-75 blur animate-pulse" />
    <div className="relative bg-[#111411] p-2 md:p-4 overflow-x-auto">
      <div className="min-w-[320px] md:min-w-[640px]">
        <div
          className="grid gap-px"
          style={{
            gridTemplateColumns: `repeat(${headers.length}, minmax(${
              isMobile ? "60px" : "80px"
            }, 1fr))`,
          }}
        >
          {headers.map((_: any, idx: number) => (
            <motion.div
              key={idx}
              className="p-1 md:p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="h-3 md:h-4 bg-green-500/20 rounded animate-pulse" />
            </motion.div>
          ))}

          {[...Array(isMobile ? 5 : 7)].map((_, rowIdx) =>
            [...Array(headers.length)].map((_, cellIdx) => (
              <motion.div
                key={`${rowIdx}-${cellIdx}`}
                className="p-1 md:p-2 border border-green-500/10 m-px"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: (rowIdx * headers.length + cellIdx) * 0.03,
                }}
              >
                <div className="h-4 md:h-6 lg:h-8 bg-green-500/10 rounded">
                  <motion.div
                    className="h-full w-full bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: (rowIdx * headers.length + cellIdx) * 0.1,
                    }}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <motion.div
          className="flex items-center gap-1 md:gap-2 text-green-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Loader2 className="w-4 h-4 md:w-6 md:h-6 animate-spin" />
          <span className="font-mono text-xs md:text-sm lg:text-base">
            Loading data...
          </span>
        </motion.div>
      </div>
    </div>
  </div>
);

export default CyberpunkTable;
