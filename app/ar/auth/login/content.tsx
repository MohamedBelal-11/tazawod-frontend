"use client";
import PasswordInput from "@/app/components/passwordInput";
import { backendUrl } from "@/app/utils/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const Content = () => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to handle form submission for login
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    try {
      // Prepare data to be sent to the server
      const data = {
        email: gmail.trim(), // Gmail number entered by the user
        password: password, // Password entered by the user
      };

      // Send a POST request to the server to log in the user
      const response = await axios.post(
        backendUrl + "/users/login/", // URL for login endpoint
        data // Data to be sent in the request body
      );

      // Check the response status
      if (response.status === 200) {
        // If the status code is 200, the login was successful

        // Get the token from the response data
        const token = response.data.token;

        // Store the token in the browser's local storage
        localStorage.setItem("token", token);

        // Set a success message to be displayed to the user
        setMessage("تم تسجيل الدخول");
        setLoading(false);
        // Redirect the user to the home page
        router.push("/");
      } else if (response.status === 400) {
        // If the status code is 400, there was an error with the login credentials

        // Set an error message to be displayed to the user
        setMessage("كلمة المرور أو عنوان البريد الإلكتروني خاطئ");
      }
    } catch (error) {
      // If there was an error during the login process, log the error and display an error message
      console.error("Error registering student", error);
      setLoading(false);
      setMessage("كلمة المرور أو عنوان البريد الإلكتروني خاطئ");
    }
  };

  return (
    <>
      <div className="md:p-12 p-4">
        <form
          onSubmit={handleSubmit}
          className="flex p-8 rounded-2xl bg-white shadow-2xl flex-col gap-8"
        >
          <h1 className="text-3xl font-bold">تسجيل الدخول</h1>
          <input
            type="text"
            value={gmail}
            onChange={(e) => {
              setGmail(e.target.value);
            }}
            dir="ltr"
            placeholder="البريد الإلكتروني"
            className={
              "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 rounded-xl border-solid max-w-96 w-full outline-0 shadow-xl"
            }
            autoComplete="email"
          />
          <PasswordInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className={
              "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 " +
              "w-full rounded-xl border-solid outline-0 shadow-xl pl-12"
            }
            placeholder="كلمة المرور"
            divclassname="max-w-96 w-full"
            style={{}}
          />
          {message !== "" ? (
            <p className="bg-sky-200 border-solid border-2 border-sky-500 p-3 rounded-xl">
              {message}
            </p>
          ) : null}

          {loading ? (
            <div className="p-4 border-solid border-2 border-green-500 rounded-xl bg-green-500 flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                className="w-6 h-6 border-gray-300 border-solid border-4 border-t-sky-500 rounded-full"
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </div>
          ) : (
            <button
              type="submit"
              className="bg-green-200 p-3 rounded-xl border-solid border-2 border-green-500 hover:bg-green-500 hover:text-white transition-all"
            >
              تسجيل الدخول
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default Content;
