import React, { CSSProperties } from 'react'
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
      style={container}
    >
      <video style={videoStyle} ref={player} poster={poster} autoPlay={false} muted playsInline>
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

const container: CSSProperties = {
  height: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'default',
  width: '100%',
}

const videoStyle: CSSProperties = {
  zIndex: 0,
  backgroundRepeat: 'no-repeat',
  height: '100%',
  top: 0,
  left: 0,
  position: 'absolute',
  width: '100%',
  backgroundColor: 'rgb(0, 0, 0)',
  backgroundPosition: '50%',
  backgroundSize: 'contain',
}
