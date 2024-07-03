/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import ArabicLayout from "./components/arabicLayout";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import globalClasses from "./utils/globalClasses";
import { date, weekday } from "./utils/students";
import { hrNumber, numHours } from "./utils/time";
import { arDay } from "./utils/arabic";
import axios from "axios";
import LoadingDiv from "./components/loadingDiv";

const secondsToHrs = (seconds: number) => {
  return (seconds / 60) / 60
}

type responset =
  | {
      name: string;
      userType: "student";
      subscribed: boolean;
      quraan_days: date[];
      notes: {
        teacher: string;
        rate: number;
        discription: string;
        day: weekday;
        date: string;
      }[];
    }
  | { name: string; userType: "teacher" }
  | null;

const classes = {
  header:
    "w-full flex justify-center items-center flex-nowrap gap-4 sm:gap-8 bg-white py-20",
  cardsContainer: "flex flex-nowrap gap-8 my-4 py-12 w-full overflow-x-auto",
};

export default function Content() {
  const [response, setResponse] = useState<responset>();
  const [lodaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    // Define an asynchronous function named fetchData.
    // This function will make an HTTP GET request to the server to retrieve data.
    // The request includes an Authorization header with a token.
    // The token is retrieved from the local storage.
    const fetchData = async () => {
      // Retrieve the token from the local storage.
      const token = localStorage.getItem("token");

      try {
        // Make an HTTP GET request to the server.
        // The URL is "http://localhost:8000/home/".
        // The request includes an Authorization header with the token.
        const respons = await axios.get("https://mohamed11belal.pythonanywhere.com/api/home/", {
          headers: {
            // Set the Authorization header to include the token.
            Authorization: `Token ${token}`,
          },
        });

        // If the request is successful, update the response state with the data received from the server.
        console.log(respons.data)
        setResponse(respons.data);
      } catch (error) {
        // If there is an error, log the error to the console.
        console.error(error);
      }
    };
    fetchData();
  }, []);
  if (response) {
    if (response.userType === "student") {
      return (
        <ArabicLayout username={response.name}>
          <header className={classes.header}>
            <img src="/static/imgs/logo-green.png" className="max-w-lg w-3/5" />
            <img src="/static/imgs/quran.gif" className="max-w-48 w-1/6" />
          </header>
          <main className={globalClasses.main}>
            <section>
              <h2>
                <span className={globalClasses.sectionHeader}>دروسك</span>
              </h2>
              <div className={classes.cardsContainer}>
                <div></div>
                {response.quraan_days.map((date, i) => {
                  return (
                    <div
                      key={i}
                      className="px-8 rounded-3xl bg-white *:my-4 *:text-nowrap py-4 block transition-all duration-300 hover:scale-110 w-max *:w-max"
                    >
                      <p className="text-3xl font-bold">{arDay(date.day)}</p>
                      <p className="text-2xl">
                        يبدأ الساعة {date.starts.slice(0, -3)}
                      </p>

                      <p>
                        ينتهي الساعة{" "}
                        {hrNumber(numHours(date.starts) + secondsToHrs(+date.delay))}
                      </p>
                    </div>
                  );
                })}
                <div></div>
              </div>
            </section>
            {response.notes && response.notes.length !== 0 ? (
              <section>
                <h2>
                  <span className={globalClasses.sectionHeader}>
                    آخر التقارير
                  </span>
                </h2>
                <div>
                  {response.notes.map((note, i) => {
                    return (
                      <div key={i} className="p-8 bg-white rounded-3xl my-6">
                        <h3 className="flex justify-between text-2xl font-semibold">
                          <span>{arDay(note.day) + " " + note.date}</span>
                          <span>
                            {note.rate}/<span className="text-sm">10</span>
                          </span>
                        </h3>
                        <div className="my-6 text-xl font-reguler">
                          {note.discription.split("\n").map((line, i) => {
                            return (
                              <p className="my-2" key={i}>
                                {line}
                              </p>
                            );
                          })}
                        </div>
                        <p className="flex justify-end text-3xl font-reguler">
                          المعلم: {note.teacher}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : undefined}
          </main>
        </ArabicLayout>
      );
    }
  }
  return (
    <ArabicLayout>
      <LoadingDiv loading={!lodaded} />
      <header className={classes.header}>
        <img src="/static/imgs/logo-green.png" className="max-w-lg w-3/5" />
        <img src="/static/imgs/quran.gif" className="max-w-48 w-1/6" />
      </header>
      <main className={globalClasses.main}>
        <section>
        </section>
        <section className="flex justify-center">
          <div className="bg-white p-8 rounded-3xl">
            <p className="text-2xl">
              يجب عليك تسجيل الدخول أولًا قبل الإشتراك في أي درس
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link className="p-2 rounded-xl block bg-gray-300" href="">
                تسجيل دخول
              </Link>
              <Link
                className="p-2 rounded-xl block bg-green-600 text-white"
                href=""
              >
                تسجيل حساب
              </Link>
            </div>
          </div>
        </section>
      </main>
    </ArabicLayout>
  );
}
