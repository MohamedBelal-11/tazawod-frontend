/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import ArabicFormLayout from "@/app/components/arabicFormLayout";
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
import MyPhoneInput from "@/app/components/phoneInput";
import { motion } from "framer-motion";

const classes = {
  inp: "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 rounded-xl border-solid max-w-96 w-full outline-0 shadow-3xl",
  genderCard:
    "flex flex-col items-center gap-3 md:p-6 p-2 rounded-xl border-4 border-solid cursor-pointer ",
  genderImg: "w-48",
  genderP: "text-xl",
};

const Content = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("20");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [gender, setGender] = useState<"male" | "female">();
  const [preferedTime, setPreferedTime] = useState<
    "morning" | "afternoon" | "night"
  >();
  const [about, setAbout] = useState("");
  const [message, setMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        name: almightyTrim(name),
        phone_number: phoneNumber.trim(),
        gender: gender,
        password: password,
        prefered_time: preferedTime,
        about: about,
      };
      const response = await axios.post(
        backendUrl + "/users/teacher/register/",
        data
      );
      if (response.status === 201) {
        setMessage(["تم تسجيل حساب المعلم"]);

        const token = response.data.token; // this to...
        // Store the token in local storage or any other secure place
        localStorage.setItem("token", token);
        setMessage((m) => {
          return [...m, "تم تسجيل الدخول"];
        }); //                               here will be deleted later
        setLoading(false);
        router.push("/");
        // Store the password temporarily (e.g., in state or context) until OTP verification
        // sessionStorage.setItem("temp_verfiy", JSON.stringify({password: password, phone: phoneNumber}));
        // // Redirect to OTP verification page
        // router.push("/auth/verify-otp");
      }
    } catch (error) {
      console.error("Error registering student", error);
      setMessage(["حدث خطأ أثناء تسجيل حساب المعلم: " + error]);
      setLoading(false);
    }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage([]);
    const marksList = ["!", "@", "#", "$", "%", "^", "&", "*", "?", "_", "-"];
    let alive = true;
    if (name.trim() === "") {
      alive = false;
      setMessage((m) => {
        return [...m, "رجاءً قم بملء خانة الإسم"];
      });
    }

    for (let c of almightyTrim(name)) {
      if (![...arCharsList, ...charsList, " "].includes(c)) {
        alive = false;
        setMessage((m) => {
          return [
            ...m,
            "يجب أن يحتوي الاسم على حروف إنجليزية أو عربية فقط (لا تشكيل)",
          ];
        });
        break;
      }
    }

    if (phoneNumber.length < 9) {
      alive = false;
      setMessage((m) => {
        return [...m, "رجاءً قم بإدخال رقم الهاتف"];
      });
    }

    for (let c of password) {
      if (![...charsList, ...numList, ...marksList].includes(c)) {
        alive = false;
        setMessage((m) => {
          return [
            ...m,
            "يجب أن تحتوي كلمة المرور على حروف إنجليزية وبعض هذه الرموز !@#$%^&*_- و أرقام فقط (لا مسافات)",
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
        return [...m, "يجب أن تحتوي كلمة المرور على حروف إنجليزية"];
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
        return [...m, "يجب أن تحتوي كلمة المرور على أرقام"];
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
          "يجب أن تحتوي كلمة المرور على بعض هذه الرموز !@#$%^?&*_-",
        ];
      });
    }

    if (password.length < 8) {
      alive = false;
      setMessage((m) => {
        return [...m, "يجب أن تتكون كلمة المرور فيما يقل لا يقل عن 8 أحرف"];
      });
    }

    if (password !== password2) {
      alive = false;
      setMessage((m) => {
        return [...m, "كلمتا المرور غير متطابقان"];
      });
    }

    if (!gender) {
      alive = false;
      setMessage((m) => {
        return [...m, "يجب أن تحدد جنسك"];
      });
    }

    if (!preferedTime) {
      alive = false;
      setMessage((m) => {
        return [...m, "يجب أن تحدد وقت العمل المفضل"];
      });
    }

    if (alive) {
      handleSubmit();
    }
  };

  return (
    <ArabicFormLayout>
      <div className="md:p-12 p-4">
        <form
          onSubmit={submit}
          className="flex p-8 rounded-2xl bg-white shadow-2xl flex-col gap-8"
        >
          <h1 className="text-4xl mb-4">تسجيل حساب معلم</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="الاسم"
            className={classes.inp}
            maxLength={30}
            autoComplete="name"
            required
          />
          <MyPhoneInput value={phoneNumber} onChange={setPhoneNumber} />
          {phoneNumber.startsWith("970") && (
            <motion.p
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              animate="visible"
            >
              {"دائمًا في القلب ❤".split("").map((c, i) => (
                <motion.span
                  key={i}
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                  {c}
                </motion.span>
              ))}
            </motion.p>
          )}
          <PasswordInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className={
              "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 w-full rounded-xl border-solid outline-0 shadow-3xl pl-12"
            }
            placeholder="كلمة المرور"
            divclassname="max-w-96 w-full"
            required
            autoComplete="new-password"
            style={{}}
          />
          <PasswordInput
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
            className={
              "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 w-full rounded-xl border-solid outline-0 shadow-3xl pl-12"
            }
            placeholder="تأكيد كلمة المرور"
            divclassname="max-w-96 w-full"
            autoComplete="new-password"
            required
          />
          <h2 className="text-xl">حدد جنسك</h2>
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
              <p className={classes.genderP}>ذكر</p>
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
              <p className={classes.genderP}>أنثى</p>
            </div>
          </div>
          <h2 className="text-xl">وقت العمل المفضل (حسب توقيت مصر)</h2>
          <div className="flex justify-evenly md:gap-4 flex-wrap">
            <div
              className={
                classes.genderCard +
                (preferedTime == "morning"
                  ? "border-sky-500 bg-sky-100"
                  : "border-gray-400") +
                " max-w-56 min-w-20"
              }
              style={{ flexGrow: 1 }}
              onClick={() => {
                setPreferedTime("morning");
              }}
            >
              <div>
                <img src="/static/imgs/morning.png" className="w-full" />
              </div>
              <div>
                <p className="text-center md:text-xl text-md mb-4">الصباح</p>
                <p className="md:text-base text-sm">من الفجر الي الظهر</p>
              </div>
            </div>
            <div
              className={
                classes.genderCard +
                (preferedTime == "afternoon"
                  ? "border-sky-500 bg-sky-100"
                  : "border-gray-400") +
                " max-w-56 min-w-20"
              }
              style={{ flexGrow: 1 }}
              onClick={() => {
                setPreferedTime("afternoon");
              }}
            >
              <div>
                <img src="/static/imgs/afternoon.png" className="w-full" />
              </div>
              <div>
                <p className="text-center md:text-xl text-md mb-4">
                  بعد الظهيرة
                </p>
                <p className="md:text-base text-sm">من الظهر الي العشاء</p>
              </div>
            </div>
            <div
              className={
                classes.genderCard +
                (preferedTime == "night"
                  ? "border-sky-500 bg-sky-100"
                  : "border-gray-400") +
                " max-w-56 min-w-20"
              }
              style={{ flexGrow: 1 }}
              onClick={() => {
                setPreferedTime("night");
              }}
            >
              <div>
                <img src="/static/imgs/night.png" className="w-full" />
              </div>
              <div>
                <p className="text-center md:text-xl text-md mb-4">ليلًا</p>
                <p className="md:text-base text-sm">من العشاء حتى الفجر</p>
              </div>
            </div>
          </div>
          <textarea
            cols={30}
            className="p-3 text-xl border-2 border-gray-300 focus:border-sky-500 rounded-xl border-solid outline-0 shadow-3xl"
            rows={10}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="تحدث عن نفسك (اختياري)"
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
    </ArabicFormLayout>
  );
};

export default Content;
