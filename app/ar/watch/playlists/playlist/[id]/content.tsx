"use client";
import { get } from "@/app/utils/docQuery";
import globalClasses from "@/app/utils/globalClasses";
import { PlayCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { childsVariants, parentVariants } from "../../content";
import LoadingDiv from "@/app/components/loadingDiv";
import { useParams } from "next/navigation";
import { fetchResponse } from "@/app/utils/response";

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
  const { id }: { id: string } = useParams();

  const refetch = useCallback(
    () => fetchResponse({ setResponse, url: `/api/playlist/${id}/` }),
    [id]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (response && response.succes)
      get<HTMLTitleElement>("title").forEach((title) => {
        title.innerHTML = `${response.playlist} - أكاديمية تزَود`;
      });
  }, [response]);

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }

  if (!response.succes) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }

  return (
    <main className="sm:p-6 p-2">
      <h1>
        <span className={globalClasses.sectionHeader}>{response.playlist}</span>
      </h1>
      <motion.div
        className="mt-6 overflow-hidden rounded-xl"
        initial="hidden"
        animate="visible"
        variants={parentVariants}
      >
        {response.videos.length === 0 ? (
          <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
            ليس هناك أي فيديوهات بعد
          </div>
        ) : (
          response.videos.map(({ title, id }, i) => (
            <motion.div
              key={id}
              variants={childsVariants}
              className={
                "bg-white border-b-2 border-solid border-gray-400 " +
                "last:border-b-0"
              }
            >
              <Link
                href={`/ar/watch/video/${id}`}
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
            </motion.div>
          ))
        )}
      </motion.div>
    </main>
  );
};

export default Content;
