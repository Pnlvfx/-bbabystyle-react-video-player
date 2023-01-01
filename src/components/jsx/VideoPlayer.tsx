import React from 'react'
import '../../css/VideoPlayer.css'
import { handlePlayPause } from '../hooks/hooks'
import { useProvider } from './VideoPlayerContext'
import Controls from './controls/Controls'

const VideoPlayer = () => {
  const { player, url, poster, videoContainerRef } = useProvider()

  return (
    <div
      ref={videoContainerRef}
      onClick={(e) => {
        e.preventDefault()
        handlePlayPause(player)
        e.stopPropagation()
      }}
      className='container'
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
