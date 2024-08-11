import { useState } from "react";

/**
 * @param type name of event
 * @param listener listener callback
 * @param options options for event listener
 * @returns function that removes event listener from document
 *
 * allows you to put an event listener in your useEffect without removing the function from the function call
 */
export const effectEvent = (type: string, listener: ((evt: any) => void), options?: boolean | AddEventListenerOptions | undefined, target?: any): () => void => {
    if (!target)
        target = document;
    target.addEventListener(type, listener, options);
    return () => {
        target.removeEventListener(type, listener, options);
    };
};

export const useUpdate = (): (() => void) => {
    const [_s, setS] = useState(false);
    return () => setS(s => !s);
}
