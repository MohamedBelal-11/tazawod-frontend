/* eslint-disable @next/next/no-img-element */
"use client";
import ArabicLayout from "@/app/components/arabicLayout";
import Button from "@/app/components/button";
import Checker from "@/app/components/Checker";
import Popup from "@/app/components/popup";
import globalClasses from "@/app/utils/globalClasses";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export const parentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.3 } },
};

export const childsVariants: Variants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { duration: 0.5 } },
};

type Playlist = {
  title: string;
  id: number;
  videos_count: number;
};

const AddPlaylist: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [allow, setAllow] = useState<{
    unloged: boolean;
    subscribed: boolean;
    unsubscribed: boolean;
    allowedTeacher: boolean;
    notAllowedTeacher: boolean;
    allowedAdmin: boolean;
    notAllowedAdmin: boolean;
  }>({
    allowedAdmin: false,
    allowedTeacher: false,
    notAllowedAdmin: false,
    notAllowedTeacher: false,
    subscribed: false,
    unloged: false,
    unsubscribed: false,
  });
  const [faults, setFaults] = useState<{ title: boolean; allows: boolean }>({
    title: false,
    allows: false,
  });

  useEffect(() => {
    setFaults((f) => ({
      title: f.title,
      allows: !(
        allow.allowedAdmin ||
        allow.allowedTeacher ||
        allow.notAllowedAdmin ||
        allow.notAllowedTeacher ||
        allow.subscribed ||
        allow.unloged ||
        allow.unsubscribed
      ),
    }));
  }, [allow]);

  useEffect(() => {
    setFaults((f) => ({
      title: title.trim() === "",
      allows: f.allows,
    }));
  }, [title]);

  useEffect(() => setFaults({ allows: false, title: false }), []);

  return (
    <div
      className="p-4 flex flex-col w-screen h-full overflow-y-auto"
      style={{ maxWidth: 700 }}
    >
      <input
        type="text"
        className={
          "p-4 sm:text-2xl text-lg rounded-xl border-2 border-solid " +
          "border-gray-400 focus:border-sky-500 outline-0"
        }
        placeholder="عنوان القائمة"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {faults.title && (
        <p className="text-red-500">يجب عليك لإدخال إسم القائمة</p>
      )}
      <p className="text-2xl mt-6">السماح لـ</p>
      <div className="mt-4 flex flex-col gap-2">
        <Checker
          id="unloged"
          label="غير المسجلين"
          type="checkbox"
          className="text-xl"
          checked={allow.unloged}
          onChange={(e) =>
            setAllow((a) => ({ ...a, unloged: e.target.checked }))
          }
        />
        <p className="text-xl my-2">الطلاب</p>
        <div className="flex ms-4 gap-6 flex-wrap">
          <Checker
            id="subscribed"
            label="المشتركين"
            type="checkbox"
            checked={allow.subscribed}
            onChange={(e) =>
              setAllow((a) => ({ ...a, subscribed: e.target.checked }))
            }
          />
          <Checker
            id="unsubscribed"
            label="غير المشتركين"
            type="checkbox"
            checked={allow.unsubscribed}
            onChange={(e) =>
              setAllow((a) => ({ ...a, unsubscribed: e.target.checked }))
            }
          />
        </div>
        <p className="text-xl my-2">المعلمين</p>
        <div className="flex ms-4 gap-6 flex-wrap">
          <Checker
            id="allowedTeacher"
            label="الموافقين عليهم"
            type="checkbox"
            checked={allow.allowedTeacher}
            onChange={(e) =>
              setAllow((a) => ({ ...a, allowedTeacher: e.target.checked }))
            }
          />
          <Checker
            id="notAllowedTeacher"
            label="غير الموافقين عليهم"
            type="checkbox"
            checked={allow.notAllowedTeacher}
            onChange={(e) =>
              setAllow((a) => ({ ...a, notAllowedTeacher: e.target.checked }))
            }
          />
        </div>
        <p className="text-xl my-2">المشرفين</p>
        <div className="flex ms-4 gap-6 flex-wrap">
          <Checker
            id="allowedAdmin"
            label="الموافقين عليهم"
            type="checkbox"
            checked={allow.allowedAdmin}
            onChange={(e) =>
              setAllow((a) => ({ ...a, allowedAdmin: e.target.checked }))
            }
          />
          <Checker
            id="notAllowedAdmin"
            label="غير الموافقين عليهم"
            type="checkbox"
            checked={allow.notAllowedAdmin}
            onChange={(e) =>
              setAllow((a) => ({ ...a, notAllowedAdmin: e.target.checked }))
            }
          />
        </div>
      </div>

      {faults.allows && (
        <p className="text-red-500">يجب عليك إدخال فئة واحدة على الأقل</p>
      )}
      <div className="flex gap-4 mt-4 justify-evenly">
        <Button onClick={onClose} color="red">
          إلغاء
        </Button>
        <Button>إضافة</Button>
      </div>
    </div>
  );
};

const AddVideo: React.FC<{ onClose: () => void; playlists: Playlist[] }> = ({
  onClose,
  playlists,
}) => {
  const [inputs, setInputs] = useState<{
    link: string;
    title: string;
    description: string;
    playlistID?: string;
  }>({ description: "", link: "", title: "" });

  return (
    <div
      className="p-4 flex flex-col w-screen h-full overflow-y-auto"
      style={{ maxWidth: 700 }}
    >
      <input
        type="text"
        className={
          "p-3 sm:text-lg rounded-xl border-2 border-solid " +
          "border-gray-400 focus:border-sky-500 outline-0"
        }
        dir="ltr"
        placeholder="رابط الفيديو"
        value={inputs.link}
        onChange={(e) =>
          setInputs((inps) => ({ ...inps, link: e.target.value }))
        }
      />
      {(() => {
        const trimed = inputs.link.trim();
        if (trimed === "") {
          return;
        }
        return (
          <>
            <p className="mt-4">التأكد من الرابط</p>
            <ReactPlayer
              style={{ width: "100%" }}
              allow="autoplay; fullscreen"
              allowFullScreen
              url={trimed}
              width={"100%"}
            />
          </>
        );
      })()}
      <input
        type="text"
        className={
          "p-3 sm:text-lg rounded-xl border-2 border-solid my-6 " +
          "border-gray-400 focus:border-sky-500 outline-0"
        }
        placeholder="عنوان الفيديو"
        value={inputs.title}
        onChange={(e) =>
          setInputs((inps) => ({ ...inps, title: e.target.value }))
        }
      />
      <textarea
        className={
          "p-3 sm:text-lg rounded-xl border-2 border-solid box-border " +
          "border-gray-400 focus:border-sky-500 outline-0"
        }
        placeholder="وصف الفيديو"
        value={inputs.description}
        onChange={(e) =>
          setInputs((inps) => ({ ...inps, description: e.target.value }))
        }
      />
      <select
        className={
          "my-4 p-3 sm:text-lg rounded-xl border-2 border-solid " +
          "border-gray-400 focus:border-sky-500 outline-0"
        }
        defaultValue={"null"}
      >
        <option value="null" disabled>
          قائمة التشغيل
        </option>
        {playlists.map((playlist, i) => (
          <option key={i} value={playlist.id}>
            {playlist.title}
          </option>
        ))}
      </select>
      <div className="flex gap-4 mt-2 justify-evenly">
        <Button onClick={onClose} color="red">
          إلغاء
        </Button>
        <Button>إضافة</Button>
      </div>
    </div>
  );
};

type Response =
  | {
      succes: true;
      super: boolean;
      playlists: Playlist[];
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Response>();
  const [popup, setPopup] = useState<"add video" | "add playlist">();

  useEffect(() => {
    setResponse({
      succes: true,
      playlists: [
        { title: "دورة السيرة النبوية", id: 1, videos_count: 5 },
        { title: "الإخلاص", id: 2, videos_count: 6 },
        { title: "الدعوة", id: 3, videos_count: 6 },
        { title: "قصص الأنبياء", id: 4, videos_count: 5 },
        { title: "التوبة", id: 5, videos_count: 8 },
      ],
      super: true,
    });
  }, []);

  return (
    <ArabicLayout>
      {response ? (
        response.succes ? (
          <>
            {response.super && (
              <Popup
                visible={popup !== undefined}
                onClose={() => setPopup(undefined)}
              >
                {popup === "add playlist" ? (
                  <AddPlaylist onClose={() => setPopup(undefined)} />
                ) : (
                  <AddVideo
                    onClose={() => setPopup(undefined)}
                    playlists={response.playlists}
                  />
                )}
              </Popup>
            )}
            <main className="sm:p-6 p-2">
              <div className="flex gap-4 flex-wrap">
                <h2 className={globalClasses.sectionHeader}>قوائم التشغيل</h2>
                {response.super && (
                  <>
                    <Button
                      className="flex-1 text-nowrap"
                      color="green"
                      onClick={() => setPopup("add video")}
                    >
                      إضافة فيديو
                    </Button>
                    <Button
                      className="flex-1 text-nowrap"
                      color="sky"
                      onClick={() => setPopup("add playlist")}
                    >
                      إضافة قائمة تشغيل
                    </Button>
                  </>
                )}
              </div>
              <motion.div
                className="mt-6 overflow-hidden rounded-xl"
                initial="hidden"
                animate="visible"
                variants={parentVariants}
              >
                {response.playlists.map(({ title, id, videos_count }, i) => (
                  <motion.div key={i} variants={childsVariants} className="bg-white">
                    <Link
                      href={`/watch/playlists/playlist/${id}`}
                      className={
                        "block border-b-2 border-solid border-gray-400 " +
                        "last:border-b-0 sm:p-6 p-3"
                      }
                    >
                      <p className="font-semibold sm:text-2xl text-xl">
                        {title}
                      </p>
                      <p className="mt-4 text-gray">
                        {videos_count === 1
                          ? "فيديو واحد"
                          : videos_count === 2
                          ? "فيديوهان"
                          : videos_count > 2 && videos_count < 11
                          ? `${videos_count} فيديوهات`
                          : `${videos_count} فيديو`}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </main>
          </>
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
