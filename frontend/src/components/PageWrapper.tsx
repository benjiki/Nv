import { motion, type Transition } from "framer-motion";
import { type ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

const variants = {
  initial: { opacity: 0, x: -100 }, // start from left
  animate: { opacity: 1, x: 0 }, // slide in to center
  exit: { opacity: 0, x: 100 }, // slide out to right
};

// ✅ Explicitly type the transition
const transition: Transition = {
  type: "tween", // inferred as valid AnimationType
  duration: 0.4,
  ease: "easeInOut",
};

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
}
