const parser = require('./parser')

module.exports = function (source) {
    let template = parser
        .parseHTML(source)
        .children.find((it) => it.tagName === 'template')
        .children.filter((it) => it.type === 'element')[0]

    let visit = (node) => {
        if (node.type === 'text') return JSON.stringify(node.content)
        let attrs = {}
        for (let attr of node.attributes) {
            attrs[attr.name] = attr.value
        }
        let children = node.children.map((item) => visit(item))
        return `createElement(${JSON.stringify(node.tagName)},${JSON.stringify(attrs)},${children})`
    }
    return `
import createElement from './createElement'

   export default class Carousel {
        setAttribute(name, value) {
            this[name] = value
        }
        mountTo(parent) {
            this.render().mountTo(parent)
        }
        render(){
            return ${visit(template)}
        }
    }
    `
}
