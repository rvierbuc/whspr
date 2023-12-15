import React, { useState, useRef } from 'react'
import axios from 'axios'
import algoliasearch from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, useSearchBox, useHits } from 'react-instantsearch';
import { v4 as uuidv4 } from 'uuid';


const generateUserToken = (): string => {
  return uuidv4();
};

const userToken = generateUserToken();

const searchClient = algoliasearch('2580UW5I69', 'b0f5d0cdaf312c18df4a45012c4251e4', {
  headers: {
    'X-Algolia-UserToken': userToken,
  }
});

const Hit = ({ hit }) => {
  const { hits } = useHits(); // the array of hits
  // console.log('hits', hits); //the individual hit obj
  return (
    <article>
      {hit.category}
    </article>
  )};
const CategorySearch = () => {
  const [currentSearch, setCurrentSearch] = useState<string>('***');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(event.target.value);
  }
  return (
    <div>
      <InstantSearch searchClient={searchClient} indexName="category_index">
        <SearchBox onInput={handleSearchChange} />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </div>
  );
}

export const RecordPost = ({ user, audioContext, title, category, openPost }: { user: any; audioContext: BaseAudioContext; title: string; category: string; openPost: () => void}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioSource = useRef<AudioBufferSourceNode | null>(null)
  const userId = user.id;

  const startRecording = async () => {
    try {
      //for now, this resets the recording array to an empty array when recording starts
      setAudioChunks([])
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data])
        }
      }
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      }
      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = async () => {
    if (mediaRecorder?.current?.state === 'recording') {
      mediaRecorder.current.stop()
      setIsRecording(false)
      // stop mic access
      const tracks = mediaRecorder.current.stream.getTracks()
      tracks.forEach((track) => {
        track.stop()
      })
    }
  }

  const playAudio = async (): Promise<void> => {
    if ((audioChunks.length === 0) || !audioContext) {
      console.error('something was null: ', audioChunks.length === 0, !audioContext)
      return
    }
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
    const arrayBuffer = await audioBlob.arrayBuffer()
    audioContext.decodeAudioData(
      arrayBuffer,
      (buffer) => {
        if (!audioContext) {
          console.error('audio context is null')
          return
        }
        audioSource.current = audioContext.createBufferSource()
        audioSource.current.buffer = buffer
        audioSource.current.connect(audioContext.destination)

        audioSource.current.onended = () => {
          setIsPlaying(false)
        }
        audioSource.current.start()
        setIsPlaying(true)
      },
      (error) => {
        console.error('error playing audio: ', error)
      }
    ).catch((playError) => {
      console.error('error playing: ', playError)
    })
  }

  const stopPlaying = () => {
    if (audioSource.current) {
      audioSource.current.stop()
      setIsPlaying(false)
    }
  }

  const emptyRecording = () => {
    setAudioChunks([])
  }

  const saveAudioToGoogleCloud = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('userId', userId)
      formData.append('title', title)
      formData.append('category', category)
      const response = await axios.post(`/upload`, formData)
      if (response.status === 200) {
        console.info('Audio save successfully')
      } else {
        console.error('Error saving audio:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving audio:', error)
    }
  }

  return (
        <div className="d-flex justify-content-center" style={{margin:'15px'}}>
          <button
            className="record-button"
            onClick={startRecording}
            disabled={isRecording}
            ><img src={require('../style/recordbutton.png')} /></button>
            <button
            className="play-button"
            onClick={playAudio}
            disabled={isPlaying || audioChunks.length === 0 }
            ><img src={require('../style/playbutton.png')} /></button>
            <button
            className="stop-button"
            onClick={isRecording ? stopRecording : stopPlaying}
            disabled={!isRecording && !isPlaying}
            ><img src={require('../style/stopbutton.png')} /></button>
            <button
            className="delete-button"
            onClick={emptyRecording}
            disabled={audioChunks.length === 0 || isRecording}
            ><img src={require('../style/deletebutton.png')} /></button>
            <button
            className="post-button"
            onClick={()=>{
              openPost()
              saveAudioToGoogleCloud()}
            }
            disabled={audioChunks.length === 0 || isRecording}
            ><img src={require('../style/postbutton.png')} /></button>
            <div className='category-search'>
              <CategorySearch />
            </div>
        </div>
  )
}
