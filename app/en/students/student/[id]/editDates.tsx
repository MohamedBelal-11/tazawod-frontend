"use client";
import { MetaInfo } from "@/app/en/auth/register/student/content";
import Button from "@/app/components/button";
import { arDay } from "@/app/utils/arabic";
import { objCompare } from "@/app/utils/object";
import { DefaultResponse, fetchPost } from "@/app/utils/response";
import { Weekday } from "@/app/utils/students";
import { days } from "@/app/utils/time";
import React, { useState } from "react";

const classes = {
  inp:
    "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 " +
    "rounded-xl border-solid max-w-96 w-full outline-0 shadow-xl",
  lesson:
    "flex flex-col *:bg-sky-500 *:p-2 *:border-b-solid *:border-white " +
    "*:border-2 *:rounded-md *:flex *:items-center *:justify-center",
  createDateCard:
    "flex flex-col items-center gap-3 border-solid border-2 border-gray-400 p-4 rounded-xl",
  craateDateInp:
    "outline-0 border-solid border-2 border-gray-400 p-2 rounded-xl",
};

const Add: React.FC<{
  dates: MetaInfo[];
  setDates: React.Dispatch<React.SetStateAction<MetaInfo[]>>;
  onClose: () => void;
}> = ({ onClose, setDates, dates }) => {
  const [start, setStart] = useState("15:00:00");
  const [delay, setDelay] = useState("2:00:00");
  const [addDays, setAddDays] = useState<Weekday[]>([]);
  const [red, setRed] = useState(false);

  let num = 0;
  let tmp = true;
  let list: string[] = [];

  for (let value of dates) {
    list.push(value.day);
    if (days[num] === value.day && tmp) {
      num++;
    } else {
      tmp = false;
    }
  }

  const reset = () => {
    setStart("15:00:00");
    setDelay("2:00:00");
    setAddDays([]);
  };

  const add = () => {
    if (!red && addDays.length !== 0) {
      for (let day of addDays) {
        setDates((v) => {
          return [...v, { day: day, starts: start, delay: delay }];
        });
        reset();
        onClose();
      }
    }
  };

  const cancel = () => {
    reset();
    onClose();
  };

  return (
    <div className="h-full p-8 overflow-y-auto flex flex-col gap-6">
      <h1 className="text-3xl">إضافة موعد</h1>
      <div className="flex gap-4 flex-wrap justify-center *:flex-grow">
        <div className={classes.createDateCard}>
          <p className="text-2xl">اليوم</p>
          {days.map((day) => {
            if (list.includes(day)) {
              return undefined;
            }

            return (
              <p key={day}>
                <label htmlFor={day} className="cursor-pointer">
                  {arDay(day)}
                </label>
                <input
                  className="mr-1 cursor-pointer"
                  type="checkbox"
                  id={day}
                  checked={addDays.includes(day)}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      let index = addDays.indexOf(day);
                      setAddDays([
                        ...addDays.slice(0, index),
                        ...addDays.slice(index + 1),
                      ]);
                    } else {
                      setAddDays([...addDays, day]);
                    }
                  }}
                />
              </p>
            );
          })}
          {addDays.length === 0 ? (
            <p>رجاءً قم بإختيار يوم واحد على الأقل</p>
          ) : undefined}
        </div>
        <div className={classes.createDateCard}>
          <p className="text-2xl">يبدأ الساعة</p>
          <input
            type="time"
            className={classes.craateDateInp}
            value={start}
            onChange={(e) => {
              setRed(
                !(
                  e.target.value.slice(-2) === "00" ||
                  e.target.value.slice(-2) === "30"
                )
              );
              setStart(e.target.value + ":00");
            }}
          />
          <p className={red ? "text-red-500" : undefined}>
            يجب أن يكون عدد الدقائق 30 أو 0
          </p>
        </div>
        <div className={classes.createDateCard}>
          <p className="text-2xl">المدة</p>
          <div className="flex gap-2">
            <div className="flex flex-col items-center">
              <p>الدقائق</p>
              <div
                onClick={() => {
                  let mins = delay.slice(-5, -3);
                  if (
                    (mins === "30" || delay.slice(0, -6) === "3") &&
                    delay.slice(0, -6) !== "0"
                  ) {
                    setDelay(delay.slice(0, -6) + ":00:00");
                  } else {
                    setDelay(delay.slice(0, -6) + ":30:00");
                  }
                }}
                className={classes.craateDateInp}
              >
                {delay.slice(-5, -3)}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p>الساعات</p>
              <div className={classes.inp + " flex items-center"}>
                <p>{delay.slice(0, -6)}</p>
                <div className="flex flex-col">
                  <div
                    className={
                      classes.craateDateInp + " text-sm cursor-pointer"
                    }
                    onClick={() => {
                      if (!(Number(delay.slice(0, -6)) > 2)) {
                        setDelay(
                          delay.slice(0, -6) === "2"
                            ? "3:00:00"
                            : String(Number(delay.slice(0, -6)) + 1) +
                                delay.slice(-6)
                        );
                      }
                    }}
                    style={{
                      userSelect: "none",
                      msUserSelect: "none",
                      MozUserSelect: "none",
                    }}
                  >
                    ▲
                  </div>
                  <div
                    className={
                      classes.craateDateInp + " text-sm cursor-pointer"
                    }
                    onClick={() => {
                      if (!(Number(delay.slice(0, -6)) < 1)) {
                        setDelay(
                          delay.slice(0, -6) === "1"
                            ? "0:30:00"
                            : String(Number(delay.slice(0, -6)) - 1) +
                                delay.slice(-6)
                        );
                      }
                    }}
                    style={{
                      userSelect: "none",
                      msUserSelect: "none",
                      MozUserSelect: "none",
                    }}
                  >
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <div
          className="p-3 rounded-xl text-white bg-red-500 cursor-pointer"
          onClick={cancel}
        >
          إلغاء
        </div>
        <div
          className="p-3 rounded-xl text-white bg-green-500 cursor-pointer"
          onClick={add}
        >
          إضافة
        </div>
      </div>
    </div>
  );
};

const sendDates = ({
  setLoading,
  setResponse,
  dates,
  onClose,
  refresh
}: {
  setResponse: React.Dispatch<
    React.SetStateAction<DefaultResponse | undefined>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dates: MetaInfo[];
  onClose: () => void;
  refresh: () => void;
}) => {
  fetchPost({
    setResponse,
    setLoading,
    url: `/users/student/editdates/`,
    data: { dates },
    onFinish() {
      setTimeout(() => {
        onClose();
        refresh()
      }, 1500);
    }
  });
};

const Layout: React.FC<{
  dates: MetaInfo[];
  setDates: React.Dispatch<React.SetStateAction<MetaInfo[]>>;
  setAdding: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  defaultDates: MetaInfo[];
  refresh: () => void;
}> = ({ dates, setDates, onClose, defaultDates, setAdding, refresh }) => {
  const [response, setResponse] = useState<DefaultResponse>();
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-full">
      <div className="h-full p-8 overflow-y-auto">
        <p className="text-xl flex flex-col items-center">المواعيد</p>
        <div className={classes.lesson}>
          {dates.map((date, i) => {
            return (
              <p key={dates.indexOf(date)}>
                يوم {arDay(date.day)} الساعة {date.starts.slice(0, -3)} لمدة{" "}
                {date.delay.slice(0, -3)}
                <span
                  onClick={() => {
                    setDates(dates.slice(0, i).concat(dates.slice(i + 1)));
                  }}
                  className={
                    "bg-red-500 py-1 px-2 rounded-xl mr-2 inline-block " +
                    "text-center cursor-pointer"
                  }
                >
                  X
                </span>
              </p>
            );
          })}
        </div>
        <button
          className={
            "p-2 border-2 border-green-500 bg-green-200 " +
            "hover:text-white hover:bg-green-500 border-solid " +
            "rounded-lg transition-all duration-300"
          }
          onClick={() => setAdding(true)}
        >
          إضافة
        </button>
      </div>
      <div className="flex p-2 border-t-2 border-solid border-gray-600 justify-evenly">
        <button
          onClick={onClose}
          className={
            "p-2 border-2 border-red-500 bg-red-200 " +
            "hover:text-white hover:bg-red-500 border-solid " +
            "rounded-lg transition-all duration-300 cursor-pointer"
          }
        >
          إلغاء
        </button>
        {loading ? (
          <Button type="div">
            <div className="animate-spin border-8 border-gray-400 border-t-gray-600 rounded-full w-5 h-5"></div>
          </Button>
        ) : objCompare(
            dates.sort((a, b) => a.day.localeCompare(b.day)),
            defaultDates.sort((a, b) => a.day.localeCompare(b.day))
          ) || dates.length === 0 ? (
          <div
            className={
              "p-2 border-2 border-gray-500 bg-gray-200 " +
              "border-solid rounded-lg transition-all duration-300"
            }
          >
            تعديل
          </div>
        ) : (
          <button
            className={
              "p-2 border-2 border-green-500 bg-green-200 " +
              "hover:text-white hover:bg-green-500 border-solid " +
              "rounded-lg transition-all duration-300"
            }
            onClick={() =>
              sendDates({ dates, setLoading, setResponse, onClose, refresh })
            }
          >
            تعديل
          </button>
        )}
      </div>
      {response !== undefined && (
        <p
          className={`p-6 bg-${
            response && response.succes ? "green" : "red"
          }-300 border-2 border-${
            response && response.succes ? "green" : "red"
          }-500 rounded-xl mt-4`}
        >
          {response === null
            ? "حدث خطأٌ ما"
            : response.succes
            ? "تم بنجاح"
            : "حدث خطأٌ ما"}
        </p>
      )}
    </div>
  );
};

const EditDates = ({
  defaultDates,
  onClose,
  refresh,
}: {
  defaultDates: MetaInfo[];
  onClose: () => void;
  refresh: () => void;
}) => {
  const [dates, setDates] = useState<MetaInfo[]>(defaultDates);
  const [adding, setAdding] = useState(false);

  return adding ? (
    <Add dates={dates} onClose={() => setAdding(false)} setDates={setDates} />
  ) : (
    <Layout
      {...{ dates, defaultDates, onClose, refresh, setAdding, setDates }}
    />
  );
};

export default EditDates;
