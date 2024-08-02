import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState } from "react";

const ScrollTopButton: React.FC = () => {
  const [hover, setHover] = useState(false);
  const [taped, setTaped] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ scale: 1 }}
      animate={hover ? { scale: 1.3, transition: { mass: 0.5 } } : undefined}
      whileTap={{ scale: 1.6, transition: { mass: 0.5 } }}
      className="absolute bg-green-600 bottom-10 inset-10 p-4 rounded-full text-white"
    >
      <ArrowUpIcon width={30} />
    </motion.button>
  );
};

export default ScrollTopButton;
