export type Options = {
  numQueries?: number | null
  timeBetweenQueries?: number | null
  maxRejections?: number | null
  timeout?: number | null
}

type RemoteTimeResult = {
  offset: number
  latency: number
}

export async function getRemoteTimeOffset(
  fetchRemoteTime: () => Promise<number>,
  options: Options = {}
): Promise<number> {
  const numQueries = options.numQueries || 5
  const timeBetweenQueries = options.timeBetweenQueries || 10
  const maxRejections = options.maxRejections || 0
  const timeout = options.timeout || numQueries * timeBetweenQueries * 10
  if (!Number.isFinite(numQueries) || numQueries < 0) {
    throw new Error(`invalid numQueries: ${numQueries}`)
  }
  if (!Number.isFinite(timeBetweenQueries) || timeBetweenQueries < 0) {
    throw new Error(`invalid timeBetweenQueries: ${timeBetweenQueries}`)
  }
  if (!Number.isFinite(timeout) || timeout < 0) {
    throw new Error(`invalid timeout: ${timeout}`)
  }
  if (timeout < numQueries * timeBetweenQueries) {
    throw new Error(`timeout is too low to possibly finish: ${timeout}`)
  }

  async function run(): Promise<number> {
    const results: Array<RemoteTimeResult> = []
    let numRejections = 0

    while (results.length < numQueries) {
      const startTime = Date.now()
      try {
        const time = await fetchRemoteTime()
        const endTime = Date.now()
        if (time == null) throw new Error('time cannot be null or undefined')
        if (isNaN(time)) throw new Error('time cannot be NaN')
        if (!Number.isFinite(time)) throw new Error('time cannot be infinite')
        if (time < 0) throw new Error(`time is out of range: ${time}`)
        const offset = time - endTime
        const latency = endTime - startTime
        // istanbul ignore next
        if (latency < 0)
          throw new Error('latency cannot be less than zero: ' + latency)
        results.push({ offset, latency })
      } catch (err) {
        numRejections++
        if (numRejections >= maxRejections) {
          throw err
        }
      }
      const delay = Math.max(0, startTime + timeBetweenQueries - Date.now())
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    const samples = results.slice(1)
    const avgOffset =
      samples.reduce((prev, cur) => prev + cur.offset, 0) / samples.length
    const avgLatency =
      samples.reduce((prev, cur) => prev + cur.latency, 0) / samples.length
    return Math.floor(avgOffset + avgLatency / 2)
  }

  return await Promise.race([
    run(),
    new Promise<number>((resolve, reject) =>
      setTimeout(() => reject(new Error('timed out')), timeout)
    ),
  ])
}
