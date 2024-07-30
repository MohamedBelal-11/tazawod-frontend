"use client"
import { useState } from "react";

type Notificationt = {
  title: string;
  link: string;
  external: Boolean
}

type Responset = {
  succes: true;
  notifications: Notificationt[]
} | {
  succes: false;
  error: number;
} | null

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>()


  return (
    <div className="p-2">
      <main style={response === undefined ? {minHeight: ""} : undefined} className="p-4 rounded-xl bg-white">
        
      </main>
    </div>
  )
}

export default Content;