import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingDiv from "./components/loadingDiv";

const Page = () => {
  const router = useRouter()
  useEffect(() => {
    let lang = localStorage.getItem("lang")
    if (!(lang && ["ar", "en"].includes(lang))) {
      localStorage.setItem("lang", "ar")
      lang = "ar"
    }
    router.push("/" + lang)
  }, [router])

  return <LoadingDiv english loading />
};

export default Page;
