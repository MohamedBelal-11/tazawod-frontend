"use client";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useScrollPosition from "../hooks/scroll";

const scrollTop = () => {
  scrollTo({ top: 0, behavior: "smooth" });
};

const ScrollTopButton: React.FC = () => {
  const [hover, setHover] = useState(false);
  const scroll = useScrollPosition();

  useEffect(() => {
    if (scroll < 200) {
      setHover(false)
    }
  }, [scroll])

  if (scroll < 200) {
    return;
  }

  return (
    <motion.button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ zIndex: 10 }}
      initial={{ scale: 1 }}
      animate={
        hover
          ? { scale: 1.3, transition: { type: "spring", stiffness: 200 } }
          : undefined
      }
      whileTap={{ scale: 1.6, transition: { type: "spring", stiffness: 200 } }}
      className={
        "fixed bg-green-600 bottom-6 start-6 p-3 w-min h-min  " +
        "rounded-full text-white"
      }
      onClick={scrollTop}
    >
      <ArrowUpIcon width={25} />
    </motion.button>
  );
};

export default ScrollTopButton;
