import React, { useEffect, useRef, useState } from 'react';
import {
  BiCamera,
  BiCameraOff,
  BiMicrophone,
  BiMicrophoneOff,
  BiPhoneOff,
} from 'react-icons/bi';

import { Box, Button, Center, Icon, Image, SimpleGrid } from '@chakra-ui/react';
import { useEventListener, useHuddle01 } from '@huddle01/react';
import { Audio, Video } from '@huddle01/react/components';
import {
  useAudio,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom,
  useVideo,
} from '@huddle01/react/hooks';
import { useRouter } from 'next/router';

import Input from '@/components/Input';

type THuddleState = {
  projectId: string;
  accessToken: string;
  roomId: string;
  userName: string;
};

const index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [senderAddress, setSenderAddress] = useState<string>('');
  const [hostAddress, setHostAddress] = useState<string>('');
  const [rate, setRate] = useState<string>('');

  const { state, send } = useMeetingMachine();

  const { initialize, isInitialized } = useHuddle01();
  const { joinLobby, isLobbyJoined, leaveLobby } = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    isProducing: isAudioProducing,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream,
    createMicConsumer,
    closeMicConsumer,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    isProducing: isVideoProducing,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream,
    createCamConsumer,
    closeCamConsumer,
  } = useVideo();
  const { joinRoom, leaveRoom, isRoomJoined } = useRoom();

  const { peers } = usePeers();

  const [huddleStates, setHuddleStates] = useState<THuddleState>({
    projectId: '',
    accessToken: '',
    roomId: '',
    userName: 'guestUser',
  });

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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHuddleStates({ ...huddleStates, [name]: value });
  };

  return (
    <>
      {!isLobbyJoined && !isRoomJoined ? (
        <Box>
          <Center mt={5}>
            <div className="flex gap-2">
              <div className="flex items-center">
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
            </div>
          </Center>
        </Box>
      ) : (
        <></>
      )}
      <Center>
        <video ref={videoRef} autoPlay muted width={'30%'}></video>
        <audio ref={audioRef} autoPlay></audio>
      </Center>
      <Center>
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
          onClick={() => {
            state.matches('Initialized.JoinedLobby.Cam.On')
              ? stopVideoStream()
              : fetchVideoStream();
          }}
          hidden={!isLobbyJoined}
        >
          {state.matches('Initialized.JoinedLobby.Cam.On') ? (
            <Icon as={BiCameraOff} />
          ) : (
            <Icon as={BiCamera} />
          )}
        </Button>

        <Button
          margin={2}
          onClick={() => {
            state.matches('Initialized.JoinedLobby.Mic.Unmuted')
              ? stopAudioStream()
              : fetchAudioStream();
          }}
          hidden={!isLobbyJoined}
        >
          {state.matches('Initialized.JoinedLobby.Mic.Unmuted') ? (
            <Icon as={BiMicrophoneOff} />
          ) : (
            <Icon as={BiMicrophone} />
          )}
        </Button>

        <Button
          margin={2}
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
          onClick={() => {
            state.matches('Initialized.JoinedRoom.Cam.ProducingCam')
              ? stopProducingVideo()
              : produceVideo(camStream);
          }}
          hidden={!isRoomJoined}
        >
          {isVideoProducing ? (
            <Icon as={BiCameraOff} />
          ) : (
            <Icon as={BiCamera} />
          )}
        </Button>

        <Button
          margin={2}
          onClick={() => {
            isAudioProducing ? stopProducingAudio() : produceAudio(micStream);
          }}
          hidden={!isRoomJoined}
        >
          {isAudioProducing ? (
            <Icon as={BiMicrophoneOff} />
          ) : (
            <Icon as={BiMicrophone} />
          )}
        </Button>
      </Center>
      <div>
        <div>
          <div className="flex">
            <div className="w-1/4">
              {Object.values(peers)
                .filter(peer => peer.cam)
                .map(peer => (
                  <div>
                    <Video
                      key={peer.peerId}
                      peerId={peer.peerId}
                      track={peer.cam}
                    />
                  </div>
                ))}
              {Object.values(peers)
                .filter(peer => peer.mic)
                .map(peer => (
                  <div>
                    <Audio
                      key={peer.peerId}
                      peerId={peer.peerId}
                      track={peer.mic}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex">
          {Object.values(peers).map(peer => (
            <div className="grid grid-cols-4 gap-2 mt-5 ml-5">
              {peer.cam?.enabled ? (
                <Button
                  mr={2}
                  onClick={() => {
                    closeCamConsumer(peer.peerId);
                  }}
                >
                  <Icon as={BiCameraOff} />
                </Button>
              ) : (
                <Button
                  mr={2}
                  onClick={() => {
                    createCamConsumer(peer.peerId);
                  }}
                >
                  <Icon as={BiCamera} />
                </Button>
              )}
              {peer.mic?.enabled ? (
                <Button
                  mr={2}
                  onClick={() => {
                    closeMicConsumer(peer.peerId);
                  }}
                >
                  <Icon as={BiMicrophoneOff} />
                </Button>
              ) : (
                <Button
                  mr={2}
                  onClick={() => {
                    createMicConsumer(peer.peerId);
                  }}
                >
                  <Icon as={BiMicrophone} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default index;
