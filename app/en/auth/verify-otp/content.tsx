"use client";
import { numList } from "@/app/utils/string";
import { FormEvent, useEffect, useRef, useState } from "react";
import "./page.modules.css";
import axios from "axios";
import { backendUrl } from "@/app/utils/auth";
import { useRouter } from "next/navigation";

const submit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault;
};

const DigitInput = ({
  value,
  index,
  focused,
}: {
  value: string;
  index: number;
  focused: boolean;
}) => {
  return (
    <div
      className={`bg-white lg:p-8 md:p-6 sm:p-4 p-1 sm:rounded-2xl rounded-lg border-solid sm:border-4 border-2 sm:text-4xl text-lg cursor-text ${
        value.length === index && focused ? "border-sky-500" : "border-gray-500"
      }`}
    >
      {value.length === index && focused ? (
        "|"
      ) : value.length < index ? (
        <div className="w-full md:h-8 h-6"></div>
      ) : (
        value[index]
      )}
    </div>
  );
};

export default function Content() {
  const [otp, setOtp] = useState("");
  const [focused, setFocused] = useState(true);
  const [message, setMessage] = useState<string>();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const verifyOTP = async () => {
      try {
        const verify_temp: { password: string; gmail: string } = JSON.parse(
          sessionStorage.getItem("temp_verfiy")!
        ); // Retrieve the temporary password
        const response = await axios.post(backendUrl + "/users/verify-otp/", {
          email: verify_temp.gmail,
          otp: otp,
          password: verify_temp.password,
        });
        if (response.data.success) {
          const token = response.data.token;
          // Store the token in local storage or any other secure place
          localStorage.setItem("token", token);
          setMessage("You are logged in.");
          sessionStorage.removeItem("temp_verfiy");
          router.push("/");
        } else {
          console.error("OTP verification failed", response.data.message);
          setMessage("Something went wrong please check the code");
        }
      } catch (error) {
        console.error("Error verifying OTP", error);
        setMessage("Something went wrong please check the code");
      }
    };
    if (otp.length === 6) {
      verifyOTP();
    }
  }, [otp, router]);

  return (
    <>
      <div className="md:p-12 p-4 flex justify-center items-center h-screen">
        <form onSubmit={submit} className="bg-white p-8 rounded-4xl">
          <h1 className="text-center sm:text-4xl text-xl sm:m-4 mb-2">
            A code has been sent to your email.
          </h1>
          <div
            className="flex bg-white lg:p-8 md:p-6 rounded-2xl sm:gap-4 gap-2 justify-center"
            onClick={() => {
              inputRef.current!.focus();
            }}
          >
            <DigitInput value={otp} index={0} focused={focused} />
            <DigitInput value={otp} index={1} focused={focused} />
            <DigitInput value={otp} index={2} focused={focused} />
            <DigitInput value={otp} index={3} focused={focused} />
            <DigitInput value={otp} index={4} focused={focused} />
            <DigitInput value={otp} index={5} focused={focused} />
          </div>
          {message !== undefined && (
            <p className="p-4 bg-blue-300 text-center rounded-lg border-2 border-blue-500">
              {message}
            </p>
          )}
          <input
            type="text"
            value={otp}
            ref={inputRef}
            style={{
              opacity: "0",
              zIndex: -1,
              position: "absolute",
              bottom: "10px",
              right: "50%",
              translate: "50%",
              width: "1px",
              height: "1px",
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value;
              if (value.length <= 6) {
                let alive = true;
                for (let c of value) {
                  if (![...numList].includes(c)) {
                    alive = false;
                    break;
                  }
                }
                if (alive) {
                  setOtp(value);
                }
              }
            }}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
            autoFocus
          />
        </form>
      </div>
    </>
  );
}
