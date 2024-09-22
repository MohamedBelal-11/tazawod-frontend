"use client";
import Button from "@/app/components/button";
import LogoutButton from "@/app/components/logout";
import Popup from "@/app/components/popup";
import { objCompare } from "@/app/utils/object";
import { DefaultResponse, fetchPost } from "@/app/utils/response";
import { almightyTrim, charsList, numList } from "@/app/utils/string";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export type Admin = {
  succes: true;
  user_type: "admin";
  name: string;
  gmail: string;
  is_accepted: boolean;
  description: string;
  owes: number;
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
  description: string;
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
    url: "/users/admin/editdata/",
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
        return [...m, "Please fill in the name field."];
      });
    }

    for (let c of almightyTrim(name)) {
      if (![...numList, ...charsList, " "].includes(c)) {
        alive = false;
        setName((m) => {
          return [
            ...m,
            "The name must contain only English or Arabic letters.",
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
          placeholder="Name"
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
        <textarea
          onChange={(e) =>
            setInputs((inps) => ({ ...inps, description: e.target.value }))
          }
          className={classes["inp"] + "mt-4"}
          value={inputs.description}
          style={{ maxWidth: "none" }}
        ></textarea>
        <p className="mt-6 text-lg">Gender</p>
        <div className={classes["inp"] + "flex flex-wrap justify-evenly"}>
          <div>
            <label htmlFor="male">male</label>
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
            <label htmlFor="female">female</label>
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
        <p className="mt-6 text-lg">Currency</p>
        <div className={classes["inp"] + "flex flex-wrap justify-evenly"}>
          <div>
            <label htmlFor="EGP">EGP</label>
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
            <label htmlFor="USD">USD</label>
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
              ? "Something went wrong"
              : response.succes
              ? "Successfully done"
              : "Something went wrong"}
          </p>
        )}
      </div>
      <div className="flex p-2 border-t-2 border-solid border-gray-600 justify-evenly">
        <Button color="red" className="cursor-pointer" onClick={onClose}>
          cancel
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
            edit
          </Button>
        ) : (
          <Button color="green" type="submit">
            edit
          </Button>
        )}
      </div>
    </form>
  );
};
const AdminContent: React.FC<{ user: Admin; refetch: () => void }> = ({
  user,
  refetch,
}) => {
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
                title={"edit"}
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
          {/* display description */}
          <p className="sm:text-xl text-md ps-2">
            {user.description.split("\n").map((line, i) => (
              <span key={i} className="block py-1">
                {line}
              </span>
            ))}
          </p>
          <p className="text-2xl my-4">
            {user.is_accepted ? "Approved" : "Not approved"}
          </p>
          <div>
            <LogoutButton />
          </div>
        </section>
      </main>
      <Popup onClose={closePopup} visible={popup}>
        {popup && (
          <EditData
            defaultData={{
              name: user.name,
              currency: user.currency,
              description: user.description,
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

export default AdminContent;
