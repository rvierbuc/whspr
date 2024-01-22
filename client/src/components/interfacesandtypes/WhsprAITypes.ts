export type UserId = string;
export type Voice = 'openai' | 'google' | 'elevenlabs';

export interface UserInterface {
  id: string;
  username: string | null;
  profileImgUrl: string | null;
  googleId: string | null;
  displayUsername: string | null;
  userBio: string | null;
  selectedTags: string[] | null;
}

export interface PressTime {
  current: NodeJS.Timeout | null;
}

export interface CanvasRef {
  current: HTMLCanvasElement | null;
}

export interface AnalyserNodeRef {
  current: AnalyserNode | null;
}

export interface MediaStreamRef {
  current: MediaStream | null;
}

export interface SourceNodeRef {
  current: MediaElementAudioSourceNode | null;
}

export interface FrameRef {
  current: number | null;
}

export interface AudioRef {
  current: HTMLAudioElement | null;
}

export interface DivRef {
  current: HTMLDivElement | null;
}

export interface WhsprAIProps {
  audioContext: AudioContext;
}

export interface msMaxTouchPointsCheck extends Navigator {
  msMaxTouchPoints?: number;
}