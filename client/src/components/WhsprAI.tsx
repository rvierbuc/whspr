import React, { useState, useEffect, useRef } from 'react'
import { Modal } from './Modal'
import axios from 'axios'
import { useLoaderData } from 'react-router-dom';
// import {audioContext} from './App'

export const WhsprAI = ({ audioContext }) => {
  const [isPhone, setIsPhone] = useState(false);
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState<string[]>([])
  const [showText, setShowText] = useState(false);
  const [AIResponse, setAIResponse] = useState<string[]>([])
  const [lengthTracker, setLengthTracker] = useState(0)
  const [modalOpen, setModalOpen] = useState(false);
  const [animationInitialized, setAnimationInitialized] = useState(false);
  const canvasRef = useRef(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const cardRef = useRef(null)
  const user = useLoaderData()
  const userId = parseFloat(user.id);


  //this sets the number of messages that will be retrieved from the database and sent in the conversation to the ai
  const nMessages = 5

  //checks if the user's device is a phone
  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
      setIsPhone(true);
      console.info('is phone')
    }
  }, []);

  //gets past messages from the db
  useEffect(() => {
    const getPastMessages = async () => {
      try {
        const response = await axios.get('/retrieveRecordsAIMessages', { params: { userId: userId, nMessages: nMessages } })
        const { latestUserMessages, latestAIMessages } = response.data;
        const userMessages = latestUserMessages.map((record) => record.message).reverse()
        const AIMessages = latestAIMessages.map((record) => record.message).reverse()
        setText(userMessages)
        setAIResponse(AIMessages)
        setLengthTracker(userMessages.length)
      } catch (error) {
        console.error('error getting past messages: ', error)
      }
    }
    getPastMessages();
  }, [])

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
      console.error('error setting up analyser:', error)
    }
  };

  // browser speech transcription
  useEffect(() => {
    // const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    // const recognize = new SpeechRecognition()
    // recognize.continuous = true;
    // recognize.onresult = (e) => {
    //   let currentText = ''
    //   for (let i = e.resultIndex; i < e.results.length; ++i) {
    //     if (e.results[i].isFinal) {
    //       currentText = e.results[i][0].transcript;
    //       setText(prevText => [...prevText, currentText]);

    //     }
    //   }
    // };
    let audioChunks = [];
    //starts the recording and hooks it up to the analyzer so mic sounds are also drawn
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const recorder = new MediaRecorder(stream)
        audioChunks = []

        recorder.ondataavailable = e => {
          audioChunks.push(e.data)
        }

        recorder.onstop = async () => {
          const blob = new Blob(audioChunks)
          getTextFromSpeech(blob)
        }

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
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const currentText = response.data;
        setText(prevText => [...prevText, currentText]);
      } catch (error) {
        console.error('error sending audio to server in getTextFromSpeech', error)
      }
    }

    //fires start recording and speech recognition when is recording is true
    if (isRecording) {
      // recognize.start();
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
      // if (recognize) {
      //   recognize.stop();
      // }
      if (mediaStreamRef.current) {
        const tracks = mediaStreamRef.current.getTracks();
        tracks.forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [isRecording]);

  //creates an analyser
  useEffect(() => {
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;
  }, [audioContext]);

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


      const sliceWidth = canvas.width * 1 / bufferLength
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
  //gets the browser based voices and speaks them
  const browserTextToSpeech = async (responseString, voiceName) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      await new Promise<void>(resolve => {
        const voicesChanged = () => {
          voices = window.speechSynthesis.getVoices();
          resolve();
          window.speechSynthesis.onvoiceschanged = null;
        };
        window.speechSynthesis.onvoiceschanged = voicesChanged;
      });
    }
    const utterance = new SpeechSynthesisUtterance(responseString);
    const selectedVoice = voices.find(voice => voice.name === voiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn('Selected voice not found, using default voice');
    }
    window.speechSynthesis.speak(utterance);
  };

  //////////////////////////////gets ai generated text and speaks it
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
        sourceRef.current = null;
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    });
    audio.play();
  };

  //this voice variable controls which endpoint is used for the tts
  //supported choices are openai, google, browser, elevenlabs
  const VOICE = 'openai'
  //sends user messages as text and gets text message back from open AI
  const getAIResponse = async () => {
    if (text.length === lengthTracker) return
    const messages = [{ role: "system", content: "You are an my helpful friend Whisper." }]
    const lastNMessages = arr => arr.length > nMessages ? arr.slice(-nMessages) : arr
    const userMessages = lastNMessages(text);
    const aiMessages = lastNMessages(AIResponse);
    for (let i = 0; i < userMessages.length; i++) {
      messages.push({ "role": "user", "content": `Respond using 100 completion_tokens or less: ${userMessages[i]}` })
      if (aiMessages[i]) {
        messages.push({ "role": "assistant", "content": aiMessages[i] })
      }
    }
    //converts AI message to audio (TTS)
    try {
      const resp = await axios.post('/openAIGetResponse', { messages: messages })
      setAIResponse(prevResponses => [...prevResponses, resp.data.response])
      if (VOICE === 'browser') {
        //you can change the browser voice selected here, it searches by the name property on the object
        browserTextToSpeech(resp.data.response, "Microsoft Zira - English (United States)")
      } else {
        const spokenResponse = await axios.post(`/text-to-speech-${VOICE}`, { text: resp.data.response }, { responseType: 'arraybuffer' })
        playAudio(spokenResponse.data)
      }
      try {
        const recordsCreated = await axios.post('/createRecordsAIMessages', { newUserMessage: text[text.length - 1], newAIMessage: resp.data.response, userId: userId })
        setIsLoading(false)
      } catch (error) { console.error("Error creating records: ", error) }
    } catch (error) {
      console.error("Error getting response from AI in getAIResponse: ", error)
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
      console.error("new audio for some reason")
      audioContext = new AudioContext;
    }
    audioContext.resume()
  }

  //displays the text of the conversation
  function handleSetShowText() {
    setShowText(!showText)
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
    setIsRecording(true);
  }
  const handlePressToTalkRelease = () => {
    setIsRecording(false)
    vibratePhone();
  }

  const vibratePhone = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200)
    }
  }

  return (
    <div className='container-whsprAI'>
      <div className='card' ref={cardRef} style={{ height: "calc(100vh - 150px)" }}>


        <img
          src={require('../style/help.png')}
          className='help-btn'
          onClick={() => setModalOpen(!modalOpen)}
          style={{ opacity: modalOpen ? .25 : 1 }}
        />
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <p>Press and hold the button to talk to Whisper, our AI chatbot.</p>
        </Modal>
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
                onMouseDown={!isPhone ? () => { startUserMedia(); handlePressToTalkPress() } : undefined}
                onMouseUp={!isPhone ? handlePressToTalkRelease : undefined}
                onMouseLeave={!isPhone ? handlePressToTalkRelease : undefined}
                onTouchStart={isPhone ? () => { startUserMedia(); handlePressToTalkPress() } : undefined}
                onTouchEnd={isPhone ? handlePressToTalkRelease : undefined}
                onContextMenu={(e) => e.preventDefault()}
                className="btn"
                style={{ border: 'none' }}>
                {!isRecording
                  ? (<img src={require('../style/presstotalk.png')}
                    className="presstotalk-img" />)
                  : <img src={require('../style/pressedtotalk.png')}
                    draggable="false"
                    className="presstotalk-img" />}
              </button>
              )}
          </div>
          {showText && <div className='floating-text-whsprAI'>
            {text.map((item, index) => (
              <div key={index} >
                <div><span className="text-warning">You: </span><span className="text-success">{item}</span></div>
                {AIResponse[index] && <div><span className="text-warning">Whisper: </span><span className="text-success">{AIResponse[index]}</span></div>}
              </div>
            ))}
          </div>}
        </div>
        <img
          src={require('../style/posticon.png')}
          className='text-btn'
          onClick={handleSetShowText}
          style={{ opacity: showText ? .25 : 1 }}
        />

      </div>
    </div>
  );
};
