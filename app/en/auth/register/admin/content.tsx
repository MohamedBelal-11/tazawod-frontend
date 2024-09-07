/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import PasswordInput from "@/app/components/passwordInput";
import {
  almightyTrim,
  arCharsList,
  charsList,
  numList,
} from "@/app/utils/string";
import { useState } from "react";
import "../student/page.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { backendUrl } from "@/app/utils/auth";
import { motion } from "framer-motion";

const classes = {
  inp: "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 rounded-xl border-solid max-w-96 w-full outline-0 shadow-xl",
  genderCard:
    "flex flex-col items-center gap-3 md:p-6 p-2 rounded-xl border-4 border-solid cursor-pointer ",
  genderImg: "w-48",
  genderP: "text-xl",
};

const Content = () => {
  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [gender, setGender] = useState<"male" | "female">();
  const [about, setAbout] = useState("");
  const [message, setMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        name: almightyTrim(name),
        email: gmail.trim(),
        gender: gender,
        password: password,
        about: about,
      };
      const response = await axios.post(
        backendUrl + "/users/admin/register/",
        data
      );
      if (response.status === 201) {
        setMessage(["Admin account has created"]);
        setLoading(false);

        // Store the password temporarily (e.g., in state or context) until OTP verification
        sessionStorage.setItem(
          "temp_verfiy",
          JSON.stringify({ password: password, gmail: gmail.trim() })
        );
        // Redirect to OTP verification page
        router.push("//auth/verify-otp");
      }
    } catch (error) {
      console.error("Error registering student", error);
      setMessage([
        "An error occurred while creating the admin account: " + error,
      ]);
      setLoading(false);
    }
    setMessage;
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage([]);
    const marksList = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "?",
      "_",
      "-",
      ".",
    ];
    let alive = true;
    if (name.trim() === "") {
      alive = false;
      setMessage((m) => {
        return [...m, "Please fill in the name field."];
      });
    }

    for (let c of almightyTrim(name)) {
      if (![...arCharsList, ...charsList, " "].includes(c)) {
        alive = false;
        setMessage((m) => {
          return [
            ...m,
            "The name must contain only English or Arabic letters.",
          ];
        });
        break;
      }
    }

    if (gmail.trim().length < 11) {
      alive = false;
      setMessage((m) => {
        return [...m, "Please enter your email address."];
      });
    }

    for (const c of gmail.trim().slice(0, gmail.trim().length - 10)) {
      if (![...numList, ...charsList, "-", ".", "_", "+"].includes(c)) {
        alive = false;
        setMessage((m) => {
          return [...m, "Invalid email address"];
        });
      }
    }

    if (!gmail.trim().endsWith("@gmail.com")) {
      alive = false;
      setMessage((m) => {
        return [
          ...m,
          "The email address must be a Gmail address (ending in @gmail.com)",
        ];
      });
    }

    for (let c of password) {
      if (![...charsList, ...numList, ...marksList].includes(c)) {
        alive = false;
        setMessage((m) => {
          return [
            ...m,
            "Password must contain English letters and some of these " +
              "symbols !@#$%^&*_-. and numbers only (no spaces)",
          ];
        });
        break;
      }
    }

    let alive1 = false;
    for (let c of charsList) {
      if (password.includes(c)) {
        alive1 = true;
        break;
      }
    }

    if (!alive1) {
      alive = false;
      setMessage((m) => {
        return [...m, "Password must contain English letters"];
      });
    }

    alive1 = false;
    for (let c of numList) {
      if (password.includes(c)) {
        alive1 = true;
        break;
      }
    }

    if (!alive1) {
      alive = false;
      setMessage((m) => {
        return [...m, "Password must contain numbers"];
      });
    }

    alive1 = false;
    for (let c of marksList) {
      if (password.includes(c)) {
        alive1 = true;
        break;
      }
    }

    if (!alive1) {
      alive = false;
      setMessage((m) => {
        return [
          ...m,
          "Password must contain some of these characters!@#$%^?&*_-.",
        ];
      });
    }

    if (password.length < 8) {
      alive = false;
      setMessage((m) => {
        return [...m, "Password must be at least 8 characters long."];
      });
    }

    if (password !== password2) {
      alive = false;
      setMessage((m) => {
        return [...m, "Passwords do not match"];
      });
    }

    if (!gender) {
      alive = false;
      setMessage((m) => {
        return [...m, "You must specify your gender."];
      });
    }

    if (alive) {
      handleSubmit();
    }
  };

  return (
    <>
      <div className="md:p-12 p-4">
        <form
          onSubmit={submit}
          className="flex p-8 rounded-2xl bg-white shadow-2xl flex-col gap-8"
          noValidate
        >
          <h1 className="text-4xl mb-4">Sign up as an Admin</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Name"
            className={classes.inp}
            maxLength={30}
            required
            autoComplete="name"
          />
          <input
            type="text"
            value={gmail}
            onChange={(e) => {
              setGmail(e.target.value);
            }}
            dir="ltr"
            placeholder="Email"
            className={classes.inp}
            required
            autoComplete="email"
          />
          <PasswordInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className={
              "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 " +
              "w-full rounded-xl border-solid outline-0 shadow-xl pr-12"
            }
            placeholder="Password"
            divclassname="max-w-96 w-full"
            required
            autoComplete="new-password"
            titled="arabic"
            onPaste={(e) => {
              e.preventDefault();
            }}
          />
          <PasswordInput
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
            className={
              "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 " +
              "w-full rounded-xl border-solid outline-0 shadow-xl pr-12"
            }
            placeholder="Password confirm"
            divclassname="max-w-96 w-full"
            autoComplete="new-password"
            required
            onPaste={(e) => {
              e.preventDefault();
            }}
          />
          <h2 className="text-xl">Select your gender</h2>
          <div className="flex justify-evenly">
            <div
              className={
                classes.genderCard +
                (gender == "male"
                  ? "border-sky-500 bg-sky-100"
                  : "border-gray-400")
              }
              onClick={() => {
                setGender("male");
              }}
            >
              <img src="/static/imgs/man.png" className={classes.genderImg} />
              <p className={classes.genderP}>Male</p>
            </div>
            <div
              className={
                classes.genderCard +
                (gender == "female"
                  ? "border-sky-500 bg-sky-100"
                  : "border-gray-400")
              }
              onClick={() => {
                setGender("female");
              }}
            >
              <img src="/static/imgs/woman.png" className={classes.genderImg} />
              <p className={classes.genderP}>Female</p>
            </div>
          </div>
          <textarea
            cols={30}
            className="p-3 text-xl border-2 border-gray-300 focus:border-sky-500 rounded-xl border-solid outline-0 shadow-xl"
            rows={10}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Talk about yourself (optional)"
          />
          {message.length !== 0 ? (
            <p className="p-6 rounded-xl border-4 border-solid border-red-500 bg-red-100 flex flex-col gap-2">
              {message.map((fault, i) => {
                return <p key={i}>{fault}</p>;
              })}
            </p>
          ) : (
            <></>
          )}
          {loading ? (
            <div className="p-4 border-solid border-2 border-green-500 rounded-xl bg-green-500 flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                className="w-6 h-6 border-gray-300 border-solid border-4 border-t-sky-500 rounded-full"
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </div>
          ) : (
            <input
              type="submit"
              className={
                "p-4 bg-green-200 border-solid border-2 border-green-500 rounded-xl " +
                "hover:bg-green-500 hover:text-white transition-all cursor-pointer"
              }
            />
          )}
        </form>
      </div>
    </>
  );
};

export default Content;
