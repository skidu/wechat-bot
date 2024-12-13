export class SimpleLimiter {
  constructor(limit, windowSize) {
    this.limit = limit // 窗口内允许的最大请求数
    this.windowSize = windowSize // 窗口大小（毫秒）
    this.requests = new Map() // 存储每个key的请求记录
  }

  canAccess(key) {
    const now = Date.now()
    const windowStart = now - this.windowSize

    if (!this.requests.has(key)) {
      this.requests.set(key, [])
    }

    const keyRequests = this.requests.get(key)

    // 移除窗口外的请求
    while (keyRequests.length > 0 && keyRequests[0] <= windowStart) {
      keyRequests.shift()
    }

    // 检查是否超过限制
    if (keyRequests.length < this.limit) {
      keyRequests.push(now)
      return true
    }

    return false
  }

  cleanup() {
    const now = Date.now()
    const windowStart = now - this.windowSize

    for (let [key, requests] of this.requests.entries()) {
      // 移除窗口外的请求
      while (requests.length > 0 && requests[0] <= windowStart) {
        requests.shift()
      }

      // 如果没有请求，删除这个key
      if (requests.length === 0) {
        this.requests.delete(key)
      }
    }
  }
}
// module.exports = setImmediate
