import { useEffect, useState } from "react"
import { makeSharedState } from "./sharedState"

interface IRow {
  items(): Array<[number, number, number]>
}

const devMode = makeSharedState(false)

export class MineSweeper {
  #subs = makeSharedState(false)
  #start = makeSharedState(false)

  width = 0
  height = 0
  length = 0

  map: Int8Array
  opens = new Map<string, boolean>()
  flags = new Map<string, boolean>()

  startTime = -1
  stopTime = -1

  get timeString() {
    if(this.startTime == -1)
      return 0 .toFixed(2)

    const end = this.stopTime == -1 ? performance.now() : this.stopTime
    return ((end - this.startTime) / 1000).toFixed(2)
  }

  state = 0

  get devMode() { return DEVMODE && devMode.state }
  get started() { return this.#start.state }
  set started(v) { this.#start.setState(v) }
  get flugsCount() { return [...this.flags.values()].filter(e => e).length}
  get opensCount() { return [...this.opens.values()].filter(e => e).length }

  isOpen(x: number, y: number) {
    return !!this.opens.get(`${x}:${y}`) || this.state > 0
  }

  clear(x: number, y: number, cache = new Map<string, boolean>()) {
    const i = this.index([x, y])
    const d = `${x}:${y}`
    if (i == -1) return
    if (cache.get(d)) return
    cache.set(d, true)

    const val = this.map[i]
    const cX = x
    const cY = y

    if (val == 0) {
      for (let x = -1; x <= 1; x += 1) {
        for (let y = -1; y <= 1; y += 1) {
          if (!x && !y) continue
          this.clear(cX + x, cY + y, cache)
        }
      }
    }

    this.flags.set(`${x}:${y}`, false)
    this.opens.set(`${x}:${y}`, true)
  }

  setOpen(x: number, y: number) {
    if(!this.started)
      return


    this.clear(x, y)
    this.checkWin(x, y)
    this.render()
  }

  checkWin(x: number, y: number) {
    if(this.map[this.index([x,y])] == -1 && this.isOpen(x, y)) {
      this.started = false
      this.state = 1
      this.stopTime = performance.now()
    }

    if(
      this.opensCount + this.length == this.map.length ||
      (this.flugsCount == this.length && [...this.flags.entries()].filter(([key]) => {
        const [x, y] = key.split(':').map(e => +e)
        return this.map[this.index([x, y])] == -1
      })).length == this.length
    ) {
      this.started = false
      this.state = 2
      this.stopTime = performance.now()
    }
  }

  isFlag(x: number, y: number) {
    return !!this.flags.get(`${x}:${y}`)
  }

  toggleFlag(x: number, y: number) {
    const v = !this.isFlag(x, y)

    if(v && !(this.length - this.flugsCount))
      return

    this.flags.set(`${x}:${y}`, v)
    this.checkWin(x, y)
    this.render()
  }

  index(xy: [number, number]): number {
    const [x, y] = xy

    if (x < 0 || x >= this.width) return -1
    if (y < 0 || y >= this.height) return -1

    return y * this.width + x
  }

  position(i: number): [number, number] {
    const x = i % this.width
    const y = (i - x) / this.width
    return [x, y]
  }

  toggleDevMode() {
    devMode.setState(!devMode.state)
  }

  use() {
    this.#subs.useState()
    this.#start.useState()
    devMode.useState()
    return this
  }

  render() {
    this.#subs.setState(!this.#subs.state)
  }

  rows() {
    const output: IRow[] = []

    for (let y = 0; y < this.height; y++) {
      output.push({
        items: () => {
          const output: Array<[number, number, number]> = []

          for (let x = 0; x < this.width; x++)
            output.push([x, y, this.map[this.index([x, y])]])

          return output
        }
      })
    }

    return output
  }

  constructor(width = 0, height = 0, length = 0, public newGame = () => { }) {
    this.width = width
    this.height = height
    this.length = length
    this.map = new Int8Array(width * height)

    if (length >= this.map.length)
      throw new Error('Length bomb bigger length map')

    while (length > 0) {
      const index = [...this.map].map((e, i) => i)
        .filter(e => !this.map[e])
        .sort(() => Math.random() > 0.5 ? 1 : -1)[0]

      this.map[index] = -1
      length--
    }

    for (let i = 0; i < this.map.length; i++) {
      let n = this.map[i]

      if (n == -1)
        continue

      const [X, Y] = this.position(i)

      for (let x = -1; x <= 1; x += 1) {
        for (let y = -1; y <= 1; y += 1) {
          if (!x && !y)
            continue

          const j = this.index([X + x, Y + y])

          if (j < 0)
            continue

          const v = this.map[j]

          if (v >= 0)
            continue

          if (v == -1)
            n++
        }
      }

      this.map[i] = n
    }
  }

  start() {
    if(this.state == 0) {
      this.startTime = performance.now()
      this.started = true
    }
    this.render()
  }

  static make(width = 0, height = 0, length = 0) {
    const newGame = () => new this(width, height, length, () => {
      setGame(newGame)
    })
    const [game, setGame] = useState(newGame)
    return game
  }
}