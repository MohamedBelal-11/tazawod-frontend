"use client";
import { getArabicDate } from "@/app/utils/arabic";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

type Responset =
  | {
      succes: true;
      link: string;
      next: number;
      previous: number | null;
      playlist: number | null;
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
      playlist: 1,
      date: "2024/3/27 2:00",
      description: "",
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
        <p>{getArabicDate(response.date)}</p>
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
