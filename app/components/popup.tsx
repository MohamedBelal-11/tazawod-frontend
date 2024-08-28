import { AnimatePresence, motion } from "framer-motion";
import Button from "./button";
import { useEffect, useState } from "react";
import { get } from "../utils/docQuery";
import { DefaultResponse, fetchResponse } from "../utils/response";

export const RegulerConfirm = ({
  text,
  btns,
  onConfirm,
  onClose,
  url,
}: {
  text: string;
  btns?: [{ text?: string; color?: string }, { text?: string; color?: string }];
  onConfirm?: (success: boolean) => void;
  onClose: () => void;
  url?: string;
}) => {
  btns = btns
    ? [
        { text: btns[0].text || "تم", color: btns[0].color || "green" },
        {
          text: btns[1].text || "إلغاء",
          color: btns[1].color || "red",
        },
      ]
    : [
        { text: "تم", color: "green" },
        { text: "إلغاء", color: "red" },
      ];
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DefaultResponse>();

  return (
    <div className="h-full overflow-y-auto flex flex-col max-w-full gap-8 p-4 w-max">
      <p className="sm:text-3xl text-xl text-center p-4">{text}</p>
      <div className="flex gap-4 justify-evenly">
        <Button
          color={loading ? "gray" : btns[1].color}
          onClick={loading ? undefined : onClose}
        >
          {btns[1].text}
        </Button>
        {loading ? (
          <Button type="div">
            <div className="animate-spin border-8 border-gray-400 border-t-gray-600 rounded-full w-5 h-5"></div>
          </Button>
        ) : (
          <Button
            color={btns[0].color}
            onClick={() => {
              (url
                ? () =>
                    fetchResponse({
                      setResponse,
                      url,
                      onFinish: onConfirm,
                      setLoading,
                    })
                : () => {})();
              (!url ? (onConfirm ? onConfirm : () => {}) : () => {})(true);
            }}
          >
            {btns[0].text}
          </Button>
        )}
      </div>
      {response !== undefined && (
        <p
          className={`p-6 bg-${
            response && response.succes ? "green" : "red"
          }-300 border-2 border-${
            response && response.succes ? "green" : "red"
          }-500 rounded-xl mt-4`}
        >
          {response === null
            ? "حدث خطأٌ ما"
            : response.succes
            ? "تم بنجاح"
            : "حدث خطأٌ ما"}
        </p>
      )}
    </div>
  );
};

const Popup: React.FC<{
  onClose: () => void;
  children?: React.ReactNode;
  visible?: boolean;
}> = ({ onClose, children, visible }) => {
  useEffect(() => {
    const body = get<HTMLBodyElement>("body")[0];
    if (visible) {
      body.classList.add("overflow-y-hidden");
    } else {
      body.classList.remove("overflow-y-hidden");
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="w-full h-screen fixed flex justify-center items-center top-0 right-0"
          style={{ zIndex: 5 }}
          initial={{ backgroundColor: "#0000" }}
          animate={{
            backgroundColor: "#1116",
            transition: { duration: 0.5 },
          }}
          exit={{
            backgroundColor: "#0000",
            transition: { delay: 0.5, duration: 0.3 },
          }}
        >
          <div
            className="absolute w-full h-full cursor-pointer"
            onClick={onClose}
            style={{ zIndex: -1 }}
          ></div>
          <motion.div
            className="rounded-2xl bg-white flex flex-col gap-4 overflow-hidden"
            initial={{ height: 0 }}
            animate={{
              height: "auto",
              transition: { delay: 0.3, duration: 0.5 },
            }}
            style={{ maxHeight: "85vh" }}
            exit={{ height: 0, transition: { duration: 0.5 } }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
