"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [calories, setCalories] = useState<number | string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

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

      getTheResponse(image);
    }
  };

  const uploadPicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const image = event.target?.result;

        if (typeof image === "string") {
          getTheResponse(image);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const getTheResponse = async (image: string) => {
    setLoading(true);

    setImage(image);

    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({ image }),
    });

    const data = await response.text();

    console.log(data);

    const result = getNeededText(data);

    setCalories(result);
    setLoading(false);
  };

  const getNeededText = (data: string): string => {
    const result = data.match(
      /Total calories range is: (\d+)-(\d+) \(avg: (\d+)\)/,
    );

    if (result) {
      return `Total calories range is: ${result[1]}-${result[2]} (avg: ${result[3]})`;
    }

    return data;
  };

  const clearImage = () => {
    setImage(null);
    setCalories("");
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
      <div className="relative">
        <video
          ref={videoRef}
          id="webcam"
          autoPlay
          playsInline
          width="640"
          height="480"
          className="max-w-full max-h-[45svh] rounded-2xl object-cover -scale-x-100 bg-white/5"
        />
        {!!image && (
          <Image
            src={image}
            alt="food"
            layout="fill"
            className="-scale-x-100 rounded-2xl object-cover object-center"
          />
        )}
      </div>
      <div className="flex flex-col justify-around items-center max-w-full w-[640px] h-[480px] max-h-[45svh]">
        <h1 className="text-xl font-bold flex-grow-0 overflow-auto max-w-full whitespace-pre-wrap">
          {loading ? "loading..." : calories}
        </h1>

        <div className="flex items-center gap-8 font-bold">
          <div className="flex-none">
            {image ? (
              <button
                onClick={clearImage}
                className="flex-none inline-flex bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full"
              >
                Clear picture
              </button>
            ) : (
              <label className="relative flex-none inline-flex bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
                Upload picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadPicture}
                  className="absolute pointer-events-none invisible w-0 h-0"
                />
              </label>
            )}
          </div>

          <button
            id="snap"
            className="flex-none inline-flex bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
            onClick={takePicture}
          >
            Take a picture
          </button>
        </div>
      </div>
    </div>
  );
}
