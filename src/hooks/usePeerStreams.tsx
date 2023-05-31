import { useState, useEffect } from "react";
import Peer from '@huddle01/react'

interface Track extends MediaStreamTrack {
  id: string;
}

export enum IRoleEnum {
    host = 'host',
    coHost = 'coHost',
    moderator = 'moderator',
    speaker = 'speaker',
    listener = 'listener',
    peer = 'peer',
  }

interface IPeers {
    [peerId: string]: {
        peerId: string;
        role: IRoleEnum;
        mic: MediaStreamTrack;
        cam: MediaStreamTrack;
        displayName: string;
    };
}

type StreamDetails = Track[];

function usePeerStreams(peer: IPeers | null): StreamDetails {
  const [streams, setStreams] = useState<StreamDetails>([]);

  useEffect(() => {
    function updateStream(track: Track) {
      setStreams(existingStreams =>
        existingStreams.filter(existingStream => existingStream.id !== track.id).concat(track)
      );
    }

    if (peer) {
      if (peer.cam) {
        updateStream(peer.cam);
      }

      if (peer.mic) {
        updateStream(peer.mic);
      }

      peer.on("track", updateStream);

      return () => {
        peer.off("track", updateStream);
        setStreams([]);
      };
    }
  }, [peer]);

  return streams;
}

export default usePeerStreams;