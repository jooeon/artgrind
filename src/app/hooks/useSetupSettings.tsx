import {useState, useEffect, useRef} from "react";

type Settings = {
    selectedIndex: number;
    numberOfRounds: number;
    timePerImage: number | null;
    warningIntervals: number[];
};

const DEFAULT_SETTINGS: Settings = {
    selectedIndex: 0,
    numberOfRounds: 5,
    timePerImage: 60,
    warningIntervals: [],
};

const STORAGE_KEY = "artgrind_settings";

export function useSetupSettings() {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const isLoaded = useRef(false);

    // load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    const updateSettings = (partial: Partial<Settings>) => {
        setSettings(prev => {
            const next = { ...prev, ...partial };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    return { settings, updateSettings };
}