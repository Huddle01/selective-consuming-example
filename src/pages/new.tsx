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
      <Center className='mt-4'>
        <video ref={videoRef} autoPlay muted width={'30%'}></video>
        <audio ref={audioRef} autoPlay></audio>
        {isRoomJoined ? (<div className="ml-12">
          <div>Enable Produce</div>
          <div className="border border-white p-2 rounded-md h-fit">
            {peerIds.map(peerId => {
              const peer = peers[peerId];

              return (
                <div key={peer.peerId} className="flex items-center gap-4">
                  <span>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedMicPeers.has(peer.peerId)}
                        onClick={() => {
                          if (selectedMicPeers.has(peer.peerId)) {
                            selectedMicPeers.delete(peer.peerId);
                          } else {
                            selectedMicPeers.add(peer.peerId);
                          }
                          updateSelectedMicPeers(new Set(selectedMicPeers));
                        }}
                      />
                      Video
                    </label>
                  </span>
                  <span>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedCamPeers.has(peer.peerId)}
                        onClick={() => {
                          if (selectedCamPeers.has(peer.peerId)) {
                            selectedCamPeers.delete(peer.peerId);
                          } else {
                            selectedCamPeers.add(peer.peerId);
                          }
                          updateSelectedCamPeers(new Set(selectedCamPeers));
                        }}
                      />
                      Audio
                    </label>
                  </span>
                  <span>{peer.peerId}</span>
                </div>
              );
            })}
          </div>
        </div>) : (<></>)}
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
              : produceVideo(
                  camStream,
                  Array.from(selectedCamPeers) as string[]
                );
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
            <Icon as={BiMicrophoneOff} />
          ) : (
            <Icon as={BiMicrophone} />
          )}
        </Button>
      </Center>
      <div>
        <Peers />
      </div>
    </>
  );
};

export default index;
