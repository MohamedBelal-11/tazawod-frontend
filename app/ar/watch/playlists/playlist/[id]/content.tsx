"use client";
import ArabicLayout from "@/app/components/arabicLayout";
import { get } from "@/app/utils/docQuery";
import globalClasses from "@/app/utils/globalClasses";
import { PlayCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { childsVariants, parentVariants } from "../../content";
import Button from "@/app/components/button";
import { title } from "process";

interface Video {
  id: number;
  title: string;
}

type Response =
  | {
      succes: true;
      playlist: string;
      videos: Video[];
      super: boolean;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

type PopupData =
| {
    state: "add video";
  }
| {
    state: "delete" | "edit";
    id: number;
  }
| {
    state?: undefined;
  };

const Content: React.FC = () => {
  const [response, setResponse] = useState<Response>();
  const [popup, setPopup] = useState<PopupData>({})

  useEffect(() => {
    setResponse({
      succes: true,
      super: true,
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
    <>
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
              {response.videos.map(({ title, id }, i) => (
                <motion.div
                  key={id}
                  variants={childsVariants}
                  className={
                    "bg-white border-b-2 border-solid border-gray-400 " +
                    "last:border-b-0"
                  }
                >
                  <Link
                    href={`/watch/video/${id}`}
                    className="flex p-3 items-center w-full"
                  >
                    <div className="w-34 p-4">{i + 1}</div>
                    <div className="w-full flex items-center gap-3">
                      <PlayCircleIcon className="sm:min-w-32 min-w-16 sm:w-32 w-16" />
                      <p className="text-lg">
                        {title.length > 60 ? title.slice(0, 61) + "..." : title}
                      </p>
                    </div>
                  </Link>
                  {response.super && (
                    <div className="px-4 gap-3 flex-col">
                      <Button
                        onClick={() => setPopup({ state: "delete", id })}
                        color="red"
                      >
                        حذف
                      </Button>
                      <Button color="amber" onClick={() => setPopup({ state: "delete", id })}>
                        تعديل
                      </Button>
                    </div>
                  )}
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
    </>
  );
};

export default Content;
