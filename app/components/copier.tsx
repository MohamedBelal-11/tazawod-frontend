import { useState } from "react";
import Button from "./button";

const Copier: React.FC<{ copy: string; arabic?: boolean }> = ({
  arabic = false,
  copy,
}) => {
  const [copied, setCopied] = useState<"copied" | "copy" | "failed">("copy");

  return (
    <Button
      color="sky"
      onClick={() => {
        navigator.clipboard
          .writeText(copy)
          .then(() => {
            setCopied("copied");
          })
          .catch(() => {
            setCopied("failed");
          });
        setTimeout(() => setCopied("copy"), 5000);
      }}
    >
      {arabic
        ? copied === "copied"
          ? "تم النسخ"
          : copied === "failed"
          ? "فشل"
          : "نسخ"
        : copied}
    </Button>
  );
};

export default Copier;
