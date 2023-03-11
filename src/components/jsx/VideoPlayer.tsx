import React, { MouseEvent } from 'react'
import { handlePlayPause } from '../hooks/hooks'
import { useProvider } from './VideoPlayerContext'
import Controls from './controls/Controls'
import '../css/video.css'

const VideoPlayer = () => {
  const { player, url, poster, videoContainerRef } = useProvider()

  const playFromContainer = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    handlePlayPause(player)
  }

  return (
    <div className='container' ref={videoContainerRef} onClick={playFromContainer}>
      <video className='video' ref={player} poster={poster} autoPlay={false} muted playsInline>
        {Array.isArray(url) ? (
          url.map((source, index) => <source key={index} src={source.url} />)
        ) : (
          <source src={url} />
        )}
      </video>
      <Controls />
    </div>
  )
}

export default VideoPlayer
