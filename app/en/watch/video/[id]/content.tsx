"use client";
import { getClass } from "@/app/components/button";
import LoadingDiv from "@/app/components/loadingDiv";
import { fetchResponse } from "@/app/utils/response";
import { bDate } from "@/app/utils/time";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  const { id }: { id: string } = useParams();

  const refetch = useCallback(
    () => fetchResponse({ setResponse, url: `/api/video/${id}/` }),
    [id]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (response === undefined){
    return <LoadingDiv loading />
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
              href={"//watch/video/" + response.previous}
              className={getClass({ color: "green" })}
            >
              السابق
            </Link>
          )}
          <Link
            href={"//watch/playlists/playlist/" + response.playlist.id}
            className={getClass({ color: "green" })}
          >
            {response.playlist.title}
          </Link>
          {Boolean(response.next) && (
            <Link
              href={"//watch/video/" + response.next}
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
