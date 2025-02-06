import React, { useRef, useState } from "react";

const App = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [stream, setStream] = useState(null);

  // const startRecording = async () => {
  //   try {
  //     const userStream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     setStream(userStream);
  //     videoRef.current.srcObject = userStream;

  //     const mediaRecorder = new MediaRecorder(userStream);
  //     mediaRecorderRef.current = mediaRecorder;
  //     const chunks = [];

  //     mediaRecorder.ondataavailable = (event) => {
  //       if (event.data.size > 0) {
  //         chunks.push(event.data);
  //       }
  //     };

  //     mediaRecorder.onstop = () => {
  //       const recordedBlob = new Blob(chunks, { type: "video/webm" });
  //       setRecordedVideo(URL.createObjectURL(recordedBlob));
  //     };

  //     mediaRecorder.start();
  //     setRecording(true);
  //   } catch (error) {
  //     console.error("Error accessing media devices:", error);
  //   }
  // };

  const startRecording = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Forces back camera
        audio: true,
      });
      setStream(userStream);
      videoRef.current.srcObject = userStream;

      const mediaRecorder = new MediaRecorder(userStream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: "video/webm" });
        setRecordedVideo(URL.createObjectURL(recordedBlob));
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Error accessing camera. Ensure camera permissions are allowed.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Video Recorder</h1>
      <video
        ref={videoRef}
        autoPlay
        className="w-80 h-60 bg-black rounded-lg"
      />
      <div className="mt-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Stop Recording
          </button>
        )}
      </div>
      {recordedVideo && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Recorded Video</h2>
          <video
            src={recordedVideo}
            controls
            className="w-80 h-60 mt-2 rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default App;
