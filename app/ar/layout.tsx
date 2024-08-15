import type { Metadata } from "next";
import ArabicLayout from "../components/arabicLayout";

export const metadata: Metadata = {
  title: "أكاديمية تزود",
  description:
    "تزود هي منصة تعليمية إسلامية شاملة توفر دروسًا مباشرة عبر الإنترنت لتحفيظ وتلاوة وتجويد القرءان الكريم، بالإضافة إلى تعليم الفقه الإسلامي، السنة النبوية، والسيرة النبوية.",
  keywords:
    "منصة تعليمية إسلامية, تحفيظ القرءان, تلاوة القرءان, تجويد القرءان, دروس الفقه, السنة النبوية, السيرة النبوية, تعليم إسلامي عبر الإنترنت, حلقات تحفيظ, تعليم الفقه الإسلامي, دروس الشرح, علماء الدين, تفاعل مباشر, تعليم القرءان الكريم, دروس تفاعلية, تعليم مرن, تعلم عن بعد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ArabicLayout>{children}</ArabicLayout>;
}
