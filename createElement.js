export default function create(Cls, attributes, ...children) {
    let o

    if (typeof Cls === 'string') {
        o = new Wrapper(Cls)
    } else {
        o = new Cls({
            timer: {},
        })
    }

    for (let name in attributes) {
        o.setAttribute(name, attributes[name])
    }

    let visit = (children) => {
        for (let child of children) {
            if (child instanceof Array) {
                visit(child)
                continue
            }
            if (typeof child === 'string') child = new Text(child)

            o.appendChild(child)
        }
    }
    visit(children)

    return o
}

class Text {
    constructor(text) {
        this.children = []
        this.root = document.createTextNode(text)
    }
    mountTo(parent) {
        parent.appendChild(this.root)
    }
}

class Wrapper {
    constructor(type) {
        this.children = []
        this.root = document.createElement(type)
    }

    get style() {
        return this.root.style
    }

    setAttribute(name, value) {
        //attribute
        this.root.setAttribute(name, value)
    }

    addEventListener() {
        this.root.addEventListener(...arguments)
    }

    appendChild(child) {
        this.children.push(child)
    }

    mountTo(parent) {
        parent.appendChild(this.root)

        for (let child of this.children) {
            child.mountTo(this.root)
        }
    }
}
