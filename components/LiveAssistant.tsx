
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, X, Loader2, Volume2 } from 'lucide-react';

interface LiveAssistantProps {
  onClose: () => void;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Audio Contexts and Nodes
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputNodeRef = useRef<GainNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Connection Refs
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Helper: Blob Creation for PCM
  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Data = btoa(binary);

    return {
      data: base64Data,
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  // Helper: Decode Base64
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Helper: Decode Audio Data
  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    try {
      setError(null);
      
      // Initialize Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      inputNodeRef.current = inputAudioContextRef.current.createGain();
      outputNodeRef.current = outputAudioContextRef.current.createGain();
      outputNodeRef.current.connect(outputAudioContextRef.current.destination);

      // Get User Media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: "你是一个‘爱游戏’的专业中文客服专员。你的名字叫‘小爱’。请用简短、热情、专业的中文回答用户关于存款（USDT）、提现、以及体育比赛规则的问题。",
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            
            if (!inputAudioContextRef.current || !streamRef.current) return;

            const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
            sourceRef.current = source;
            
            // Use ScriptProcessor for raw PCM access (standard approach for this API currently)
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              sessionPromise.then((session) => {
                 session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            
            if (base64Audio && outputAudioContextRef.current && outputNodeRef.current) {
               setIsSpeaking(true);
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
               
               const audioBuffer = await decodeAudioData(
                 decode(base64Audio),
                 outputAudioContextRef.current,
                 24000,
                 1
               );

               const source = outputAudioContextRef.current.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(outputNodeRef.current);
               
               source.addEventListener('ended', () => {
                 sourcesRef.current.delete(source);
                 if (sourcesRef.current.size === 0) {
                    setIsSpeaking(false);
                 }
               });

               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += audioBuffer.duration;
               sourcesRef.current.add(source);
            }
            
            if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsSpeaking(false);
            }
          },
          onclose: () => {
            setIsConnected(false);
          },
          onerror: (e) => {
            console.error("Gemini Live Error:", e);
            setError("连接错误，请重试");
            setIsConnected(false);
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start session:", err);
      setError("无法访问麦克风或连接失败");
    }
  };

  const stopSession = async () => {
    // Cleanup logic
    if (processorRef.current && sourceRef.current) {
        sourceRef.current.disconnect();
        processorRef.current.disconnect();
    }
    
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (inputAudioContextRef.current) {
        await inputAudioContextRef.current.close();
    }
    if (outputAudioContextRef.current) {
        await outputAudioContextRef.current.close();
    }
    
    if (sessionRef.current) {
       sessionRef.current.then((s: any) => {
         if(s.close) s.close(); 
       }).catch(() => {});
    }

    setIsConnected(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    startSession();
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-md p-6 rounded-3xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 relative mx-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center justify-center pt-6 pb-8">
            <div className="relative mb-8">
                {/* Pulse Effect */}
                {isConnected && (
                    <div className={`absolute inset-0 rounded-full bg-amber-500 blur-xl opacity-20 animate-pulse ${isSpeaking ? 'scale-150' : 'scale-100'} transition-transform duration-300`}></div>
                )}
                
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${isSpeaking ? 'border-amber-400 bg-amber-500/20' : 'border-slate-700 bg-slate-800'} transition-all duration-300`}>
                    {isConnected ? (
                        isSpeaking ? <Volume2 className="text-amber-400 w-10 h-10 animate-bounce" /> : <Mic className="text-white w-10 h-10" />
                    ) : (
                        <Loader2 className="text-amber-500 w-10 h-10 animate-spin" />
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">智能语音客服</h2>
            <p className="text-slate-400 text-center mb-6 px-4 h-6">
                {error ? (
                    <span className="text-red-400">{error}</span>
                ) : isConnected ? (
                    isSpeaking ? "客服正在说话..." : "我在听，请说话..."
                ) : (
                    "正在连接客服..."
                )}
            </p>

            <div className="flex gap-4 w-full">
                <button 
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                    取消
                </button>
                <button 
                   onClick={() => {
                       stopSession();
                       setTimeout(startSession, 500);
                   }}
                   className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-white font-bold hover:opacity-90 transition-opacity"
                >
                   重连
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;
