import Button from "@/components/Button";
import { useAudio, usePeers, useVideo } from "@huddle01/react/hooks";
import { Audio, Video } from "@huddle01/react/components";
import React, { useEffect, useRef } from "react";

const RoomPage = () => {
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const { stream, produceVideo, stopProducingVideo, isLoading } = useVideo();
  const { stream: audioStream, produceAudio, stopProducingAudio } = useAudio();

  const { peers, peerIds } = usePeers();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-full h-screen items-center justify-start border flex p-4 gap-4 flex-col">
      <div className="flex flex-col items-center gap-2">
        <div className="mb-1">Me Video:</div>
        {!isLoading ? (
          <video ref={videoRef} autoPlay muted className="w-60" />
        ) : (
          <div className="w-56 h-32 border border-black rounded-lg bg-black text-white flex items-center justify-center">
            Stream
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          <Button
            disabled={!produceVideo.isCallable}
            onClick={() => produceVideo(stream)}
          >
            PRODUCE_VIDEO_STREAM
          </Button>

          <Button
            disabled={!stopProducingVideo.isCallable}
            onClick={() => stopProducingVideo()}
          >
            STOP_VIDEO_STREAM
          </Button>

          <Button
            disabled={!produceAudio.isCallable}
            onClick={() => produceAudio(audioStream)}
          >
            PRODUCE_AUDIO_STREAM
          </Button>

          <Button
            disabled={!stopProducingAudio.isCallable}
            onClick={() => stopProducingAudio()}
          >
            STOP_AUDIO_STREAM
          </Button>
        </div>
      </div>

      <div>
        <div>Peers</div>
        <div className="grid grid-cols-6 gap-2">
          {peerIds.map((peerId) => {
            const peer = peers[peerId];
            return (
              <Video key={peer.peerId} track={peer.cam} peerId={peer.peerId} />
            );
          })}

          {Object.values(peers)
            .filter(({ mic }) => mic)
            .map(({ peerId, mic }) => (
              <Audio key={peerId} track={mic} peerId={peerId} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
