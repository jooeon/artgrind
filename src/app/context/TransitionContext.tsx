"use client";
import { createContext, useContext, useState } from "react";
import PageTransition from "@/app/components/PageTransition";

type TransitionContextType = {
    startTransition: () => void;
    resetTransition: () => void;
};

const TransitionContext = createContext<TransitionContextType>({ startTransition: () => {}, resetTransition: () => {} });

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const [transitioning, setTransitioning] = useState(false);

    const startTransition = () => setTransitioning(true);
    const resetTransition = () => setTransitioning(false);

    return (
        <TransitionContext.Provider value={{ startTransition, resetTransition }}>
            <PageTransition playing={transitioning} />
            {children}
        </TransitionContext.Provider>
    );
}

export const useTransition = () => useContext(TransitionContext);