import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
//img imports
import mute from '../style/mute.svg';
import unmute from '../style/unmute.svg';
import pause from '../style/pause.svg';
import play from '../style/play-grey.svg';

export const WhsprAI = ({ audioContext }) => {
  const [isPhone, setIsPhone] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<string[]>([]);
  const [showText, setShowText] = useState(false);
  const [AIResponse, setAIResponse] = useState<string[]>([]);
  const [lengthTracker, setLengthTracker] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [animationInitialized, setAnimationInitialized] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const pressTime = useRef(null);
  const cardRef = useRef(null);
  const transcript = useRef(null);
  const user = useLoaderData();
  const userId = parseFloat(user.id);

  //this sets the number of messages that will be retrieved from the database and sent in the conversation to the ai
  const nMessages = 5;

  //checks if the user's device is a phone
  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
      setIsPhone(true);
      console.info('is phone');
    }
  }, []);

  //gets past messages from the db
  useEffect(() => {
    const getPastMessages = async () => {
      try {
        const response = await axios.get('/retrieveRecordsAIMessages', { params: { userId: userId, nMessages: nMessages } });
        const { latestUserMessages, latestAIMessages } = response.data;
        const userMessages = latestUserMessages.map((record) => record.message).reverse();
        const AIMessages = latestAIMessages.map((record) => record.message).reverse();
        setText(userMessages);
        setAIResponse(AIMessages);
        setLengthTracker(userMessages.length);
      } catch (error) {
        console.error('error getting past messages: ', error);
      }
    };
    getPastMessages();
  }, []);

  //sets up an analyser for the computer's speaker audio (when AI is talking)
  const setupAnalyser = (audio) => {
    if (!audioContext) {
      console.error('AudioContext is not available.');
      return;
    }
    try {
      if (!sourceRef.current) {
        sourceRef.current = audioContext.createMediaElementSource(audio);
      }
      const analyser = audioContext.createAnalyser();
      sourceRef.current.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
    } catch (error) {
      console.error('error setting up analyser:', error);
    }
  };


  useEffect(() => {
    let audioChunks = [];
    //starts the recording and hooks it up to the analyzer so mic sounds are also drawn
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        audioChunks = [];

        recorder.ondataavailable = e => {
          audioChunks.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(audioChunks);
          getTextFromSpeech(blob);
        };

        recorder.start();

        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 2048;
        const audio = audioContext.createMediaStreamSource(stream);
        audio.connect(analyserRef.current);
        drawAudio();
      } catch (error) { console.error('error starting recording:', error); }
    };

    const getTextFromSpeech = async (blob) => {
      const formData = new FormData();
      formData.append('audio', blob);
      try {
        const response = await axios.post('/speechToTextOpenAI', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const currentText = response.data;
        setText(prevText => [...prevText, currentText]);
        if (!showText) { setNewMessageCount(prevCount => prevCount + 1); }
      } catch (error) {
        console.error('error sending audio to server in getTextFromSpeech', error);
      }
    };

    //fires start recording and speech recognition when is recording is true
    if (isRecording) {
      startRecording();
    } else {
      if (sourceRef.current) {
        sourceRef.current = null;
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    }
    return () => {
      if (mediaStreamRef.current) {
        const tracks = mediaStreamRef.current.getTracks();
        tracks.forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [isRecording]);


  //animation draws the audio
  const drawAudio = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    if (!canvas || !analyser) { return; }
    const context = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);


    const drawFrame = () => {
      frameRef.current = requestAnimationFrame(drawFrame);
      analyser.getByteTimeDomainData(dataArray);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = 1;
      context.strokeStyle = 'rgb(4, 217, 255)';
      context.shadowBlur = 15;
      context.shadowColor = 'white';


      const sliceWidth = canvas.width * 1 / bufferLength;
      let x = 0;

      context.beginPath();
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128;
        const y = v * canvas.height / 2;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
        x += sliceWidth;
      }
      context.lineTo(canvas.width, canvas.height / 2);
      context.stroke();
    };

    drawFrame();
  };

  //gets ai generated text and speaks it
  const playAudio = (buffer) => {
    const array = new Uint8Array(buffer);
    const blob = new Blob([array], { type: 'audio/mpeg' });
    const blobUrl = URL.createObjectURL(blob);
    const audio = new Audio();
    audio.src = blobUrl;
    setupAnalyser(audio);
    drawAudio();
    audio.addEventListener('ended', () => {
      if (sourceRef.current) {
        setIsPlaying(false);
        sourceRef.current = null;
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    });
    setIsPlaying(true);
    audio.play();
    //attaches audio to audioRef
    audioRef.current = audio;
    if (isMuted) { audio.volume = 0; }
  };

  //this voice variable controls which endpoint is used for the tts
  //supported choices are openai, google, browser, elevenlabs
  const VOICE = 'openai';
  //sends user messages as text and gets text message back from open AI
  const getAIResponse = async () => {
    if (text.length === lengthTracker) { return; }
    const messages = [{ role: 'system', content: 'You are an my helpful friend Whisper.' }];
    const lastNMessages = arr => arr.length > nMessages ? arr.slice(-nMessages) : arr;
    const userMessages = lastNMessages(text);
    const aiMessages = lastNMessages(AIResponse);
    for (let i = 0; i < userMessages.length; i++) {
      messages.push({ 'role': 'user', 'content': `Respond using 100 completion_tokens or less: ${userMessages[i]}` });
      if (aiMessages[i]) {
        messages.push({ 'role': 'assistant', 'content': aiMessages[i] });
      }
    }
    //converts AI message to audio (TTS)
    try {
      const resp = await axios.post('/openAIGetResponse', { messages: messages });
      setAIResponse(prevResponses => [...prevResponses, resp.data.response]);
      const spokenResponse = await axios.post(`/text-to-speech-${VOICE}`, { text: resp.data.response }, { responseType: 'arraybuffer' });
      playAudio(spokenResponse.data);
      try {
        const recordsCreated = await axios.post('/createRecordsAIMessages', { newUserMessage: text[text.length - 1], newAIMessage: resp.data.response, userId: userId });
        setIsLoading(false);
      } catch (error) { console.error('Error creating records: ', error); }
    } catch (error) {
      console.error('Error getting response from AI in getAIResponse: ', error);
    }
  };

  //cleans up animation
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
  //send ai question
  useEffect(() => {
    if (!isRecording && text.length > lengthTracker) {
      setIsLoading(true);
      getAIResponse();
      setLengthTracker(text.length);
    }
  }, [isRecording, text]);

  //starts the audio context
  function startUserMedia() {
    if (!audioContext) {
      console.error('new audio for some reason');
      audioContext = new AudioContext;
    }
    audioContext.resume();
  }

  //displays the text of the conversation
  function handleSetShowText() {
    setShowText(!showText);
    setNewMessageCount(0);
    setTimeout(() => {
      transcript.current.scrollTop = transcript.current.scrollHeight;
    }, 0);
  }

  //sets canvas width to the whole screen
  useEffect(() => {
    if (canvasRef.current && cardRef.current.offsetWidth) {
      canvasRef.current.width = cardRef.current.offsetWidth;
    }
    window.addEventListener('resize', handleResize);
    return;

  }, []);

  const handleResize = () => {
    if (canvasRef.current && cardRef.current.offsetWidth) {
      canvasRef.current.width = cardRef.current.offsetWidth;
      initializeAnimation();
    }
  };

  //creates an analyser
  useEffect(() => {
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;
  }, [audioContext]);

  //starts and stops the animation so that a line appears on the screen
  const initializeAnimation = () => {
    if (!animationInitialized) {
      setTimeout(() => {
        drawAudio();
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
      }, 0);
      setAnimationInitialized(true);
    }
  };
  //fires initialize animation on pageload
  useEffect(() => {
    initializeAnimation();
  }, [animationInitialized]);

  const handlePressToTalkPress = () => {
    pressTime.current = setTimeout(() => {
      setIsRecording(true);
      vibratePhone();
    }, 300);
  };

  const handlePressToTalkRelease = () => {
    clearTimeout(pressTime.current);
    if (pressTime.current) {
      setIsRecording(false);
    }
    pressTime.current = null;
  };

  const vibratePhone = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : 1;
    }
  };

  const togglePause = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };


  return (
    <div className='container-whsprAI'>
      <div className='card-whsprAI' ref={cardRef} style={{ height: 'calc(100vh - 150px)' }}>
        <div className="help-btn-container">
          <img
            src={require('../style/help.png')}
            className='help-btn'
            title='Help'
            onClick={() => setModalOpen(!modalOpen)}
            style={{ opacity: modalOpen ? .25 : 1 }}
          />
          <div className="help-modal-whsprAI" onClick={() => setModalOpen(!modalOpen)}>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} >
              <p>Press and hold the button to talk to Whisper, our AI chatbot.</p>
            </Modal>
          </div>
        </div>
        <div className='pause-btn-container'>
          <img
            title={!isPaused ? 'Pause' : 'Play'}
            src={!isPaused ? pause : play}
            className={`pause-btn ${!isPlaying ? 'disabled' : ''}`}
            onClick={togglePause}
          />
        </div>
        <div>
          <div className="centered-whsprAI">
            <div className="canvas-container-whsprAI">
              <canvas ref={canvasRef} width="100vh" height="100" className="mt5"></canvas>
            </div>
          </div>
          <div className="press-to-talk-container">
            {isLoading
              ? (<img src={require('../style/loading.gif')}
                className="loading-img"></img>)
              : (<button
                title="Press to talk"
                onMouseDown={!isPhone ? () => { startUserMedia(); handlePressToTalkPress(); } : undefined}
                onMouseUp={!isPhone ? handlePressToTalkRelease : undefined}
                onMouseLeave={!isPhone ? handlePressToTalkRelease : undefined}
                onTouchStart={isPhone ? () => { startUserMedia(); handlePressToTalkPress(); } : undefined}
                onTouchEnd={isPhone ? handlePressToTalkRelease : undefined}
                onContextMenu={(e) => e.preventDefault()}
                className="push--skeuo"
                style={{ border: 'none' }}>
                <span>
                  press and<br />hold to talk
                </span>
              </button>
              )}
          </div>
          {showText && <div className='floating-text-whsprAI' ref={transcript}>
            {text.map((item, index) => (
              <div key={index} >
                <div><span className="chatHistoryName">You: </span><span className="chatHistoryText">{item}</span></div>
                {AIResponse[index] && <div><span className="chatHistoryName">Whisper: </span><span className="chatHistoryText">{AIResponse[index]}</span></div>}
              </div>
            ))}
          </div>}
        </div>
        <div className='mute-btn-container'>
          <img
            title={!isMuted ? 'Mute' : 'Unmute'}
            src={isMuted ? mute : unmute}
            className={`mute-btn ${!isPlaying ? 'disabled' : ''}`}
            onClick={toggleMute}
          />
        </div>
        <div className='text-btn-container'>
          <img
            title="Chat Transcript"
            src={require('../style/posticon.png')}
            className='text-btn'
            onClick={handleSetShowText}
            style={{ opacity: showText ? .25 : 1 }}
          />
          {newMessageCount > 0 && (
            <div className='message-count-whsprAI'>
              {newMessageCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
