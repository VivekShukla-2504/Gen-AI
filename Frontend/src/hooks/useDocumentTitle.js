import { useEffect } from "react";

export function useDocumentTitle(title) {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title ? `${title} | PrepAI` : "PrepAI — GenAI Interview Preparation & ATS Resume Coach";
        return () => {
            document.title = prevTitle;
        };
    }, [title]);
}

