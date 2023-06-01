import React, { useEffect, useRef, useState } from 'react';
import {
  BiCamera,
  BiCameraOff,
  BiMicrophone,
  BiMicrophoneOff,
  BiPhoneOff,
} from 'react-icons/bi';

import { Button, Center, Icon } from '@chakra-ui/react';
import { useEventListener, useHuddle01 } from '@huddle01/react';
import { useDisplayName } from '@huddle01/react/app-utils';
import {
  useAudio,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom,
  useVideo,
} from '@huddle01/react/hooks';

import Input from '@/components/Input';
import Peers from '@/components/Peers';

type THuddleState = {
  projectId: string;
  accessToken: string;
  roomId: string;
  userName: string;
};

const index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { state } = useMeetingMachine();

  const { initialize } = useHuddle01();
  const { joinLobby, isLobbyJoined, leaveLobby } = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    isProducing: isAudioProducing,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    isProducing: isVideoProducing,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const { joinRoom, leaveRoom, isRoomJoined } = useRoom();

  const { peers, peerIds } = usePeers();

  const [huddleStates, setHuddleStates] = useState<THuddleState>({
    projectId: '',
    accessToken: '',
    roomId: '',
    userName: '',
  });

  const { setDisplayName, error: displayNameError } = useDisplayName();

  const { accessToken, userName, projectId, roomId } = huddleStates;

  const [selectedMicPeers, updateSelectedMicPeers] = useState<Set<String>>(
    new Set()
  );

  const [selectedCamPeers, updateSelectedCamPeers] = useState<Set<String>>(
    new Set()
  );

  useEventListener('lobby:cam-on', () => {
    if (state.context.camStream && videoRef.current)
      videoRef.current.srcObject = state.context.camStream as MediaStream;
  });

  useEventListener('lobby:mic-on', () => {
    if (state.context.micStream && audioRef.current)
      audioRef.current.srcObject = state.context.micStream as MediaStream;
  });

  useEffect(() => {
    if (state.matches('Idle') && projectId) {
      initialize(projectId);
    }
  }, [projectId]);

  /*  This will automatically fetch audio and video stream when user joins the lobby because 
      it's compulsory for user to fetch audio and video for producing audio and video in room */
  useEffect(() => {
    if (isLobbyJoined) {
      fetchVideoStream();
      fetchAudioStream();
    }
  }, [isLobbyJoined]);

  useEffect(() => {
    if (isRoomJoined) {
      setDisplayName(userName);
    }
  }, [isRoomJoined]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHuddleStates({ ...huddleStates, [name]: value });
  };

  return (
    <>
      {!isLobbyJoined && !isRoomJoined ? (
        <Center mt={5}>
          <div className="grid grid-cols-3 w-1/2 gap-2">
            <Input
              name="projectId"
              placeholder="Your Project Id"
              value={projectId}
              onChange={handleOnChange}
            />
            <Input
              name="roomId"
              value={roomId}
              onChange={handleOnChange}
              placeholder="Your Room Id"
            />
            <Input
              name="accessToken"
              placeholder="Your Access Token (optional)"
              value={accessToken}
              onChange={handleOnChange}
            />
          </div>
        </Center>
      ) : (
        <></>
      )}
      <Center className="mt-4">
        <video ref={videoRef} autoPlay muted width={'30%'}></video>
        <audio ref={audioRef} autoPlay></audio>
        {/* <ProduceCheckbox isRoomJoined={isRoomJoined} peerIds={peerIds} peers={peers} /> */}
        {isRoomJoined ? (
          <div className="ml-12">
            <div>Produce stream for peers</div>
            <div className="border border-white p-2 rounded-md h-fit">
              {peerIds.map(peerId => {
                const peer = peers[peerId];
                return (
                  <div key={peer.peerId} className="flex items-center gap-4">
                    <span>
                      <label
                        style={{ background: isAudioProducing ? 'gray' : '' }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMicPeers.has(peer.peerId)}
                          onClick={() => {
                            /* User first have to click on checkbox and then click on Produce Audio to make selective producing working */
                            if (isAudioProducing) {
                              alert('Please stop producing audio first to make selective producing working');
                            } else {
                              if (selectedMicPeers.has(peer.peerId)) {
                                selectedMicPeers.delete(peer.peerId);
                              } else {
                                selectedMicPeers.add(peer.peerId);
                              }
                              updateSelectedMicPeers(new Set(selectedMicPeers));
                            }
                          }}
                        />
                        Audio
                      </label>
                    </span>
                    <span>
                      <label
                        style={{ background: isVideoProducing ? 'gray' : '' }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCamPeers.has(peer.peerId)}
                          onClick={() => {
                            /* User first have to click on checkbox and then click on Produce Video to make selective producing working */
                            if (isVideoProducing) {
                              alert('Please stop producing video first to make selective producing working');
                            } else {
                              if (selectedCamPeers.has(peer.peerId)) {
                                selectedCamPeers.delete(peer.peerId);
                              } else {
                                selectedCamPeers.add(peer.peerId);
                              }
                              updateSelectedCamPeers(new Set(selectedCamPeers));
                            }
                          }}
                        />
                        Video
                      </label>
                    </span>
                    <span>{peer.peerId}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
      </Center>
      <Center mt={2}>
        <Button
          margin={2}
          onClick={async () => {
            if (isLobbyJoined) {
              joinRoom();
            } else {
              if (accessToken) joinLobby(roomId, accessToken);
              else joinLobby(roomId);
            }
          }}
          hidden={isRoomJoined}
        >
          {isLobbyJoined ? 'Join Room' : 'Join Lobby'}
        </Button>

        <Button
          margin={2}
          border={1}
          background={
            state.matches('Initialized.JoinedLobby.Cam.On')
              ? 'gray.700'
              : 'red.600'
          }
          onClick={() => {
            state.matches('Initialized.JoinedLobby.Cam.On')
              ? stopVideoStream()
              : fetchVideoStream();
          }}
          hidden={!isLobbyJoined}
        >
          {state.matches('Initialized.JoinedLobby.Cam.On') ? (
            <Icon as={BiCamera} />
          ) : (
            <Icon as={BiCameraOff} />
          )}
        </Button>

        <Button
          margin={2}
          background={
            state.matches('Initialized.JoinedLobby.Mic.Unmuted')
              ? 'gray.700'
              : 'red.600'
          }
          onClick={() => {
            state.matches('Initialized.JoinedLobby.Mic.Unmuted')
              ? stopAudioStream()
              : fetchAudioStream();
          }}
          hidden={!isLobbyJoined}
        >
          {state.matches('Initialized.JoinedLobby.Mic.Unmuted') ? (
            <Icon as={BiMicrophone} />
          ) : (
            <Icon as={BiMicrophoneOff} />
          )}
        </Button>

        <Button
          margin={2}
          background={'red.600'}
          onClick={async () => {
            if (isRoomJoined) {
              leaveRoom();
            } else {
              leaveLobby();
            }
          }}
          hidden={!isLobbyJoined && !isRoomJoined}
        >
          <Icon as={BiPhoneOff} />
        </Button>

        <Button
          margin={2}
          background={isVideoProducing ? 'gray.700' : 'red.600'}
          onClick={() => {
            isVideoProducing
              ? stopProducingVideo()
              : produceVideo(
                  camStream,
                  Array.from(selectedCamPeers) as string[]
                );
          }}
          hidden={!isRoomJoined}
        >
          {isVideoProducing ? (
            <Icon as={BiCamera} />
          ) : (
            <Icon as={BiCameraOff} />
          )}
        </Button>

        <Button
          margin={2}
          background={isAudioProducing ? 'gray.700' : 'red.600'}
          onClick={() => {
            isAudioProducing
              ? stopProducingAudio()
              : produceAudio(
                  micStream,
                  Array.from(selectedMicPeers) as string[]
                );
          }}
          hidden={!isRoomJoined}
        >
          {isAudioProducing ? (
            <Icon as={BiMicrophone} />
          ) : (
            <Icon as={BiMicrophoneOff} />
          )}
        </Button>
        <br />
        {isLobbyJoined && !isRoomJoined ? (
          <Input
            name="userName"
            placeholder="Your Display Name"
            value={userName}
            onChange={handleOnChange}
          />
        ) : (
          <></>
        )}
      </Center>
      <div>
        <Peers />
      </div>
    </>
  );
};

export default index;
