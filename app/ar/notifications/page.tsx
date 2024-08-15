import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "الإشعارات - أكاديمية تزود",
};

const Page: React.FC = () => {
  return <Content />;
};

export default Page;
