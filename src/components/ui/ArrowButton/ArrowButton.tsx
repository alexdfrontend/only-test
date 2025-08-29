import React from "react";
import styles from "./ArrowButton.module.scss";

interface Props {
    direction: "next" | "prev";
    onClick: () => void;
    disabled?: boolean;
}

const ArrowButton: React.FC<Props> = ({
    direction = "next",
    onClick,
    disabled = false,
}) => {
    return (
        <button
            className={`${styles.button} ${styles[direction]}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={`${
                direction === "next" ? "Next slide" : "Previous slide"
            }`}
        >
            <svg className={styles.icon} viewBox="0 0 24 24">
                {direction === "next" ? (
                    <path d="M8.59,16.59L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.59Z" />
                ) : (
                    <path d="M15.41,16.59L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.59Z" />
                )}
            </svg>
        </button>
    );
};

export default ArrowButton;
