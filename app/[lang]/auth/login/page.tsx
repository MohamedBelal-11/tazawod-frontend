import { Metadata } from "next";
import Content from "./content";
import "../register/student/page.css"

export const metadata: Metadata = {
  title: "تسجيل الدخول - أكاديمية تزود"
}

export default function Page() {
  return <Content />
}