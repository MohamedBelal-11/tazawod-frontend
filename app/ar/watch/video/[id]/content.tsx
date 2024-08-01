"use client";
import { getClass } from "@/app/components/button";
import { bDate } from "@/app/utils/time";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

type Responset =
  | {
      succes: true;
      link: string;
      next: number | null;
      previous: number | null;
      playlist: { title: string; id: number };
      title: string;
      description: string;
      date: string;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();

  useEffect(() => {
    setResponse({
      succes: true,
      title: "السيرة النبوية - لماذا نتعلم السيرة",
      link: "https://www.youtube.com/watch?v=kXAgFcu8SS0&t=77s",
      next: 2,
      previous: null,
      playlist: { title: "دورة السيرة النبوية", id: 1 },
      date: "2024/3/27 2:00",
      description: "دورة السيرة النبوية\nكيف كان أهل قريش قبل البعثة",
    });
  }, []);

  if (!response) {
    return <></>;
  }

  if (response.succes === false) {
    return <>{response.error}</>;
  }

  return (
    <div className="p-2 sm:p-4">
      <main className="p-4 rounded-xl bg-white">
        <ReactPlayer
          className="aspect-video"
          width="100%"
          height="unset"
          url={response.link}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
        <p className="mt-4 text-2xl">{response.title}</p>
        <p>{bDate.getFormedDate(response.date, { form: "arabic" })}</p>
        <div className="flex justify-between sm:px-2">
          {Boolean(response.previous) && (
            <Link
              href={"/ar/watch/video/" + response.previous}
              className={getClass({ color: "green" })}
            >
              السابق
            </Link>
          )}
          <Link
            href={"/ar/watch/playlists/playlist/" + response.playlist.id}
            className={getClass({ color: "green" })}
          >
            {response.playlist.title}
          </Link>
          {Boolean(response.next) && (
            <Link
              href={"/ar/watch/video/" + response.next}
              className={getClass({ color: "green" })}
            >
              التالي
            </Link>
          )}
        </div>
        <div className="p-3">
          {response.description.split("\n").map((line, i) => (
            <p className="my-2" key={i}>
              {line}
            </p>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Content;
