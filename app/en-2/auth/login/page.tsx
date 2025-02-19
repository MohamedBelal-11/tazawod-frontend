import { Metadata } from "next";
import Content from "./content";
import "../register/student/page.css";

export const metadata: Metadata = {
  title: "Login - Tazawad Academy",
};

export default function Page() {
  return <Content />;
}
