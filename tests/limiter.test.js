import { SimpleLimiter } from '../src/wechaty/limiter.js'

describe('SimpleLimiter', () => {
  let limiter
  beforeEach(() => {
    limiter = new SimpleLimiter(5, 10000)
  })

  test('should allow access within the limit', () => {
    for (let i = 0; i < 5; i++) {
      expect(limiter.canAccess('user1')).toBe(true)
    }
  })

  test('should deny access when limit is exceeded', () => {
    for (let i = 0; i < 5; i++) {
      limiter.canAccess('user1')
    }
    expect(limiter.canAccess('user1')).toBe(false)
  })

  test('should reset after the interval', async () => {
    for (let i = 0; i < 5; i++) {
      limiter.canAccess('user1')
    }
    expect(limiter.canAccess('user1')).toBe(false)

    // Wait for the interval to pass
    await new Promise((resolve) => setTimeout(resolve, 10000))

    expect(limiter.canAccess('user1')).toBe(true)
  })

  test('should handle multiple keys independently', () => {
    for (let i = 0; i < 5; i++) {
      expect(limiter.canAccess('user1')).toBe(true)
      expect(limiter.canAccess('user2')).toBe(true)
    }
    expect(limiter.canAccess('user1')).toBe(false)
    expect(limiter.canAccess('user2')).toBe(false)
  })

  test('cleanup should remove expired records', async () => {
    limiter.canAccess('user1')
    limiter.canAccess('user2')

    // Wait for the interval to pass
    await new Promise((resolve) => setTimeout(resolve, 10000))

    limiter.cleanup()

    // After cleanup, the internal records should be empty
    // console.log(limiter.requests.size);

    expect(limiter.requests.size).toBe(0)
  })
})
