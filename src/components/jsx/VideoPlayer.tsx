import React from 'react'
import { handlePlayPause } from '../hooks/hooks'
import { useProvider } from './VideoPlayerContext'
import Controls from './controls/Controls'
import '../css/video.css'

const VideoPlayer = () => {
  const { player, url, poster, videoContainerRef } = useProvider()

  return (
    <div
      className='container'
      ref={videoContainerRef}
      onClick={(e) => {
        e.preventDefault()
        handlePlayPause(player)
        e.stopPropagation()
      }}
    >
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
