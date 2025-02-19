"use client";
import { backendUrl } from "@/app/utils/auth";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const VideoCallPage: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [socket, setSocket] = useState<WebSocket>();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
  const { room } = useParams();

  const handleSignalingMessage = useCallback(
    async (message: any, ws: WebSocket) => {
      if (!peerConnection) return;

      if (message.type === "offer") {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(message)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        ws?.send(JSON.stringify(answer));
      } else if (message.type === "answer") {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(message)
        );
      } else if (message.type === "candidate") {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(message.candidate)
        );
      }
      console.log("Signaling message received:", message);
    },
    [peerConnection]
  );

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket(
      `ws${backendUrl.slice(
        backendUrl.indexOf("http") + 4
      )}/ws/video-call/${room}/`
    );
    setSocket(ws);

    ws.onopen = () => console.log("Connected to signaling server");
    ws.onmessage = (message) =>
      handleSignalingMessage(JSON.parse(message.data), ws);
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("Disconnected from signaling server");

    return () => ws.close();
  }, [handleSignalingMessage, room]);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        // Check available devices and set constraints
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(
          (device) => device.kind === "videoinput"
        );
        const hasAudioInput = devices.some(
          (device) => device.kind === "audioinput"
        );

        const constraints = {
          video: hasVideoInput,
          audio: hasAudioInput,
        };

        console.log(constraints);

        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        return stream; // Return the stream for use if needed
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    let activeStream: MediaStream | undefined;

    // Initialize media and store the stream in `activeStream`
    initializeMedia().then((stream) => {
      if (stream) console.log("Audio tracks:", stream.getAudioTracks());
      else console.log("stream is undefined");
      activeStream = stream; // Store the resolved stream for cleanup
    });

    return () => {
      // Stop all tracks when component unmounts
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCall = async () => {
    if (!localStream || !socket) return;

    // Create a peer connection
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);
    // Add local tracks to the peer connection
  localStream.getTracks().forEach((track) => {
    console.log(`Adding track: ${track.kind}`);
    pc.addTrack(track, localStream);
  });

    // Handle remote stream
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      console.log("Remote tracks:", remoteStream.getTracks());
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
        remoteVideoRef.current.volume = 1;
      }
    };

    // Send ICE candidates to the server
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };

    // Create and send SDP offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(JSON.stringify(offer));
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Video Call Room</h1>
      <div className="flex space-x-4">
        {/* Local Video */}
        <div>
          <h2 className="text-lg font-medium">Your Video</h2>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-64 h-48 border rounded"
          />
        </div>
        {/* Remote Video */}
        <div>
          <h2 className="text-lg font-medium">Remote Video</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-64 h-48 border rounded"
          />
        </div>
      </div>
      <button
        onClick={startCall}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Start Call
      </button>
    </div>
  );
};

export default VideoCallPage;
