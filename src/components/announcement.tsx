import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useUiStore } from "@/stores/uiStore";

const Announcement: React.FC = () => {
  const { announcement, hideAnnouncement } = useUiStore();

  return (
    <AnimatePresence>
      {announcement.isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
        >
          <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 flex items-center">
              <InformationCircleIcon className="h-6 w-6 text-green-300 mr-3 flex-shrink-0" />
              <p className="text-green-100 font-medium flex-grow">
                {announcement.message}
              </p>
              <button
                onClick={hideAnnouncement}
                className="ml-3 text-green-300 hover:text-green-100 transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5 }}
              className="h-1 bg-green-300 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Announcement;
