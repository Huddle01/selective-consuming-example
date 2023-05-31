import React from 'react';
import {
  BiCamera,
  BiCameraOff,
  BiMicrophone,
  BiMicrophoneOff,
} from 'react-icons/bi';

import { Button, Center, Icon } from '@chakra-ui/react';
import { Audio, Video } from '@huddle01/react/components';
import {
  useAudio,
  usePeers,
  useRoom,
  useVideo,
} from '@huddle01/react/hooks';

export default function Peers() {
  const { peers } = usePeers();

  const {
    createMicConsumer,
    closeMicConsumer,
  } = useAudio();
  const {
    createCamConsumer,
    closeCamConsumer,
  } = useVideo();

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl mx-auto">
      <Center className="grid grid-cols-4 gap-4 mt-5">
        {Object.values(peers)
          .filter(peer => peer.cam)
          .map(peer => (
            <div className="w-80">
              <Video key={peer.peerId} peerId={peer.peerId} track={peer.cam} />
            </div>
          ))}
        {Object.values(peers)
          .filter(peer => peer.mic)
          .map(peer => (
            <div>
              <Audio key={peer.peerId} peerId={peer.peerId} track={peer.mic} />
            </div>
          ))}
      </Center>

      <Center className="grid grid-cols-4 gap-4 mt-5 items-center justify-center">
        {Object.values(peers).map(peer => (
          <div className="w-80 flex items-center justify-center">
            {peer.cam?.enabled ? (
              <Button
                mr={2}
                className="flex items-center justify-center"
                onClick={() => {
                  closeCamConsumer(peer.peerId);
                }}
              >
                <Icon as={BiCameraOff} />
              </Button>
            ) : (
              <Button
                mr={2}
                className="flex items-center justify-center"
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
                className="flex items-center justify-center"
                onClick={() => {
                  closeMicConsumer(peer.peerId);
                }}
              >
                <Icon as={BiMicrophoneOff} />
              </Button>
            ) : (
              <Button
                mr={2}
                className="flex items-center justify-center"
                onClick={() => {
                  createMicConsumer(peer.peerId);
                }}
              >
                <Icon as={BiMicrophone} />
              </Button>
            )}
          </div>
        ))}
      </Center>
    </div>
  );
}
