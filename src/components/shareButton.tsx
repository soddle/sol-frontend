import React from "react";
import styles from "./ShareButton.module.css";

export const ShareButton: React.FC = () => {
  return (
    <div className={styles.shareButtonContainer}>
      <button className={styles.shareButton} disabled>
        <div className={styles.overlay}></div>
        Share on X
      </button>
    </div>
  );
};
