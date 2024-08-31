"use client";
import Button, { getClass } from "@/app/components/button";
import { fetchResponse } from "@/app/utils/response";
import Link from "next/link";
import { useEffect, useState } from "react";

type Responset =
  | {
      succes: true;
      more_than_nine: boolean;
      total: number;
      currency: "EGP" | "USD";
      ID: string;
      freeTierUsed: boolean;
    }
  | {
      succes: false;
    }
  | null;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();

  useEffect(() => {
    fetchResponse({
      setResponse,
      url: "api/subscribe-page/",
    });
  }, []);

  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight: "calc(100vh - 110px)" }}
    >
      {response && !response.succes ? (
        <div className="p-10 text-xl font-semibold bg-white rounded-2xl">
          أنت لست مسجلًا كطالب
        </div>
      ) : (
        <main className="p-5 rounded-2xl bg-white flex-col items-center gap-4">
          <p className="text-2xl">إشتراك</p>
          {response && response.more_than_nine ? (
            <div className="p-10 text-xl text-center font-semibold bg-white rounded-2xl">
              متبقى بالفعل أكثر من 9 أيام على نهاية الإشتراك
            </div>
          ) : (
            <div className="flex gap-3 flex-wrap justify-center">
              <Link
                href="/ar/admin"
                className={getClass({ color: "sky" }) + " w-56 text-xl"}
              >
                الإشتراك عن طريق التواصل مع مشرف
              </Link>
              <Button className="w-56 text-xl" color="green">
                الإشتراك عن طريق البطاقة المصرفية
              </Button>
              {Boolean(response && !response.freeTierUsed) && (
                <Button className="w-56 text-xl" color="amber">
                  الإسبوع المجاني
                </Button>
              )}
            </div>
          )}
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
              <p className="text-xl">
                الغير قادر تحمل التكلف يمكنه التواصل مع مشرف لتخفيض السعر
              </p>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default Content;
