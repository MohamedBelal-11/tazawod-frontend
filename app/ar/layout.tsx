import type { Metadata } from "next";
import ArabicLayout from "../components/arabicLayout";

export const metadata: Metadata = {
  title: "أكادمية تزود",
  description:
    "تزود هي منصة تعليمية إسلامية شاملة توفر دروسًا مباشرة عبر الإنترنت لتحفيظ وتلاوة وتجويد القرآن الكريم، بالإضافة إلى تعليم الفقه الإسلامي، السنة النبوية، والسيرة النبوية.",
  keywords:
    "منصة تعليمية إسلامية, تحفيظ القرآن, تلاوة القرآن, تجويد القرآن, دروس الفقه, السنة النبوية, السيرة النبوية, تعليم إسلامي عبر الإنترنت, حلقات تحفيظ, تعليم الفقه الإسلامي, دروس الشرح, علماء الدين, تفاعل مباشر, تعليم القرآن الكريم, دروس تفاعلية, تعليم مرن, تعلم عن بعد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ArabicLayout>{children}</ArabicLayout>;
}
