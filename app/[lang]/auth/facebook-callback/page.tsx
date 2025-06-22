import React from "react";
import Content from "./content";
import { cookies } from "next/headers";

const Page: React.FC = () => {
  const cookieStore = cookies();
  const userLang = cookieStore.get("userLang"); // Get the userLang cookie
  return <Content lang={userLang ? userLang.value : "ar"} />;
};

export default Page;
