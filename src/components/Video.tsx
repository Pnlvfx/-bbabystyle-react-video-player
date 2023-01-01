import React from 'react'
import Effects from './jsx/Effects'
import ScrollObserver from './jsx/ScrollObserver'
import { VideoPlayerContextProvider } from './jsx/VideoPlayerContext'
import VideoPlayer from './jsx/VideoPlayer'

interface VideoPlayerProps {
  url: string
  poster: string
  Logo: string
  duration?: number
  scroll?: boolean
}

const Video = ({ url, poster, duration, scroll, Logo }: VideoPlayerProps) => {
  return (
    <VideoPlayerContextProvider Logo={Logo} url={url} poster={poster} duration={duration}>
      <ScrollObserver enable={scroll}>
        <Effects>
          <VideoPlayer />
        </Effects>
      </ScrollObserver>
    </VideoPlayerContextProvider>
  )
}

export default Video
