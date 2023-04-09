import React, { ReactNode, useEffect } from 'react'
import { useProvider } from './VideoPlayerContext'
import { formatDuration } from '../hooks/hooks'

interface EffectsProps {
  children: ReactNode
}

const Effects = ({ children }: EffectsProps) => {
  const {
    setControls,
    videoContainerRef,
    player,
    isEnded,
    isMuted,
    setIsMuted,
    volumeSliderContainer,
    setIsEnded,
    volumeSlider,
    timelineBall,
    setprogressPosition,
    setPlayed,
    setDuration,
    timelineRef,
    setIsPlaying,
    previewPositionRef,
    setLoading,
  } = useProvider()

  let isScrabbing = false
  let wasPaused = false

  let isChangeVolume = false
  let isStillClicked = false

  const onPlay = () => {
    setIsPlaying(true)
    if (isEnded) setIsEnded(false)
  }
  const onEnded = () => {
    setIsPlaying(false)
    setIsEnded(true)
  }

  const onTimeUpdate = () => {
    if (!player.current) return
    setPlayed(formatDuration(player.current.currentTime))
    const percent = player.current.currentTime / player.current.duration
    setprogressPosition(percent)
  }

  const toggleScrubbing = (e: MouseEvent) => {
    const rect = timelineRef.current?.getBoundingClientRect()
    if (!rect?.x || !timelineBall.current || !player.current) return
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrabbing = (e.buttons & 1) === 1
    timelineBall.current.style.opacity = '1'
    if (isScrabbing) {
      wasPaused = player.current.paused
      player.current.pause()
    } else {
      player.current.currentTime = percent * player.current.duration
      if (!wasPaused) player.current.play()
      setTimeout(() => {
        if (!timelineBall.current) return
        timelineBall.current.style.opacity = '0'
      }, 300)
    }
    handleTimelineUpdate(e)
  }

  const handleTimelineUpdate = (e: MouseEvent) => {
    if (!timelineRef.current || !previewPositionRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    previewPositionRef.current.style.width = `${percent * 100}%`

    if (isScrabbing) {
      e.preventDefault()
      setprogressPosition(percent)
    }
  }

  const documentMouseUP = (e: MouseEvent) => {
    if (isScrabbing) toggleScrubbing(e)
    if (isStillClicked) {
      e.preventDefault()
      e.stopPropagation()
      isChangeVolume = false
    }
  }

  const documentMouseMOVE = (e: MouseEvent) => {
    if (isScrabbing) handleTimelineUpdate(e)
  }

  const onVolumeChange = () => {
    if (!volumeSlider.current || !player.current) return
    volumeSlider.current.style.height = `${player.current.volume * 100}%`
    if (player.current.muted || player.current.volume === 0) {
      volumeSlider.current.style.height = '0'
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const clickVolumeSlider = (e: MouseEvent) => {
    if (!volumeSliderContainer.current || !player.current || !volumeSlider.current) return
    e.preventDefault()
    isChangeVolume = true
    isStillClicked = true
    const rect = volumeSliderContainer.current.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.y - rect.y), rect.height) / rect.height
    const reverse = 1 - Math.abs(percent)
    player.current.volume = reverse
    player.current.muted = reverse === 0
    setIsMuted(reverse === 0)
    volumeSlider.current.style.height = `${reverse * 100}%`
  }

  const slideOnVolume = (e: MouseEvent) => {
    e.preventDefault()
    if (isChangeVolume) {
      if (!volumeSliderContainer.current || !player.current || !volumeSlider.current) return
      const rect = volumeSliderContainer.current.getBoundingClientRect()
      const percent = Math.min(Math.max(0, e.y - rect.y), rect.height) / rect.height
      const reverse = 1 - Math.abs(percent)
      player.current.volume = reverse
      player.current.muted = reverse === 0
      volumeSlider.current.style.height = `${reverse * 100}%`
    }
  }

  const onLoading = () => {
    setLoading(true)
  }

  const addListeners = () => {
    player.current?.addEventListener('waiting', onLoading)
    player.current?.addEventListener('play', () => onPlay())
    player.current?.addEventListener('pause', () => {
      setIsPlaying(false)
    })
    player.current?.addEventListener('ended', () => onEnded())
    //CURRENT TIME AND PROGRESS VALUE
    player.current?.addEventListener('timeupdate', () => onTimeUpdate())
    player.current?.addEventListener('loadedmetadata', () => {
      if (!player.current) return
      const d = formatDuration(player.current?.duration)
      setDuration(d)
      setLoading(false)
    })
    //PROGRESS BAR
    timelineRef.current?.addEventListener('mousemove', handleTimelineUpdate) //preview
    timelineRef.current?.addEventListener('mousedown', toggleScrubbing) //progress
    document.addEventListener('mouseup', (e) => documentMouseUP(e))
    document.addEventListener('mousemove', documentMouseMOVE)
    //VOLUME
    player.current?.addEventListener('volumechange', onVolumeChange)
    volumeSliderContainer.current?.addEventListener('mousedown', (e) => clickVolumeSlider(e))
    volumeSliderContainer.current?.addEventListener('mousemove', (e) => slideOnVolume(e))
    //CONTAINER
    videoContainerRef.current?.addEventListener('mouseenter', () => {
      setControls(true)
    })
    videoContainerRef.current?.addEventListener('mouseleave', () => {
      setControls(false)
    })
  }

  const removeListeners = () => {
    player.current?.removeEventListener('play', () => onPlay())
    player.current?.removeEventListener('pause', () => {
      setIsPlaying(false)
    })
    player.current?.removeEventListener('ended', () => onEnded())
    //CURRENT TIME AND PROGRESS VALUE
    player.current?.removeEventListener('timeupdate', () => onTimeUpdate())
    player.current?.removeEventListener('loadedmetadata', () => {
      if (!player.current) return
      const d = formatDuration(player.current.duration)
      setDuration(d)
    })
    //PROGRESS BAR
    timelineRef.current?.removeEventListener('mousemove', handleTimelineUpdate) //preview
    timelineRef.current?.removeEventListener('mousedown', toggleScrubbing) //progress
    document.removeEventListener('mouseup', (e) => documentMouseUP(e))
    document.removeEventListener('mousemove', documentMouseMOVE)
    //VOLUME
    player.current?.removeEventListener('volumechange', onVolumeChange)
    volumeSliderContainer.current?.removeEventListener('mousedown', (e) => clickVolumeSlider(e))
    volumeSliderContainer.current?.removeEventListener('mousemove', (e) => slideOnVolume(e))
    //CONTAINER
    videoContainerRef.current?.removeEventListener('mouseenter', () => {
      setControls(true)
    })
    videoContainerRef.current?.removeEventListener('mouseleave', () => {
      setControls(false)
    })
  }

  useEffect(() => {
    addListeners()
    return () => {
      removeListeners()
    }
  }, [])

  return <>{children}</>
}

export default Effects
