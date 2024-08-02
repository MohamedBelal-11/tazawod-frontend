"use client";
import Button, { getClass } from "@/app/components/button";
import { get } from "@/app/utils/docQuery";
import Link from "next/link";
import { useEffect, useState } from "react";

type Responset =
  | {
      student: true;
      subscribed: boolean;
      total: number;
      currency: "EGP" | "USD";
      ID: string;
      freeTierUsed: boolean;
    }
  | {
      student: false;
    }
  | null;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();

  useEffect(() => {
    setResponse({
      student: true,
      subscribed: true,
      currency: "EGP",
      ID: "aaasff",
      total: 55.5,
      freeTierUsed: false,
    });
  }, []);

  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight: "calc(100vh - 110px)" }}
    >
      {response && !response.student ? (
        <div className="p-10 text-xl font-semibold bg-white rounded-2xl">
          أنت لست مسجلًا كطالب
        </div>
      ) : (
        <main className="p-5 rounded-2xl bg-white flex-col items-center gap-4">
          <p className="text-2xl">إشتراك</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button className="w-56 text-xl" color="sky">
              الإشتراك عن طريق التواصل مع مشرف
            </Button>
            <Button className="w-56 text-xl" color="green">
              الإشتراك عن طريق المحفظة أو البطاقة المصرفية
            </Button>
            {Boolean(response && !response.freeTierUsed) && (
              <Button className="w-56 text-xl" color="amber">
                الإسبوع المجاني
              </Button>
            )}
          </div>
          {Boolean(response) && (
            <div className="flex-col items-center gap-3">
              <p className="text-2xl">
                إجمالي المبلغ {response?.total.toFixed(2)}{" "}
                {response?.currency === "EGP" ? "جنيه مصري" : "دولار أمريكي"}
              </p>
              <Link
                href={
                  "/ar/students/student/" + response?.ID + "#edit-dates-button"
                }
                className={getClass({ color: "emerald" })}
              >
                تغيير المواعيد
              </Link>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default Content;
