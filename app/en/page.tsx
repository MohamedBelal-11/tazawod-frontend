import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Home Page - Tazawad Academy",
};

export default function Home() {
  return <Content />;
}
