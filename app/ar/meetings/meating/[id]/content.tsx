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

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();
  const { id }: { id: string } = useParams();

  useEffect(() => {
    fetchResponse({ setResponse, url: "/api/meetings/meeting/" + id });
  }, [id]);

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null || response.succes === false) {
    return "Error";
  }

  const user: User = {
    name: response.name,
    id: response.id,
  };
  const client = new StreamVideoClient({ apiKey, token: response.token, user });

  const call = client.call("default", response.call_id);

  call.join({ create: false });

  return (
    <StreamVideo client={client}>
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
