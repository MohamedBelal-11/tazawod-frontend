"use client";
import Button from "@/app/components/button";
import Checker from "@/app/components/Checker";
import Popup from "@/app/components/popup";
import { objCompare } from "@/app/utils/object";
import { DefaultResponse, fetchPost } from "@/app/utils/response";
import { almightyTrim, arCharsList, charsList } from "@/app/utils/string";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
export type Superadmin = {
  succes: true;
  user_type: "superadmin";
  name: string;
  gmail: string;
  appear: boolean;
  other_gender: boolean;
  hour_price: number;
  currency: "EGP" | "USD";
  gender: "male" | "female";
};

const classes: { [key: string]: string } = {
  td: "sm:text-2xl border-2 border-solid border-gray-500 sm:p-4 p-1 text-center",
  section: "rounded-xl bg-white border-4 border-solid border-gray-500 ",
  inp:
    "p-2 text-lg border-2 border-gray-300 focus:border-sky-500 " +
    "rounded-lg border-solid max-w-96 w-full outline-0 shadow-xl ",
};

type DataEdit = {
  name: string;
  gender: "male" | "female";
  currency: "EGP" | "USD";
};

const sendEditedData = ({
  data,
  setLoading,
  setResponse,
  onClose,
  refetch,
}: {
  data: { [key: string]: any };
  setResponse: React.Dispatch<
    React.SetStateAction<DefaultResponse | undefined>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  onClose: () => void;
}) => {
  fetchPost({
    data,
    setResponse,
    url: "/users/superadmin/editdata/",
    setLoading,
    onFinish: () => {
      setTimeout(() => {
        onClose();
        refetch();
      }, 1500);
    },
  });
};

const EditData: React.FC<{
  defaultData: DataEdit;
  onClose: () => void;
  refetch: () => void;
}> = ({ defaultData, onClose, refetch }) => {
  // create inputs state
  const [inputs, setInputs] = useState<DataEdit>(defaultData);
  // create message state
  const [message, setMesssage] = useState<{ name: string[] }>({ name: [] });
  const [response, setResponse] = useState<DefaultResponse>();
  const [loading, setLoading] = useState(false);

  const setName = (method: (name: string[]) => string[]) => {
    setMesssage((m) => ({ ...m, name: method(m.name) }));
  };

  const checkName = (name: string) => {
    setName(() => []);
    let alive = true;
    // let tmpList: any[][] = [];
    if (name.trim() === "") {
      alive = false;
      setName((m) => {
        return [...m, "رجاءً قم بملء خانة الإسم"];
      });
    }

    for (let c of almightyTrim(name)) {
      if (![...arCharsList, ...charsList, " "].includes(c)) {
        alive = false;
        setName((m) => {
          return [
            ...m,
            "يجب أن يحتوي الاسم على حروف إنجليزية أو عربية فقط (لا تشكيل)",
          ];
        });
        break;
      }
    }

    if (alive) {
      setName(() => []);
    }
  };

  // return the jsx
  return (
    <form
      className="h-full flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        sendEditedData({
          data: {
            ...inputs,
            name: almightyTrim(inputs.name),
          },
          onClose,
          refetch,
          setLoading,
          setResponse,
        });
      }}
      style={{ maxWidth: 800, maxHeight: "85vh", width: "calc(100vw - 40px)" }}
    >
      <div
        className="overflow-y-auto p-4 flex flex-col items-center h-full w-full"
        style={{ flexGrow: 1 }}
      >
        <input
          type="text"
          value={inputs.name}
          onChange={(e) => {
            setInputs((inps) => ({ ...inps, name: e.target.value }));
            checkName(e.target.value);
          }}
          placeholder="الاسم"
          className={classes["inp"]}
          maxLength={30}
          autoComplete="name"
        />
        {message.name.length > 0 && (
          <div className="p-2 rounded-lg bg-red-100 border-red-500 border-solid border-2">
            {message.name.map((fault, i) => (
              <p key={i}>{fault}</p>
            ))}
          </div>
        )}
        <p className="mt-6 text-lg">الجنس</p>
        <div className={classes["inp"] + "flex flex-wrap justify-evenly"}>
          <div>
            <label htmlFor="male">ذكر</label>
            <input
              type="radio"
              id="male"
              checked={inputs.gender === "male"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, gender: "male" }))
              }
            />
          </div>
          <div>
            <label htmlFor="female">أنثى</label>
            <input
              type="radio"
              id="female"
              checked={inputs.gender === "female"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, gender: "female" }))
              }
            />
          </div>
        </div>
        <p className="mt-6 text-lg">العملة</p>
        <div className={classes["inp"] + "flex flex-wrap justify-evenly"}>
          <div>
            <label htmlFor="EGP">جنيه مصري</label>
            <input
              type="radio"
              id="EGP"
              checked={inputs.currency === "EGP"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, currency: "EGP" }))
              }
            />
          </div>
          <div>
            <label htmlFor="USD">دولار أمريكي</label>
            <input
              type="radio"
              id="USD"
              checked={inputs.currency === "USD"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, currency: "USD" }))
              }
            />
          </div>
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
      <div className="flex p-2 border-t-2 border-solid border-gray-600 justify-evenly">
        <Button color="red" className="cursor-pointer" onClick={onClose}>
          إلغاء
        </Button>
        {loading ? (
          <Button type="div">
            <div className="animate-spin border-8 border-gray-400 border-t-gray-600 rounded-full w-5 h-5"></div>
          </Button>
        ) : objCompare(
            { ...inputs, name: almightyTrim(inputs.name) },
            defaultData
          ) ? (
          <Button color="gray" type="div" textHov="black">
            تعديل
          </Button>
        ) : (
          <Button color="green" type="submit">
            تعديل
          </Button>
        )}
      </div>
    </form>
  );
};

type SuperData = {
  appear: boolean;
  hour_price: number;
  other_gender: boolean;
};

const sendSuperData = ({
  data,
  setLoading,
  setResponse,
  refetch,
}: {
  data: SuperData;
  setResponse: React.Dispatch<
    React.SetStateAction<DefaultResponse | undefined>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}) => {
  fetchPost({
    data,
    setResponse,
    url: "/users/edit-super-data/",
    setLoading,
    onFinish() {
      refetch();
    },
  });
};

const EditSuperData: React.FC<{
  defaultData: SuperData;
  refetch: () => void;
}> = ({ defaultData, refetch }) => {
  const [data, setData] = useState({
    ...defaultData,
    hour_price: String(defaultData.hour_price),
  });
  const [response, setResponse] = useState<DefaultResponse>();
  const [loading, setLoading] = useState(false);
  const areEqual = objCompare(data, {
    ...defaultData,
    hour_price: String(defaultData.hour_price),
  });

  return (
    <section className={classes["section"] + "p-4 mb-2"}>
      <div>
        <Checker
          type="switch"
          id="appear"
          label="الظهور للمشرفين والمعلمين"
          checked={data.appear}
          setChecked={(b) => setData((d) => ({ ...d, appear: b }))}
        />
        <Checker
          type="switch"
          id="appear"
          label="السماح لك برؤية المستخدمين من الجنس الأخر"
          checked={data.other_gender}
          setChecked={(b) => setData((d) => ({ ...d, other_gender: b }))}
        />
        <div className="flex gap-2 items-center">
          <div>سعر الساعة</div>
          <input
            value={data.hour_price}
            className={classes["inp"]}
            onChange={(e) =>
              setData((d) => ({ ...d, hour_price: e.target.value }))
            }
            dir="ltr"
          />
          <div>دولار أمريكي</div>
        </div>
        {Number.isNaN(+data.hour_price) && (
          <p className="text-red-500">ليس رقما</p>
        )}
        {+data.hour_price < 0.1 && (
          <p className="text-red-500">لا يجب أن يكون أقل من 0.1</p>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4 border-gray-500 border-t-2 pt-2">
        <Button
          onClick={
            areEqual || loading
              ? undefined
              : () =>
                  setData({
                    ...defaultData,
                    hour_price: String(defaultData.hour_price),
                  })
          }
          color={areEqual || loading ? "gray" : "red"}
          textHov={areEqual || loading ? "black" : undefined}
        >
          إلغاء
        </Button>
        {loading ? (
          <Button type="div">
            <div className="animate-spin border-8 border-gray-400 border-t-gray-600 rounded-full w-5 h-5"></div>
          </Button>
        ) : (
          <Button
            onClick={
              areEqual ||
              Number.isNaN(+data.hour_price) ||
              +data.hour_price < 0.1
                ? undefined
                : () =>
                    sendSuperData({
                      data: { ...data, hour_price: +data.hour_price },
                      refetch,
                      setLoading,
                      setResponse,
                    })
            }
            color={
              areEqual ||
              Number.isNaN(+data.hour_price) ||
              +data.hour_price < 0.1
                ? "gray"
                : undefined
            }
            textHov={
              areEqual ||
              Number.isNaN(+data.hour_price) ||
              +data.hour_price < 0.1
                ? "black"
                : undefined
            }
          >
            حفظ
          </Button>
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
    </section>
  );
};

const SuperadminContent: React.FC<{
  user: Superadmin;
  refetch: () => void;
}> = ({ user, refetch }) => {
  const [popup, setPopup] = useState(false);

  const closePopup = () => setPopup(false);

  return (
    <>
      <main className="sm:px-8 sm:py-4 py-2">
        <section className={classes["section"] + "p-4 mb-2"}>
          {/* dispaly name */}
          <h1
            className={`sm:text-4xl text-2xl font-bold mb-4 flex items-center justify-between`}
          >
            <>
              <span>{user.name}</span>
              <span
                className={
                  "p-2 rounded-full border-2 border-solid border-gray-500 " +
                  "duration-300 cursor-pointer hover:text-white " +
                  "transition-all hover:bg-sky-600 hover:border-sky-600"
                }
                title={"تعديل"}
                onClick={() => setPopup(true)}
              >
                <PencilIcon width={20} />
              </span>
            </>
          </h1>
          {/* display gmail */}
          <h2 className="sm:text-3xl text-xl mt-4 font-bold">
            <span dir="ltr">{user.gmail}</span>
          </h2>
        </section>
        <EditSuperData
          defaultData={{
            appear: user.appear,
            hour_price: user.hour_price,
            other_gender: user.other_gender,
          }}
          refetch={refetch}
        />
      </main>
      <Popup onClose={closePopup} visible={popup}>
        {popup && (
          <EditData
            defaultData={{
              name: user.name,
              currency: user.currency,
              gender: user.gender,
            }}
            refetch={refetch}
            onClose={closePopup}
          />
        )}
      </Popup>
    </>
  );
};

export default SuperadminContent;
