import {useState, useEffect, useRef} from "react";

const STORAGE_KEY = "artgrind_excluded_pins";

type ExcludedPinsMap = Record<string, string[]>;

export function useExcludedPins(boardId: string) {
    const [excludedMap, setExcludedMap] = useState<ExcludedPinsMap>({});
    const isLoaded = useRef(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setExcludedMap(JSON.parse(saved));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setTimeout(() => { isLoaded.current = true; }, 0);
    }, []);

    const excluded = excludedMap[boardId] ?? [];

    const togglePin = (id: string) => {
        setExcludedMap(prev => {
            const current = prev[boardId] ?? [];
            const next = current.includes(id)
                ? current.filter(p => p !== id)
                : [...current, id];

            const updated = { ...prev, [boardId]: next };

            // clean up boards with no exclusions
            if (next.length === 0) delete updated[boardId];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const selectAll = () => {
        setExcludedMap(prev => {
            const updated = { ...prev };
            delete updated[boardId]; // no exclusions = all selected
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const deselectAll = (pins: { id: string }[]) => {
        setExcludedMap(prev => {
            const updated = { ...prev, [boardId]: pins.map(p => p.id) };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    return { excluded, togglePin, selectAll, deselectAll };
}