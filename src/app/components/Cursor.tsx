"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type CursorState = "default" | "hover" | "click";

export default function Cursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [cursorState, setCursorState] = useState<CursorState>("default");

    useEffect(() => {
        const move = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };
        const hide = () => setIsVisible(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("a, button, .button, [data-clickable]")) {
                setCursorState("hover");
            }
        };

        const handleMouseDown = () => setCursorState("click");
        const handleMouseUp = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("a, button, .button, [data-clickable]")) {
                setCursorState("hover");
            } else {
                setCursorState("default");
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("a, button, .button, [data-clickable]")) {
                setCursorState("default");
            }
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseleave", hide);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseleave", hide);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            <style>{`* { cursor: none !important; }`}</style>
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[999]"
                style={{ x: position.x, y: position.y }}
            >
                {cursorState === "default" && (
                    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_136_221)">
                            <path
                                d="M0 0.37L0.24 12.17C0.24 12.62 0.43 13.04 0.74 13.36L23.33 35.95C24 36.62 25.1 36.62 25.77 35.95L35.94 25.78C36.61 25.11 36.61 24.01 35.94 23.34L13.35 0.74C13.03 0.42 12.61 0.24 12.16 0.24L0.37 0C0.16 0 0 0.16 0 0.37Z"
                                fill="black"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_136_221">
                                <rect width="36.45" height="36.45" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>

                )}

                {(cursorState === "hover" || cursorState === "click") && (
                    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_136_213)">
                            <path
                                d="M24.55 35.84C24.39 35.84 24.23 35.78 24.12 35.66L1.41001 12.96C1.14001 12.69 0.99001 12.33 0.98001 11.95L0.76001 0.76001L11.95 0.98001C12.33 0.98001 12.69 1.14001 12.96 1.41001L35.66 24.12C35.9 24.36 35.9 24.75 35.66 24.99L24.98 35.67C24.86 35.79 24.71 35.85 24.55 35.85V35.84Z"
                                fill="white"/>
                            <path
                                d="M1.52 1.52L11.93 1.73C12.12 1.73 12.29 1.81 12.42 1.94L35.03 24.55L24.54 35.04L1.94 12.43C1.81 12.3 1.73 12.12 1.73 11.94L1.52 1.53M0.36 0C0.16 0 0 0.17 0 0.37L0.23 11.97C0.24 12.54 0.47 13.09 0.88 13.49L23.59 36.2C23.86 36.47 24.21 36.6 24.55 36.6C24.89 36.6 25.25 36.47 25.51 36.2L36.19 25.52C36.72 24.99 36.72 24.12 36.19 23.59L13.49 0.88C13.09 0.48 12.54 0.24 11.97 0.23L0.37 0H0.36Z"
                                fill="black"/>
                            <path
                                d="M2.19995 12.71C9.65995 20.17 17.11 27.62 24.57 35.08L35.07 24.58C27.61 17.12 20.16 9.67002 12.7 2.21002C13.79 5.13002 12.63 8.21002 10.46 10.47C8.20995 12.81 5.21995 13.84 2.19995 12.71Z"
                                fill="black"/>
                            <path
                                d="M1.42 1.42L0.869995 5.84C2.27 6.4 3.88 6.08 4.94 5.01C6 3.94 6.33 2.34 5.77 0.940002L1.58 1.26"
                                fill="black"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_136_213">
                                <rect width="36.59" height="36.59" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>

                )}
            </motion.div>
        </>
    );
}