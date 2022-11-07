/**
 * Author: Russell
 * This component is use to control the audio status.
 */
import React from 'react';
import PropTypes from 'prop-types';
import './MusicController.less';
import { Tooltip } from 'antd';
import { CannoMP3, MP3358232, PingPongMP3, SkullbeatzMP3, EndeavorsMP3 } from '../../assets';

class MusicController extends React.Component {
  constructor(props) {
    super(props);
    this.audio = null;
    this.audioLoader = null;
    this.currPlayIndex = 0;
    this.playList = [CannoMP3, EndeavorsMP3, SkullbeatzMP3, MP3358232, PingPongMP3];

    this.audio = props.audioObj;
    this.audioLoader = props.audioLoaderObj;
    this.state = {
      playButton: null
    };
  }

  componentDidMount() {
    if (this.audio.isPlaying) {
      this.setStatePlay(true);
    } else {
      this.setStatePlay(false);
    }
  }

  /**
   * set the `playButton` behaviors by true or false.
   * @param boolean: true is playing state's behavior and false is pausing state's.
   */
  setStatePlay(boolean) {
    if (boolean) {
      this.setState({
        playButton: (
          <Tooltip title="死鬼你要抛弃我了嘛？嘤嘤嘤！">
            <span role="presentation" onClick={this.pause}>
              Pause
            </span>
          </Tooltip>
        )
      });
    } else {
      this.setState({
        playButton: (
          <Tooltip title="想我了嘛？">
            <span role="presentation" onClick={this.play}>
              Play
            </span>
          </Tooltip>
        )
      });
    }
  }

  preMusic = () => {
    if (this.audio.buffer) {
      this.audio.stop();
      this.setStatePlay(false);
    }
    this.currPlayIndex = this.currPlayIndex - 1;
    if (this.currPlayIndex >= 0) {
      this.loadPlay();
    } else {
      this.currPlayIndex = 0;
    }
  };

  play = () => {
    // 注意：audioLoader的load方法加载文件的时候是异步的，所以要把时间线上应该在加载之后的事情放在load里面的回掉函数里面
    if (!this.audio.buffer) {
      this.loadPlay();
    } else {
      this.audio.play();
    }
    this.setStatePlay(true);
  };

  pause = () => {
    this.audio.pause();
    this.setStatePlay(false);
  };

  nextMusic = () => {
    if (this.audio.buffer) {
      this.audio.stop();
      this.setStatePlay(false);
    }
    this.currPlayIndex = this.currPlayIndex + 1;
    if (this.currPlayIndex < this.playList.length) {
      this.loadPlay();
    } else {
      this.currPlayIndex = this.playList.length - 1;
    }
  };

  // load audio file to play by and set current audio duration time(in seconds).
  loadPlay() {
    this.audioLoader.load(
      this.playList[this.currPlayIndex],
      /**
       * @param buffer: AudioBuffer
       */
      buffer => {
        this.audio.setBuffer(buffer);
        this.audio.setLoop(true);
        this.audio.play();
        this.setStatePlay(true);
        window.console.log(this.audio.context.getOutputTimestamp());
      },
      xhr => {
        window.console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      }
    );
  }

  render() {
    const { playButton } = this.state;
    return (
      <div className="MusicController">
        <Tooltip title="好马不吃回头草，点了你就不是好马">
          <span role="presentation" onClick={this.preMusic}>
            上一首
          </span>
        </Tooltip>
        {playButton}
        <Tooltip title="吃着碗里的想着锅里的，三心二意">
          <span role="presentation" onClick={this.nextMusic}>
            下一首
          </span>
        </Tooltip>
      </div>
    );
  }
}

MusicController.propTypes = {
  audioObj: PropTypes.object.isRequired,
  audioLoaderObj: PropTypes.object.isRequired
};

export default MusicController;
