"use client";

import { motion } from "motion/react";

export default function Button({ children, className, onClick, ...props }) {
    return (
        <motion.button
            whileTap={{ scale: 0.84}}
            transition={{ duration: 0.01, ease: [0.22, 1, 0.36, 1] }} //easeOutQuint
            className={className}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    );
}