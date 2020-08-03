const css = require('css')
module.exports = function (source, map) {
    const stylesheet = css.parse(source)
    let name = this.resourcePath.match(/([^\\/]+)\.css$/)[1]
    for (let rule of stylesheet.stylesheet.rules) {
        rule.selectors = rule.selectors.map((selector) =>
            selector.startsWith(`.${name}`) ? selector : `.${name} ${selector}`
        )
    }

    return `
    let style = document.createElement('style')
    style.textContent = ${JSON.stringify(css.stringify(stylesheet))}
    document.head.appendChild(style)
    `
}
