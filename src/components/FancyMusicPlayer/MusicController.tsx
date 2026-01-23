/**
 * Author: Russell
 * This component is use to control the audio status.
 */
import { useEffect, useState, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CannoMP3, MP3358232, PingPongMP3, SkullbeatzMP3, EndeavorsMP3 } from '@/assets';
import './MusicController.less';

interface PlayButtonProps {
  onClick: () => void;
  children: string;
}

function PlayButton({ onClick, children }: PlayButtonProps) {
  return (
    <span role="presentation" onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}

interface AudioController {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setBuffer: (buffer: AudioBuffer) => void;
  setLoop: (loop: boolean) => void;
  isPlaying: boolean;
  buffer: AudioBuffer | null;
  context: { getOutputTimestamp: () => unknown };
}

interface AudioLoader {
  load: (
    url: string,
    onSuccess: (buffer: AudioBuffer) => void,
    onProgress: (xhr: ProgressEvent) => void
  ) => void;
}

interface MusicControllerProps {
  audioObj: AudioController;
  audioLoaderObj: AudioLoader;
}

function MusicController({ audioObj: audio, audioLoaderObj: audioLoader }: MusicControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const currPlayIndexRef = useRef(0);
  const playList = [CannoMP3, EndeavorsMP3, SkullbeatzMP3, MP3358232, PingPongMP3];

  useEffect(() => {
    if (audio?.isPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [audio]);

  const setStatePlay = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const loadPlay = () => {
    audioLoader.load(
      playList[currPlayIndexRef.current],
      /**
       * @param buffer: AudioBuffer
       */
      (buffer: AudioBuffer) => {
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.play();
        setStatePlay(true);
        // eslint-disable-next-line no-console
        console.log(audio.context.getOutputTimestamp());
      },
      (xhr: ProgressEvent) => {
        // eslint-disable-next-line no-console
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      }
    );
  };

  const preMusic = () => {
    if (audio.buffer) {
      audio.stop();
      setStatePlay(false);
    }
    currPlayIndexRef.current = currPlayIndexRef.current - 1;
    if (currPlayIndexRef.current >= 0) {
      loadPlay();
    } else {
      currPlayIndexRef.current = 0;
    }
  };

  const play = () => {
    // 注意：audioLoader的load方法加载文件的时候是异步的，所以要把时间线上应该在加载之后的事情放在load里面的回掉函数里面
    if (!audio.buffer) {
      loadPlay();
    } else {
      audio.play();
    }
    setStatePlay(true);
  };

  const pause = () => {
    audio.pause();
    setStatePlay(false);
  };

  const nextMusic = () => {
    if (audio.buffer) {
      audio.stop();
      setStatePlay(false);
    }
    currPlayIndexRef.current = currPlayIndexRef.current + 1;
    if (currPlayIndexRef.current < playList.length) {
      loadPlay();
    } else {
      currPlayIndexRef.current = playList.length - 1;
    }
  };

  const playButton = isPlaying ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <PlayButton onClick={pause}>Pause</PlayButton>
      </TooltipTrigger>
      <TooltipContent>
        <p>死鬼你要抛弃我了嘛？嘤嘤嘤！</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <PlayButton onClick={play}>Play</PlayButton>
      </TooltipTrigger>
      <TooltipContent>
        <p>想我了嘛？</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="MusicController">
        <Tooltip>
          <TooltipTrigger asChild>
            <span role="presentation" onClick={preMusic} className="cursor-pointer">
              上一首
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>好马不吃回头草，点了你就不是好马</p>
          </TooltipContent>
        </Tooltip>
        {playButton}
        <Tooltip>
          <TooltipTrigger asChild>
            <span role="presentation" onClick={nextMusic} className="cursor-pointer">
              下一首
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>吃着碗里的想着锅里的，三心二意</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default MusicController;
