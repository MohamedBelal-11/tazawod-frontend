"use client";
import LoadingDiv from "@/app/components/loadingDiv";
import { fetchResponse } from "@/app/utils/response";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
  useCallStateHooks,
  ParticipantView,
  Call,
} from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const apiKey = "kvmdz4hfewpf";

type Responsete =
  | {
      succes: true;
      participants: [string];
    }
  | {
      succes: false;
      error: number;
    }
  | null;

type Responset =
  | {
      succes: true;
      name: string;
      id: string;
      call_id: string;
      token: string;
      is_admin: boolean;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

let streamVideoClient: StreamVideoClient;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();
  const { id }: { id: string } = useParams();
  const [call, setCall] = useState<Call>();

  useEffect(() => {
    fetchResponse({ setResponse, url: "/api/meetings/meeting/" + id });
  }, [id]);

  useEffect(() => {
    if (response && response.succes) {
      // Initialize StreamVideoClient only once
      if (!streamVideoClient) {
        streamVideoClient = new StreamVideoClient({
          apiKey,
          token: response.token,
          user: { name: response.name, id: response.id },
        });

        // Set the call instance
        const newCall = streamVideoClient.call("default", response.call_id);
        setCall(newCall);

        // Join the call once
        newCall.join({ create: false });
      }
    }
  }, [response]);

  if (response === null || (response && !response.succes)) {
    return "Error";
  }

  if (response === undefined || !streamVideoClient || !call) {
    return <LoadingDiv loading />;
  }

  return (
    <StreamVideo client={streamVideoClient}>
      <StreamCall call={call}>
        {response.is_admin ? <AdminC /> : <MyVideoUI id={id} />}
      </StreamCall>
    </StreamVideo>
  );
};

const AdminC: React.FC = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <>
      {participants.map((p) => (
        <ParticipantView participant={p} key={p.sessionId} />
      ))}
    </>
  );
};

const MyVideoUI: React.FC<{ id: string }> = ({ id }) => {
  const [response, setResponse] = useState<Responsete>();
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  useEffect(() => {
    fetchResponse({ setResponse, url: "/api/participants/" + id });
  }, [id]);

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null || response.succes === false) {
    return "Error";
  }

  return (
    <>
      {participants
        .filter((pe) => response.participants.includes(pe.userId))
        .map((p) => (
          <ParticipantView participant={p} key={p.sessionId} />
        ))}
    </>
  );
};
export default Content;
