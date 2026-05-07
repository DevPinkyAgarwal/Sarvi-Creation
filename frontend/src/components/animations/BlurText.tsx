import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'letters';
    direction?: 'top' | 'bottom';
    threshold?: number;
}

export default function BlurText({
    text,
    delay = 0,
    className = "",
    animateBy = 'letters',
    direction = 'top',
    threshold = 0.1
}: BlurTextProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: threshold });

    const elements = animateBy === 'words' ? text.split(' ') : text.split('');

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: animateBy === 'letters' ? 0.02 : 0.05,
                delayChildren: delay
            }
        }
    };

    const itemVariants = {
        hidden: {
            filter: 'blur(10px)',
            opacity: 0,
            y: direction === 'top' ? -20 : 20,
        },
        visible: {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1.0] as any // Using as any to bypass potential strict easing type issues in this env
            }
        }
    };

    return (
        <motion.span
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`inline-block ${className}`}
        >
            {elements.map((el, i) => (
                <motion.span
                    key={i}
                    variants={itemVariants}
                    className="inline-block"
                >
                    {el}
                    {animateBy === 'words' && i < elements.length - 1 && "\u00A0"}
                </motion.span>
            ))}
        </motion.span>
    );
}
