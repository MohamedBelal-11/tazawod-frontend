import MyLayout from "../components/myLayout";

export function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = params;

  return {
    title: lang === "ar" ? "أكاديمية تزود" : "Tazawad Academy",
    description:
      lang == "ar"
        ? "تزود هي منصة تعليمية إسلامية شاملة توفر دروسًا " +
          "مباشرة عبر الإنترنت لتحفيظ وتلاوة وتجويد القرءان الكريم، " +
          "بالإضافة إلى تعليم الفقه الإسلامي، السنة النبوية، " +
          "والسيرة النبوية."
        : "Tazawad is a comprehensive Islamic educational platform " +
          "that provides live online lessons for memorizing, reciting, " +
          "and Tajweed of the Holy Quran, in addition to teaching Islamic " +
          "jurisprudence, the Sunnah, and the Prophet’s biography.",
    keywords:
      lang == "ar"
        ? "منصة تعليمية إسلامية, تحفيظ القرءان, تلاوة القرءان, " +
          "تجويد القرءان, دروس الفقه, السنة النبوية, السيرة النبوية, " +
          "تعليم إسلامي عبر الإنترنت, حلقات تحفيظ, تعليم الفقه الإسلامي, " +
          "دروس الشرح, علماء الدين, تفاعل مباشر, تعليم القرءان الكريم, " +
          "دروس تفاعلية, تعليم مرن, تعلم عن بعد"
        : "Islamic educational platform, Quran memorization, Quran recitation, " +
          "Quran intonation, jurisprudence lessons, Sunnah of the Prophet, " +
          "Prophetic biography, Islamic education online, memorization circles, " +
          "Islamic jurisprudence education, explanation lessons, religious scholars, " +
          "direct interaction, Quran education, interactive lessons, " +
          "flexible education, distance learning",
    alternates: {
      canonical: `https://tazawad.net/${lang}`,
      languages: {
        en: "https://tazawad.net/en",
        ar: "https://tazawad.net/ar",
      },
    },
  };
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string }
}>) {
  const {lang} = params;
  return <MyLayout lang={lang}>{children}</MyLayout>;
}
