import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "الصفحة الرئيسية - أكاديمية تزود",
};

export default function Home() {
  return <Content />
}