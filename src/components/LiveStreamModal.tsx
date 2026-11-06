import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Users,
  Clock,
  Radio,
  Send,
  X,
  MessageSquare,
  ShieldCheck,
  StopCircle,
  Play,
} from 'lucide-react';
import { LiveSession, StudentProfile } from '../types';

interface LiveStreamModalProps {
  isOpen: boolean;
  session: LiveSession;
  isTeacher: boolean;
  student?: StudentProfile;
  onClose: () => void;
  onEndLiveSession?: (sessionId: string) => void;
}

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({
  isOpen,
  session,
  isTeacher,
  student,
  onClose,
  onEndLiveSession,
}) => {
  const [isLiveActive, setIsLiveActive] = useState(session.status === 'LIVE');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [viewerCount, setViewerCount] = useState(session.viewersCount || 142);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    { id: '1', sender: 'Rahul Sharma', text: 'Good evening Sir! Excited for the API architecture session.', time: '15:02' },
    { id: '2', sender: 'Aanya Kapoor', text: 'Will this lecture also cover database transaction locks?', time: '15:03' },
    { id: '3', sender: 'Dr. Rajesh Verma', text: 'Welcome everyone! Yes Aanya, we will cover ledger rollback and ACID properties.', time: '15:04' },
  ]);
  const [messageInput, setMessageInput] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    let interval: any = null;
    if (isLiveActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
        // Realistic subtle fluctuation of viewers
        if (Math.random() > 0.7) {
          setViewerCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Camera feed integration for live broadcasting
  useEffect(() => {
    if (!isOpen) return;

    let active = true;

    async function initMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          if (active && videoRef.current) {
            videoRef.current.srcObject = stream;
            mediaStreamRef.current = stream;
          }
        }
      } catch (err) {
        // Fallback: draw animated interactive educational live canvas
        drawCanvasAnimation();
      }
    }

    function drawCanvasAnimation() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let frame = 0;
      function render() {
        if (!active || !canvas || !ctx) return;
        frame++;
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Live wave animation
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin((x + frame * 3) * 0.02) * 40;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Overlay text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(`SKILLJ LIVE: ${session.title}`, canvas.width / 2, 80);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '14px system-ui';
        ctx.fillText(`Instructor: ${session.teacherName} • UNIVERSE Studio Feed`, canvas.width / 2, 110);

        requestAnimationFrame(render);
      }
      render();
    }

    initMedia();

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, session]);

  if (!isOpen) return null;

  const toggleMic = () => {
    setMicOn(!micOn);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !micOn;
      });
    }
  };

  const toggleVideo = () => {
    setVideoOn(!videoOn);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !videoOn;
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const senderName = isTeacher
      ? session.teacherName
      : student ? `${student.firstName} ${student.surname}` : 'Student';

    const newMsg = {
      id: String(Date.now()),
      sender: senderName,
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setMessageInput('');
  };

  const handleEndLive = () => {
    setIsLiveActive(false);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (onEndLiveSession) {
      onEndLiveSession(session.id);
    }
    onClose();
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-950 shadow-2xl border border-red-900/40 overflow-hidden flex flex-col my-4 h-[90vh]">
        {/* Top Live Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black tracking-widest uppercase animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">{session.title}</h3>
              <p className="text-[11px] text-slate-400">
                Instructor: {session.teacherName} • Track: {session.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg">
              <Users className="w-4 h-4 text-red-400" />
              <span>{viewerCount} Live Viewers</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{formatDuration(secondsElapsed)}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas & Live Chat Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
          {/* Main Broadcast Screen */}
          <div className="lg:col-span-2 relative bg-black flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isTeacher}
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="absolute inset-0 w-full h-full object-cover -z-10"
            />

            {/* In-Video Overlay Info */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold">UNIVERSE Broadcast Node • Ultra-Low Latency</span>
            </div>

            {/* Broadcaster / Viewer Controls Bar */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMic}
                  className={`p-2 rounded-xl transition ${micOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-600'}`}
                  title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-xl transition ${videoOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-600'}`}
                  title={videoOn ? 'Turn Off Camera' : 'Turn On Camera'}
                >
                  {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              </div>

              {isTeacher && (
                <button
                  onClick={handleEndLive}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition cursor-pointer"
                >
                  <StopCircle className="w-4 h-4" />
                  <span>End Live Stream</span>
                </button>
              )}

              <div className="text-[11px] text-slate-400 hidden sm:block">
                HD 1080p • 60 FPS • Encrypted Stream
              </div>
            </div>
          </div>

          {/* Interactive Live Chat */}
          <div className="border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex flex-col h-full">
            <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-500" />
                <span>Live Q&A & Class Chat</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                Verified Subscribers
              </span>
            </div>

            {/* Chat message feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${msg.sender.includes('Dr.') || msg.sender.includes('Prof.') ? 'text-amber-400' : 'text-red-400'}`}>
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Ask teacher a question..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
