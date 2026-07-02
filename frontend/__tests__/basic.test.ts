import { describe, it, expect } from 'vitest'

describe('MergeMind Frontend', () => {
  it('should have correct app name', () => {
    const appName = 'MergeMind'
    expect(appName).toBe('MergeMind')
  })

  it('should validate opportunity score range', () => {
    const validateScore = (score: number) => score >= 0 && score <= 100
    expect(validateScore(85)).toBe(true)
    expect(validateScore(-1)).toBe(false)
    expect(validateScore(101)).toBe(false)
  })

  it('should determine difficulty level', () => {
    const getDifficulty = (labels: string[]) => {
      if (labels.includes('good first issue')) return 'Easy'
      if (labels.includes('hard')) return 'Hard'
      return 'Medium'
    }

    expect(getDifficulty(['good first issue', 'bug'])).toBe('Easy')
    expect(getDifficulty(['hard', 'feature'])).toBe('Hard')
    expect(getDifficulty(['bug'])).toBe('Medium')
  })

  it('should format time correctly', () => {
    const formatTime = (minutes: number) => {
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? ${hours}h m : ${hours}h
      }
      return ${minutes}m
    }

    expect(formatTime(90)).toBe('1h 30m')
    expect(formatTime(120)).toBe('2h')
    expect(formatTime(45)).toBe('45m')
  })
})
