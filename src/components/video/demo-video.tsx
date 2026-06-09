import React, { useRef, useState, useEffect } from "react";
import { IconButton } from "../icons/icon-button";

interface DemoVideoProps {
  videoUrl: string;
  width?: string;
  height?: string;
  isOpen: boolean;
  toggle?: () => void;
}

const DemoVideo: React.FC<DemoVideoProps> = ({
  videoUrl,
  width = "640px",
  height = "360px",
  isOpen,
  toggle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);

  const handleVideoControls = () => {
    if (isVideoPlaying) {
      videoRef.current?.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current?.play();
      setIsVideoPlaying(true);
    }
  };

  useEffect(() => {
    if (isOpen && videoRef.current) {
      const video = videoRef.current;

      const updateDuration = () => {
        setVideoDuration(video.duration);
      };

      if (video.readyState >= 1) {
        setVideoDuration(video.duration);
      } else {
        video.addEventListener("loadedmetadata", updateDuration);
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoPlaying(true))
          .catch((error) => {
            console.warn("Autoplay failed:", error);
          });
      }

      return () => {
        video.removeEventListener("loadedmetadata", updateDuration);
      };
    } else if (videoRef.current) {
      const video = videoRef.current;
      video.pause();
      video.currentTime = 0;
      setVideoCurrentTime(0);
      setIsVideoPlaying(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) =>
    new Date(seconds * 1000).toISOString().substring(14, 19);

  const handleProgressClick = (event: React.MouseEvent) => {
    const progressBar = event.currentTarget as HTMLElement; // Cast to HTMLElement
    const clickPosition = event.nativeEvent.offsetX; // Get click position relative to the bar
    const progressBarWidth = progressBar.offsetWidth; // Now TypeScript knows it has offsetWidth
    const newTime = (clickPosition / progressBarWidth) * videoDuration; // Calculate new time based on click position
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setVideoCurrentTime(newTime); // Update current time state
    }
  };

  const [progressHover, setProgressHover] = useState<number>(0);

  const handleProgressHover = (event: React.MouseEvent) => {
    setProgressHover(event.nativeEvent.offsetX);
  };

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#18162199] backdrop-blur-lg transition-all duration-500 overflow-hidden ${
        isOpen ? "opacity-100 z-50" : "opacity-0 -z-50"
      }`}
    >
      <IconButton
        icon="close"
        className="absolute top-0 right-0 p-5"
        onClick={toggle}
      />
      <div
        className={`relative h-min transition-all duration-500 ${
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <video
          ref={videoRef}
          width={width}
          height={height}
          src={videoUrl}
          playsInline
          onTimeUpdate={(e) => setVideoCurrentTime(e.currentTarget.currentTime)}
        >
          Your browser does not support the video tag.
        </video>

        <div className="absolute bg-[#18162199] w-full h-full flex justify-center items-center z-50 top-0 left-0 hover:opacity-100 opacity-0 transition-all duration-300">
          <IconButton
            filled={videoCurrentTime === videoDuration ? false : true}
            icon={
              videoCurrentTime === videoDuration
                ? "replay"
                : isVideoPlaying
                  ? "pause"
                  : "play"
            }
            onClick={handleVideoControls}
          />
          <div className="flex absolute bottom-0 w-full justify-evenly items-center gap-2">
            {/* Expand */}
            <IconButton
              icon="expand"
              className="text-white w-7"
              stroke={1}
              onClick={() => videoRef.current?.requestFullscreen()}
            />
            {/* Progress Bar */}
            <div
              className="md:w-9/12 w-8/12 h-1 hover:h-2 transition-all bg-gray-400 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
              onMouseMove={handleProgressHover}
              onMouseLeave={() => setProgressHover(0)}
            >
              <div
                className="bg-white h-full rounded-full absolute"
                style={{
                  width: progressHover,
                }}
              ></div>
              <div
                className="bg-[#C1272D] h-full rounded-full absolute"
                style={{
                  width:
                    videoDuration > 0
                      ? `${(videoCurrentTime / videoDuration) * 100}%`
                      : "0%",
                }}
              ></div>
            </div>

            {/* Time Display */}
            <div className="text-white md:text-sm text-xs flex">
              {videoCurrentTime > 0 ? formatTime(videoCurrentTime) : "--:--"} /{" "}
              {videoDuration > 0 ? formatTime(videoDuration) : "--:--"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoVideo;
