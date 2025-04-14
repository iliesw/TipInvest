import LayoutC from "./layout";
import ImageStyler from "@/components/Client/ImageStyler";
import { motion } from "framer-motion";

export default function page() {

  return (
    <LayoutC>
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ImageStyler />
      </motion.div>
    </LayoutC>
  );
}