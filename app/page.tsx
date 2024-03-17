"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [calories, setCalories] = useState<number | string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const takePicture = async () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        ?.getContext("2d")
        ?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const image = canvas.toDataURL("image/jpeg");

      setLoading(true);

      console.log({ image });

      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({ image }),
      });

      const data = await response.text();

      console.log(data);

      setCalories(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    const constraints = {
      video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="relative max-w-full max-h-screen flex flex-col items-center justify-center p-6">
      <video
        ref={videoRef}
        id="webcam"
        autoPlay
        playsInline
        width="640"
        height="480"
        className="max-w-full max-h-[45svh] rounded-2xl object-cover -scale-x-100 bg-white/5"
      />
      <div className="flex flex-col justify-around items-center max-w-full w-[640px] h-[480px] max-h-[45svh]">
        <h1 className="text-4xl font-bold flex-auto overflow-auto">
          {loading ? "loading..." : calories}
        </h1>
        <button
          id="snap"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={takePicture}
        >
          Take a picture
        </button>
      </div>
    </div>
  );
}
