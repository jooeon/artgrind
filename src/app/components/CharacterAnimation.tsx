"use client";
import {motion} from "motion/react";
import React from "react";
import Character from "@/app/components/Character";

export default function CharacterAnimation() {

    return (
        <motion.div
            className="fixed bottom-[-5vw] right-0 h-[15vw] w-[15vw]"
            initial={{y: 200}}
            animate={{y: 0}}
            transition={{
                duration: 2,
                delay: 1.4,
                ease: "easeInOut",
            }}
        >
            <Character />
        </motion.div>
    );
}