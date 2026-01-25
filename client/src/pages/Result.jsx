import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Result = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;
    if (!input.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);

    const img = await generateImage(input);

    console.log("IMAGE LENGTH:", img?.length);

    if (img) {
      setImage(img); // ✅ JUST SET IT
    } else {
      toast.error("Image generation failed");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] justify-center items-center"
    >
      {/* IMAGE */}
      <div>
        <div className="relative">
          {image ? (
            <img
              src={image}
              alt="Generated"
              className="max-w-sm rounded"
            />
          ) : (
            <img
              src={assets.sample_img_2}
              alt="Placeholder"
              className="max-w-sm rounded opacity-70"
            />
          )}

          {loading && (
            <span className="absolute bottom-0 left-0 h-1 w-full bg-blue-500 animate-pulse" />
          )}
        </div>

        {loading && <p className="mt-2">Generating image...</p>}
      </div>

      {/* INPUT */}
      {!image && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Enter your prompt"
            className="flex-1 bg-transparent outline-none ml-8"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-800 px-7 py-2 rounded-full disabled:opacity-60"
          >
            Generate
          </button>
        </div>
      )}

      {/* ACTIONS */}
      {image && (
        <div className="flex gap-2 mt-10">
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setInput("");
            }}
            className="border px-8 py-3 rounded-full"
          >
            Generate Another
          </button>

          <a
            href={image}
            download="ai-image.png"
            className="bg-zinc-900 text-white px-10 py-3 rounded-full"
          >
            Download
          </a>
        </div>
      )}
    </form>
  );
};

export default Result;
