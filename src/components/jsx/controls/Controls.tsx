import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  VideoAudioIcon,
  VideoCenterPlayIcon,
  VideoCenterReplayIcon,
  VideoFullscreenIcon,
  VideoMuteIcon,
  VideoPauseFromBarIcon,
  VideoPlayFromBarIcon,
  VideoSettingsIcon,
} from '../../SVG/SVG'
import { useProvider } from '../VideoPlayerContext'
import { handlePlayPause } from '../../hooks/hooks'
import { Spinner } from '../Spinner'
import Slider from './Slider'

const Controls = () => {
  const {
    isMuted,
    controls,
    isPlaying,
    videoContainerRef,
    volumeSlider,
    volumeSliderContainer,
    setIsPlaying,
    isEnded,
    setIsEnded,
    played,
    player,
    loading,
    duration,
    Logo,
  } = useProvider()

  const toggleFullScreenMode = () => {
    if (!videoContainerRef.current) return
    if (document.fullscreenElement == null) {
      videoContainerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const toggleMute = () => {
    if (!player.current) return
    player.current.muted = !player.current.muted
  }

  return (
    <>
      <div className='absolute flex h-full w-full items-center justify-center bg-[rgba(0,0,0,.4)]'>
        {isEnded && (
          <div className='h-auto w-auto opacity-95'>
            <button
              className='flex items-center justify-center outline-none bg-transparent'
              onClick={() => {
                //replay
                if (!player.current) return
                player.current.currentTime = 0
                setIsPlaying(false)
                setIsEnded(false)
                player.current.play()
              }}
            >
              <VideoCenterReplayIcon className='w-[50px] h-[50px] overflow-hidden' />
              <span
                className='flex items-center text-[12px] font-bold text-white ml-[10px] text-center leading-6'
                style={{
                  letterSpacing: '.5px',
                }}
              >
                REPLAY VIDEO
              </span>
            </button>
          </div>
        )}
      </div>
      {!isPlaying && !isEnded && (
        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlePlayPause(player)
          }}
          className='absolute top-[50%] left-[50%] ml-[-30px] mt-[-30px] z-10 cursor-pointer'
        >
          <VideoCenterPlayIcon />
        </div>
      )}
      {loading && (
        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlePlayPause(player)
          }}
          className='absolute top-[50%] left-[50%] ml-[-30px] mt-[-30px] z-10 cursor-pointer'
        >
          <Spinner />
        </div>
      )}
      <div className='absolute flex justify-between items-end bottom-0 left-0 right-0 p-2 align-baseline m-0'>
        <div
          style={{ background: 'linear-gradient(180deg, transparent, rgba(0, 0, 0, .5)' }}
          className='absolute h-full left-0 right-0 bottom-0'
        />
        <div className={`${controls ? 'opacity-0 md:opacity-100' : 'opacity-0'} ml-1 button`}>
          <div>
            <Link href={'/'} className='m-0 p-0 flex justify-center items-center w-[36px] h-[36px] align-baseline'>
              <div className='w-6 h-6 flex justify-center items-center'>
                <Image src={Logo} height={24} width={24} alt='Logo' />
              </div>
            </Link>
          </div>
        </div>
        <div className={`${controls ? 'opacity-0 md:opacity-100' : 'opacity-0'} button`}>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handlePlayPause(player)
            }}
            aria-label='Play'
            className='outline-none w-9 h-9 flex justify-center items-center'
          >
            {isPlaying ? (
              <VideoPauseFromBarIcon className='h-[18px] w-[18px] block' />
            ) : (
              <VideoPlayFromBarIcon className='h-[18px] w-[18px] block' />
            )}
          </button>
        </div>
        <div className={`${controls ? 'opacity-0 md:opacity-100' : 'opacity-0'} timeButton`}>{played}</div>
        <Slider />
        <div className={`${controls ? 'opacity-0 md:opacity-100' : 'opacity-0'} timeButton`}>{duration}</div>
        <div className={`${controls ? 'opacity-0 md:opacity-100' : 'opacity-0'} button`}>
          <div className='absolute'>
            <div></div>
          </div>
          <button
            className='outline-none w-9 h-9 flex justify-center items-center'
            aria-label='settings'
            aria-haspopup='true'
          >
            <VideoSettingsIcon className='w-[18px] h-[18px]' />
          </button>
        </div>
        <div className={`${controls ? 'opacity-0 md:opacity-100' : 'opacity-0'} button`}>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFullScreenMode()
            }}
            className='outline-none w-9 h-9 flex justify-center items-center'
            aria-label='Fullscreen'
          >
            <VideoFullscreenIcon className='w-[18px] h-[18px]' />
          </button>
        </div>
        <div className={`button [&>div:nth-child(1)]:hover:md:block [&>div:nth-child(1)]:hover:md:opacity-100`}>
          <div
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className='rounded-[4px] absolute m-0 h-[96px] w-6 bottom-[100%] bg-[rgba(0,0,0,.6)] cursor-pointer hidden opacity-0 transition-opacity'
          >
            <div
              ref={volumeSliderContainer}
              className='bg-[#ffffff80] top-2 bottom-2 my-[6px] mx-auto w-1 absolute left-0 right-0 rounded-sm'
            >
              <div
                ref={volumeSlider}
                className='bg-[#0079d3] absolute bottom-0 w-1 my-0 mx-auto left-0 right-0 rounded-sm'
                style={{ height: '0%' }}
              >
                <div
                  className='absolute left-[-4px] top-[-6px] mx-auto w-3 h-3 bg-[#fff]'
                  style={{ borderRadius: '50%' }}
                />
              </div>
            </div>
          </div>
          <button
            aria-label='Video Sound'
            onClick={(e) => {
              e.preventDefault()
              toggleMute()
              e.stopPropagation()
            }}
            className='outline-none w-9 h-9 flex justify-center items-center'
          >
            <VideoMuteIcon
              className='w-[18px] h-[18px] transition-opacity'
              style={{ display: isMuted ? 'block' : 'none', opacity: isMuted ? '100' : '0' }}
            />
            <VideoAudioIcon
              className='w-[18px] h-[18px] transition-opacity'
              style={{ display: isMuted ? 'none' : 'block', opacity: isMuted ? '0' : '100' }}
            />
          </button>
        </div>
      </div>
    </>
  )
}

export default Controls
