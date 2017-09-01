



export default function Atom (options) {


    const defaults = {
        selector: 'body',
        scope: document
    }

    this.options = Object.assign({}, defaults, options)
}




Atom.prototype.subscribe = function (eventType, parent) {
    const self = this
    const scope = self.options.scope
    const selector = self.options.selector

    const nodes = scope.querySelectorAll(selector)

    nodes.forEach( (node) => {
        node.addEventListener( eventType, (event) => {
            event.stopPropagation()
            parent.notify(self, event.type)
        }, true)
    })
}
