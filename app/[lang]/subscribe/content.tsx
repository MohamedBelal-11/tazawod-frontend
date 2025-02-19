"use client";
import Button, { getClass } from "@/app/components/button";
import Copier from "@/app/components/copier";
import { fetchResponse } from "@/app/utils/response";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchResponse({
      setResponse,
      url: "/api/subscribe-page/",
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
                href="/ar/subscribe/get-admin"
                className={getClass({ color: "sky" }) + " w-56 text-xl"}
              >
                الإشتراك عن طريق التواصل مع مشرف
              </Link>
              <CreditSubscipeButton />
              {Boolean(response && !response.freeTierUsed) && (
                <Button
                  className="w-56 text-xl"
                  color="amber"
                  onClick={
                    loading
                      ? undefined
                      : () =>
                          fetchResponse({
                            setResponse: () => {},
                            url: "/users/use-free/",
                            onFinish(succes) {
                              if (succes) {
                                router.push("/ar");
                              }
                            },
                            setLoading,
                          })
                  }
                >
                  {loading ? (
                    <div
                      className={
                        "rounded-full border-[12px] border-gray-300 " +
                        "border-t-gray-500 animate-spin"
                      }
                    ></div>
                  ) : (
                    "الإسبوع المجاني"
                  )}
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
                الغير قادر تحمل التكلفة يمكنه التواصل مع مشرف لتخفيض السعر
              </p>
            </div>
          )}
          <div className="flex w-full justify-between gap-3">
            <p className="text-xl">
              يمكنك أيضًا الإشتراك عن طريق التواصل مع مشرف الرئيسي:{" "}
              <a href="tel:+201060512152">+201060512152</a>
            </p>
            <Copier copy="+201060512152" arabic />
          </div>
        </main>
      )}
    </div>
  );
};

type Responset1 =
  | { succes: true; payment_url: string }
  | { succes: false; error?: number }
  | null;

const CreditSubscipeButton: React.FC = () => {
  const [response, setResponse] = useState<Responset1>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (response && response.succes) {
      window.location.href = response.payment_url;
    }
  }, [response]);

  return (
    <Button
      onClick={
        loading || (response && response.succes)
          ? undefined
          : () => {
              fetchResponse({
                setResponse,
                url: "/api/subscribe-iframe/",
                setLoading,
              });
            }
      }
      className="w-56 text-xl"
      color="green"
    >
      الإشتراك عن طريق البطاقة المصرفية
    </Button>
  );
};

export default Content;
