"use client";
import ArabicLayout from "@/app/components/arabicLayout";
import { get } from "@/app/utils/docQuery";
import globalClasses from "@/app/utils/globalClasses";
import { PlayCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { childsVariants, parentVariants } from "../../content";

interface Video {
  id: number;
  title: string;
}

type Response =
  | {
      succes: true;
      playlist: string;
      videos: Video[];
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Response>();

  useEffect(() => {
    setResponse({
      succes: true,
      playlist: "السيرة النبوية",
      videos: [
        { id: 1, title: "السيرة النبوية - لماذا نتعلم السيرة" },
        { id: 2, title: "السيرة النبوية - حال جزيرة العرب قبل بعثة النبي ﷺ" },
        { id: 3, title: "السيرة النبوية - مولده وطهارة نسبه ﷺ" },
        {
          id: 4,
          title: "السيرة النبوية - ذهاب إبرهة ومعه الفيلة ليهدم الكعبة",
        },
        { id: 5, title: "السيرة النبوية - هلاك إبرهة وجيشه" },
        { id: 6, title: "السيرة النبوية - عادات الغرب في الإرضاع" },
        {
          id: 7,
          title: "السيرة النبوية - بركة إرضاع النبي ﷺ وحادثة شق الصدر ",
        },
      ],
    });
  }, []);

  useEffect(() => {
    if (response && response.succes)
      get<HTMLTitleElement>("title").forEach((title) => {
        title.innerHTML = `${response.playlist} - أكادمية تزَود`;
      });
  }, [response]);

  return (
    <ArabicLayout>
      {response ? (
        response.succes ? (
          <main className="sm:p-6 p-2">
            <h1>
              <span className={globalClasses.sectionHeader}>
                {response.playlist}
              </span>
            </h1>
            <motion.div
              className="mt-6 overflow-hidden rounded-xl"
              initial="hidden"
              animate="visible"
              variants={parentVariants}
            >
              {response.videos.map((video, i) => (
                <motion.div key={video.id} variants={childsVariants} className="bg-white">
                  <Link
                    href={`/watch/video/${video.id}`}
                    className={
                      "flex border-b-2 border-solid border-gray-400 " +
                      "last:border-b-0 p-3 items-center w-full"
                    }
                  >
                    <div className="w-34 p-4">{i + 1}</div>
                    <div className="w-full flex items-center gap-3">
                      <PlayCircleIcon className="sm:min-w-32 min-w-16 sm:w-32 w-16" />
                      <p className="text-lg">
                        {video.title.length > 60
                          ? video.title.slice(0, 61) + "..."
                          : video.title}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </main>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </ArabicLayout>
  );
};

export default Content;
