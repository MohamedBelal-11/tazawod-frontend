import { Metadata } from "next";
import Content from "./content";
import "./page.css"

export const metadata: Metadata = {
  title: "تسجيل حساب - أكاديمية تزود"
}

export default function Page() {
  return <Content />
}