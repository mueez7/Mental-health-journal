import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SplitText = ({
    text = '',
    className = '',
    delay = 30,
    duration = 0.6,
    ease = 'power3.out',
    splitType = 'chars',
    from = { opacity: 0, y: 20 },
    to = { opacity: 1, y: 0 },
    threshold = 0.1,
    rootMargin = '0px',
    textAlign = 'center',
    onLetterAnimationComplete,
    showCallback = false
}) => {
    const containerRef = useRef(null);
    const charsRef = useRef([]);
    const hasAnimated = useRef(false);

    // Store animation params in refs so the effect closure never goes stale
    const fromRef = useRef(from);
    const toRef = useRef(to);
    const delayRef = useRef(delay);
    const durationRef = useRef(duration);
    const easeRef = useRef(ease);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    gsap.fromTo(
                        charsRef.current,
                        { ...fromRef.current },
                        {
                            ...toRef.current,
                            duration: durationRef.current,
                            ease: easeRef.current,
                            stagger: {
                                each: delayRef.current / 1000,
                                onComplete: function () {
                                    const targets = charsRef.current;
                                    if (
                                        showCallback &&
                                        onLetterAnimationComplete &&
                                        this.targets()[0] === targets[targets.length - 1]
                                    ) {
                                        onLetterAnimationComplete();
                                    }
                                }
                            },
                        }
                    );
                    observer.disconnect();
                }
            },
            { threshold, rootMargin }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const splitText = () => {
        if (splitType === 'chars') {
            return text.split('').map((char, index) => (
                <span
                    key={index}
                    ref={(el) => (charsRef.current[index] = el)}
                    style={{
                        display: 'inline-block',
                        whiteSpace: char === ' ' ? 'pre' : 'normal',
                        opacity: 0   // start hidden to avoid flash before gsap kicks in
                    }}
                >
                    {char}
                </span>
            ));
        } else if (splitType === 'words') {
            return text.split(' ').map((word, index) => (
                <span
                    key={index}
                    ref={(el) => (charsRef.current[index] = el)}
                    style={{ display: 'inline-block', marginRight: '0.25em', opacity: 0 }}
                >
                    {word}
                </span>
            ));
        }
        return <span ref={(el) => (charsRef.current[0] = el)} style={{ opacity: 0 }}>{text}</span>;
    };

    return (
        <div ref={containerRef} className={className} style={{ textAlign }}>
            {splitText()}
        </div>
    );
};

export default SplitText;
