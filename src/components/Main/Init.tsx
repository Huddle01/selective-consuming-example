import React, { useEffect, useState } from "react";
import Button from "../Button";
import Stream from "../Stream";
import { useDisplayName } from "@huddle01/react/app-utils";
import {
  useAudio,
  useHuddle01,
  useLobby,
  useMeetingMachine,
  useRoom,
  useVideo,
} from "@huddle01/react/hooks";

import Input from "../Input";

type THuddleState = {
  projectId: string;
  accessToken: string;
  roomId: string;
  userName: string;
};

interface Props {
  setActiveStage: React.Dispatch<React.SetStateAction<"init" | "room">>;
}

const Init: React.FC<Props> = ({ setActiveStage }) => {
  // Local States
  const [huddleStates, setHuddleStates] = useState<THuddleState>({
    projectId: "",
    accessToken: "",
    roomId: "",
    userName: "",
  });

  const { accessToken, userName, projectId, roomId } = huddleStates;

  const { initialize } = useHuddle01();

  // Huddle Hooks
  const { joinRoom } = useRoom();
  const { joinLobby, leaveLobby } = useLobby();
  const { fetchAudioStream, stopAudioStream } = useAudio();
  const { setDisplayName } = useDisplayName();

  useMeetingMachine();
  const {
    fetchVideoStream,
    stopVideoStream,
    stream: camStream,
    produceVideo,
  } = useVideo();

  // Func
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHuddleStates({ ...huddleStates, [name]: value });
  };

  

  useEffect(() => {
    if (projectId) {
      initialize(projectId);
    }
  }, [projectId]);

  return (
    <div className="p-4 h-screen relative">
      <h1 className="text-6xl font-bold text-center absolute left-1/2 -translate-x-1/2">
        Lumos Example App
      </h1>
      <div className="grid grid-cols-2 h-full items-center justify-center ">
        <div className="w-full flex items-center justify-center">
          {!camStream ? (
            <div className="border border-black rounded-lg w-3/4 h-96 mb-2 flex items-center justify-center bg-black text-white">
              Test
            </div>
          ) : (
            <Stream />
          )}
        </div>
        <div className="h-96">
          <h2 className="text-3xl text-yellow-500 font-extrabold mb-6">
            Lobby
          </h2>
          <div className="flex flex-col items-start justify-start  gap-2">
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="flex items-center w-full">
                <Input
                  name="projectId"
                  placeholder="Your Project Id"
                  value={projectId}
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex items-center w-full flex-1">
                <Input
                  name="accessToken"
                  placeholder="Your Access Token (optional)"
                  value={accessToken}
                  onChange={handleOnChange}
                />
              </div>
            </div>

            <div className="flex items-center w-full">
              <Input
                name="roomId"
                value={roomId}
                onChange={handleOnChange}
                placeholder="Your Room Id"
              />
              <Button
                disabled={!joinLobby.isCallable}
                onClick={() => {
                  accessToken
                    ? joinLobby(roomId, accessToken)
                    : joinLobby(roomId);
                }}
              >
                JOIN_LOBBY
              </Button>
            </div>

            <div className="flex items-center w-full">
              <Input
                name="userName"
                value={userName}
                onChange={handleOnChange}
                placeholder="Your Display Name"
              />
              <Button
                disabled={!setDisplayName.isCallable}
                onClick={() => setDisplayName(userName)}
              >
                SET_DISPLAY_NAME
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                disabled={!fetchVideoStream.isCallable}
                onClick={() => {
                  fetchVideoStream();
                  produceVideo(camStream);
                }}
              >
                FETCH_VIDEO_STREAM
              </Button>
              <Button
                disabled={!stopVideoStream.isCallable}
                onClick={stopVideoStream}
              >
                STOP_VIDEO_STREAM
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                disabled={!joinRoom.isCallable}
                onClick={() => {
                  joinRoom();
                  setActiveStage("room");
                }}
              >
                JOIN_ROOM
              </Button>
              <Button disabled={!leaveLobby.isCallable} onClick={leaveLobby}>
                LEAVE_LOBBY
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                disabled={!fetchAudioStream.isCallable}
                onClick={fetchAudioStream}
              >
                FETCH_AUDIO_STREAM
              </Button>
              <Button
                disabled={!stopAudioStream.isCallable}
                onClick={stopAudioStream}
              >
                STOP_AUDIO_STREAM
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Init;
