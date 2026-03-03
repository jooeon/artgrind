"use client";

import { useEffect, useRef } from "react";

export default function DrawableBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // match canvas to window size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const getPos = (e: MouseEvent) => ({ x: e.clientX, y: e.clientY });

        const startDraw = (e: MouseEvent) => {
            isDrawing.current = true;
            lastPos.current = getPos(e);
        };

        const draw = (e: MouseEvent) => {
            if (!isDrawing.current || !lastPos.current) return;

            const pos = getPos(e);

            ctx.beginPath();
            ctx.moveTo(lastPos.current.x, lastPos.current.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();

            lastPos.current = pos;
        };

        const stopDraw = () => {
            isDrawing.current = false;
            lastPos.current = null;
        };

        window.addEventListener("mousedown", startDraw);
        window.addEventListener("mousemove", draw);
        window.addEventListener("mouseup", stopDraw);
        window.addEventListener("mouseleave", stopDraw);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousedown", startDraw);
            window.removeEventListener("mousemove", draw);
            window.removeEventListener("mouseup", stopDraw);
            window.removeEventListener("mouseleave", stopDraw);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 z-[-10] pointer-events-none"
        />
    );
}