"use client";
import Button from "@/app/components/button";
import { fetchResponse } from "@/app/utils/response";
import { useCallback, useEffect, useState } from "react";

type AdminOwe = {
  name: string;
  email: string;
  id: string;
  owes: number;
};

type Responset =
  | {
      succes: true;
      currency: "EGP" | "USD";
      adminOwes: AdminOwe[];
      has_more: boolean;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const paidAdmin = (id: string, refetch: () => void) => {
  fetchResponse({
    setResponse: () => undefined,
    url: `/admin-paid/${id}/`,
    onFinish: refetch,
  });
};

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    const query = new URLSearchParams({ page: "1" });
    fetchResponse({
      setResponse,
      url: "/api/admin-owes/",
      query: query.toString(),
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      Boolean(response && response.succes && response.has_more) &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, response]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page !== 1) {
      const query = new URLSearchParams({ page: page.toString() });
      fetchResponse({
        setResponse,
        url: "/api/admin-owes/",
        query: query.toString(),
        setLoading,
      });
    }
  }, [page]);

  const refetch = useCallback(() => {
    const query = new URLSearchParams({ page: page.toString() });
    fetchResponse({
      setResponse,
      url: "/api/admin-owes/",
      query: query.toString(),
      setLoading,
    });
  }, [page]);

  if (response === null) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }

  if (response && !response.succes) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }

  return (
    <div className="p-2">
      <main
        style={
          response === undefined ||
          (Boolean(response) && response?.adminOwes.length === 0)
            ? { minHeight: "calc(100vh - 110px)" }
            : undefined
        }
        className={
          "p-4 rounded-xl bg-white" +
          (response === undefined ||
          (Boolean(response) && response?.adminOwes.length === 0)
            ? " flex items-center justify-center"
            : "")
        }
      >
        {response === undefined ? (
          <div
            className={
              "border-solid border-gray-200 border-t-green-600 " +
              "w-24 h-24 animate-spin rounded-full"
            }
            style={{ borderWidth: "12px" }}
          ></div>
        ) : response.adminOwes.length === 0 ? (
          <p className="text-xl text-gray-400">
            لا يوجد أي إشتراكات لم يتم دفعها
          </p>
        ) : (
          response.adminOwes.map(({ email, name, owes, id }, i) => (
            <div
              key={i}
              className={
                "rounded-xl p-5 flex justify-between text-xs " +
                "sm:text-lg mb-4 last:mb-0 border-gray-700 border-b-2 bg-white"
              }
            >
              <div>
                <p className="mb-4">{name}</p>
                <a
                  href={
                    "https://mail.google.com/mail/?view=cm&fs=1&to=" +
                    email +
                    "&su=مراسلة+بشأن+إشتراكاتك &body="
                  }
                  target="_blank"
                  dir="ltr"
                  className="hover:text-green-600 hover:underline"
                >
                  {email}
                </a>
              </div>
              <div>
                <p className="mb-4">
                  {owes.toFixed(2) +
                    (response.currency === "EGP"
                      ? " جنيه مصري"
                      : " دولار أمريكي")}
                </p>
                <Button
                  padding={1}
                  size="xs"
                  className="sm:text-base sm:p-2"
                  onClick={() => paidAdmin(id, refetch)}
                >
                  تم الدفع
                </Button>
              </div>
            </div>
          ))
        )}
      </main>
      {loading && (
        <div className="justify-center flex bg-white">
          <div
            className={
              "border-solid border-gray-200 border-t-green-600 " +
              "w-24 h-24 animate-spin rounded-full"
            }
            style={{ borderWidth: "12px" }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Content;
