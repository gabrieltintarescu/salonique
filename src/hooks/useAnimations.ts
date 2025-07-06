import { useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function useScrollAnimation() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    return { ref, controls };
}

export function useParallax(speed: number = 0.5) {
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setOffsetY(window.pageYOffset);
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return offsetY * speed;
}

export function useStaggeredAnimation(delay: number = 0.1) {
    const [animateChildren, setAnimateChildren] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            setAnimateChildren(true);
        }
    }, [isInView]);

    return { ref, animateChildren, delay };
}
