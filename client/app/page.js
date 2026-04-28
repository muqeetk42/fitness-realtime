"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(res => {
        setMessage(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Frontend ↔ Backend Test</h1>
      <p className="mt-4">{message}</p>
    </div>
  );
}
