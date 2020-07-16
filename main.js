import createElement from './createElement'
class Carousel {
    constructor(config) {
        this.children = []
    }

    setAttribute(name, value) {
        //attribute
        this[name] = value
    }

    render() {
        let children = this.data.map((url) => {
                let el = <img src={url} />
                el.addEventListener('dragstart', (e) => e.preventDefault())
                return el
            }),
            root = <div class="carousel">{children}</div>
        let position = 0
        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length
            let current = children[position],
                next = children[nextPosition]

            current.style.transition = 'none'
            next.style.transition = 'none'

            current.style.transform = `translateX(${-100 * position}%)`
            next.style.transform = `translateX(${100 - 100 * nextPosition}%)`

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    current.style.transition = ''
                    next.style.transition = ''
                    current.style.transform = `translateX(${-100 - 100 * position}%)`
                    next.style.transform = `translateX(${-100 * nextPosition}%)`

                    position = nextPosition
                })
            })

            setTimeout(nextPic, 3000)
        }
        // nextPic()

        root.addEventListener('mousedown', (e) => {
            let startX = e.clientX

            let lastPosition = (position - 1 + this.data.length) % this.data.length,
                nextPosition = (position + 1) % this.data.length

            let current = children[position],
                last = children[lastPosition],
                next = children[nextPosition]

            current.style.transition = 'none'
            last.style.transition = 'none'
            next.style.transition = 'none'

            current.style.transform = `translateX(${-500 * position}px)`
            last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`
            next.style.transform = `translateX(${500 - 500 * nextPosition}px)`

            let move = (e) => {
                    current.style.transform = `translateX(${e.clientX - startX - 500 * position}px)`
                    last.style.transform = `translateX(${e.clientX - startX - 500 - 500 * lastPosition}px)`
                    next.style.transform = `translateX(${e.clientX - startX + 500 - 500 * nextPosition}px)`
                },
                up = (e) => {
                    let offset = 0
                    if (e.clientX - startX > 250) {
                        offset = 1
                    } else if (e.clientX - startX < -250) {
                        offset = -1
                    }
                    // 让元素有transition效果
                    current.style.transition = ''
                    last.style.transition = ''
                    next.style.transition = ''

                    current.style.transform = `translateX(${offset * 500 - 500 * position}px)`
                    last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`
                    next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`

                    position = (position - offset + this.data.length) % this.data.length

                    document.removeEventListener('mousemove', move)
                    document.removeEventListener('mouseup', up)
                }

            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
        })
        return root
    }

    mountTo(parent) {
        this.render().mountTo(parent)
    }
}

/*let component = <div id="a" cls="b" style="width:100px;height:100px;background-color:lightgreen">
        <div></div>
        <p></p>
        <div></div>
        <div></div>
    </div>*/

let component = (
    <Carousel
        data={[
            'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
            'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
            'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
            'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
        ]}
    ></Carousel>
)

component.mountTo(document.body)
/*
var component = createElement(
    Parent, 
    {
        id: "a",
        "class": "b"
    }, 
    createElement(Child, null), 
    createElement(Child, null), 
    createElement(Child, null)
);
*/

console.log(component)

//componet.setAttribute("id", "a");
