import { createContext, useCallback, useRef, useState } from "react";

export const ToastContext = createContext();

const MAX_TOASTS = 4;
const DEFAULT_DURATION = 8000;

export const ToastProvider = ({ children }) => {
    const [ toasts, setToasts ] = useState([]);
    const nextId = useRef(1);

    const dismissToast = useCallback(id => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback(toast => {
        const id = nextId.current++;
        const newToast = { id, type: "success", duration: DEFAULT_DURATION, ...toast };

        setToasts(prev => {
            const isDuplicate = prev.some(t => t.type === newToast.type && t.message === newToast.message);
            if(isDuplicate) return prev;

            return [ ...prev, newToast ].slice(-MAX_TOASTS);
        });

        if(newToast.duration !== null) {
            setTimeout(() => dismissToast(id), newToast.duration);
        }

        return id;
    }, [ dismissToast ]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
        </ToastContext.Provider>
    )
}