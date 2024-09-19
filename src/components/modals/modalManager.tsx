"use client";
import React from "react";
import { useUIStore } from "@/components/providers/storesProvider";
import CustomModal from "@/components/modals/customModal";

const ModalManager: React.FC = () => {
  const activeModal = useUIStore((state) => state.activeModal);
  const closeModal = useUIStore((state) => state.closeModal);

  if (!activeModal) return null;

  const ModalContent = activeModal.component;

  return (
    <CustomModal isOpen={!!activeModal} onClose={closeModal}>
      <ModalContent {...activeModal.props} onClose={closeModal} />
    </CustomModal>
  );
};

export default ModalManager;
