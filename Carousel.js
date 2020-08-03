import createElement from './createElement'
import { TimeLine, Animation, ease } from './animation'
import './carousel.css'
export default class Carousel {
    constructor(config) {
        this.children = []
    }

    setAttribute(name, value) {
        this[name] = value
    }

    render() {
        let tl = new TimeLine()
        tl.start()
        let offset = 0,
            current = null,
            last = null,
            next = null,
            position = 0,
            lastPosition = 0,
            nextPosition = 0,
            timeoutHandler = null
        const handleStart = (index) => {
            tl.pause()
            timeoutHandler && clearTimeout(timeoutHandler)
            position = index
            lastPosition = (position - 1 + this.data.length) % this.data.length
            nextPosition = (position + 1) % this.data.length

            current = children[position]
            last = children[lastPosition]
            next = children[nextPosition]
            let translateX = /translateX\(([\s\S]+)px\)/.exec(current.style.transform)[1]
            offset = parseInt(translateX) - -500 * position
        }
        const handlePan = (event) => {
            let dx = event.detail.clientX - event.detail.startX

            let currentTranslateX = offset + -500 * position + dx,
                lastTranslateX = offset - 500 - 500 * lastPosition + dx,
                nexttTranslateX = offset + 500 - 500 * nextPosition + dx

            current.style.transform = `translateX(${currentTranslateX}px)`
            last.style.transform = `translateX(${lastTranslateX}px)`
            next.style.transform = `translateX(${nexttTranslateX}px)`
        }

        const handlePanend = (event) => {
            let direction = 0
            let dx = event.detail.clientX - event.detail.startX

            if (dx + offset > 250) {
                direction = 1
            } else if (dx + offset < -250) {
                direction = -1
            }

            let currentTranslateX = offset + -500 * position + dx,
                lastTranslateX = offset - 500 - 500 * lastPosition + dx,
                nexttTranslateX = offset + 500 - 500 * nextPosition + dx

            let endCurrentTranslateX = -500 * position + 500 * direction
            let endLastTranslateX = -500 - 500 * lastPosition + 500 * direction
            let endNextTranslateX = 500 - 500 * nextPosition + 500 * direction

            let currentAnimation = new Animation({
                object: current.style,
                property: 'transform',
                template: (v) => `translateX(${v}px)`,
                start: currentTranslateX,
                end: endCurrentTranslateX,
                duration: 500,
                timingFunction: ease,
            })
            let lastAnimation = new Animation({
                object: last.style,
                property: 'transform',
                template: (v) => `translateX(${v}px)`,
                start: lastTranslateX,
                end: endLastTranslateX,
                duration: 500,
                timingFunction: ease,
            })
            let nextAnimation = new Animation({
                object: next.style,
                property: 'transform',
                template: (v) => `translateX(${v}px)`,
                start: nexttTranslateX,
                end: endNextTranslateX,
                duration: 500,
                timingFunction: ease,
            })
            tl.reset()
            tl.start()
            tl.add(currentAnimation)
            tl.add(lastAnimation)
            tl.add(nextAnimation)

            position = (position - direction + this.data.length) % this.data.length
            timeoutHandler = setTimeout(nextPic, 3000)
        }

        let children = this.data.map((url, i) => {
                let el = (
                    <img
                        src={url}
                        enableGesture={true}
                        onStart={handleStart.bind(null, i)}
                        onPan={handlePan}
                        onPanend={handlePanend}
                    />
                )
                el.addEventListener('dragstart', (e) => e.preventDefault())
                return el
            }),
            root = <div class="carousel">{children}</div>
        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length
            let current = children[position],
                next = children[nextPosition]

            let currentAnimation = new Animation({
                object: current.style,
                property: 'transform',
                template: (v) => `translateX(${v}px)`,
                start: -500 * position,
                end: -500 - 500 * position,
                duration: 1000,
                timingFunction: ease,
            })
            let nextAnimation = new Animation({
                object: next.style,
                property: 'transform',
                template: (v) => `translateX(${v}px)`,
                start: 500 - 500 * nextPosition,
                end: -500 * nextPosition,
                duration: 1000,
                timingFunction: ease,
            })

            tl.add(currentAnimation)
            tl.add(nextAnimation)
            position = nextPosition

            timeoutHandler = setTimeout(nextPic, 3000)
        }
        nextPic()
        return root
    }

    mountTo(parent) {
        this.render().mountTo(parent)
    }
}
