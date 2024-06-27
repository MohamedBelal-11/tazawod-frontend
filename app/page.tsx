/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import ArabicLayout from "./components/arabicLayout";
import React from "react";
import Link from "next/link";
import lessonsList from "./utils/lessonsList";
import globalClasses from "./utils/globalClasses";

export const metadata: Metadata = {
  title: "الصفحة الرئيسية - أكادمية تزود",
};

const classes = {
  header:
    "w-full flex justify-center items-center flex-nowrap gap-4 sm:gap-8 bg-white py-20",
  cardsContainer: "flex flex-nowrap gap-8 my-4 py-12 w-full overflow-x-auto",
};



export default function Home() {
  return (
    <ArabicLayout>
      <header className={classes.header}>
        <img src="/static/imgs/logo-green.png" className="max-w-lg w-3/5" />
        <img src="/static/imgs/quran.gif" className="max-w-48 w-1/6" />
      </header>
      <main className={globalClasses.main}>
        <section>
          <h2>
            <span className={globalClasses.sectionHeader}>الدروس المتاحة</span>
          </h2>
          <div className={classes.cardsContainer}>
            <div></div>
            {lessonsList.map((lesson) => {
              return (
                <Link
                  href={`/lessons/${lesson.id}`}
                  key={lesson.id}
                  className="px-8 rounded-3xl bg-white *:my-4 *:text-nowrap py-4 block transition-all duration-300 hover:scale-110 w-max *:w-max"
                >
                  <p className="text-3xl font-bold">{lesson.title}</p>
                  {lesson.gender === "male" ? (
                    <p className="text-2xl font-bold">
                      المعلم: {lesson.teacher}
                    </p>
                  ) : (
                    <></>
                  )}

                  <p
                    className={`text-2xl font-bold`}
                    style={{
                      color: lesson.gender === "male" ? "#00b5ff" : "#ff6a84",
                    }}
                  >
                    {lesson.gender === "male" ? "رجال" : "نساء"}
                  </p>
                  <p className="text-2xl font-bold">
                    {lesson.price} ج.م. شهريًا
                  </p>
                </Link>
              );
            })}
            <div></div>
          </div>
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
