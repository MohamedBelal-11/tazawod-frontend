"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const Option: React.FC<{
  titled: string;
  description: string;
  href: string;
}> = ({ titled, description, href }) => {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ scale: 1 }}
      animate={
        hover
          ? { scale: 1.05, transition: { type: "spring", stiffness: 200 } }
          : undefined
      }
      whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 200 } }}
      className="rounded-xl"
    >
      <Link
        href={href}
        className="block bg-gray-200 rounded-xl p-4 w-full h-full"
      >
        <p className="font-bold sm:text-xl">{titled}</p>
        <p className="text-gray-500 mt-2">{description}</p>
      </Link>
    </motion.div>
  );
};

const OptionsDiv: React.FC<{
  options: {
    titled: string;
    description: string;
    href: string;
  }[];
}> = ({options}) => (
  <div className="rounded-xl bg-white flex-col gap-3 p-4">
    {options.map((option, i) => (<Option key={i} {...option} />))}
  </div>
);

export default OptionsDiv;
