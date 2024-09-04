import type { Metadata } from "next";
import EnglishLayout from "../components/englishLayout";

export const metadata: Metadata = {
  title: "Tazawad Academy",
  description:
    "Tazawad is a comprehensive Islamic educational platform " +
    "that provides live online lessons for memorizing, reciting, " +
    "and Tajweed of the Holy Quran, in addition to teaching Islamic " +
    "jurisprudence, the Sunnah, and the Prophet’s biography.",
  keywords:
    "Islamic educational platform, Quran memorization, Quran recitation, " +
    "Quran intonation, jurisprudence lessons, Sunnah of the Prophet, " +
    "Prophetic biography, Islamic education online, memorization circles, " +
    "Islamic jurisprudence education, explanation lessons, religious scholars, " +
    "direct interaction, Quran education, interactive lessons, " +
    "flexible education, distance learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <EnglishLayout>{children}</EnglishLayout>;
}
