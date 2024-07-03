"use client"
import axios from "axios";
import ArabicLayout from "../components/arabicLayout";
import { useState } from "react";

export default function Test() {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const data = {
        name: "hima hima",
        phone_number: "200128410250",
        gender: "male",
        password: "hamhama56787?",
        quraan_days: [{ day: "sunday", starts: "14:25:00", delay: "2:00:00" }],
      };
      await axios.post("http://127.0.0.1:8000/student/create/", data);
      setMessage("Student registered successfully");
    } catch (error) {
      console.error("Error registering student", error);
      setMessage("Error registering student: " + String(error));
    }
  };

  return (
    <ArabicLayout>
      <h1>{message}</h1>
      <button onClick={handleSubmit}>hhhhhhhhhhhhhhhhh</button>
    </ArabicLayout>
  );
}
