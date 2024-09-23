"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingDiv from "./components/loadingDiv";
import EnglishLayout from "./components/englishLayout";

const Content = () => {
  const router = useRouter();
  useEffect(() => {
    let lang = localStorage.getItem("lang");
    if (!(lang && ["ar", "en"].includes(lang))) {
      localStorage.setItem("lang", "ar");
      lang = "ar";
    }
    router.push("/" + lang);
  }, [router]);

  return (
    <EnglishLayout>
      <LoadingDiv english loading />
    </EnglishLayout>
  );
};

export default Content;
