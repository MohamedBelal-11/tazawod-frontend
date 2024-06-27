"use client"
import axios from "axios";
import ArabicLayout from "../components/arabicLayout";
import { useEffect, useState } from "react";

export default function Test() {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const data = {
        name: "hima hima",
        email: "hima@gmail.com",
        gender: "male",
        password: "hamhama56787",
        quraan_days: [{ day: 1, starts: "14:00:00", delay: "2:00:00" }], // Replace with actual IDs
        feqh_days: [{ day: 2, starts: "14:00:00", delay: "2:00:00" }],
        suna_days: [{ day: 3, starts: "16:00:00", delay: "2:00:00" }],
        telawa_days: [{ day: 4, starts: "16:00:00", delay: "2:00:00" }],
      };
      await axios.post("http://127.0.0.1:8000/student/create/", data);
      setMessage("Student registered successfully");
    } catch (error) {
      console.error("Error registering student", error);
      setMessage("Error registering student: " + String(error));
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []); // Empty dependency array to ensure it runs only once

  return (
    <ArabicLayout>
      <h1>{message}</h1>
    </ArabicLayout>
  );
}
