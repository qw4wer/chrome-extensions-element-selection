var lastMouseOverEvent
var currentElement
var currentlyPickingElement = false
var pickStatue = false

function messageHandle(e) {
    const { data } = e

    if (!pickStatue) {
        if (data === 'startPicked') {
            startPickingElement()
        } else if (data === 'stopPicked') {
            stopPickingElement()
        }
    }
}

function startPickingElement() {
    pickStatue = true
    document.addEventListener('mousedown', stopEventPropagation, true)
    document.addEventListener('mouseup', stopEventPropagation, true)
    document.addEventListener('mouseenter', stopEventPropagation, true)
    document.addEventListener('mouseleave', stopEventPropagation, true)
    document.addEventListener('mouseover', mouseOver, true)
    document.addEventListener('mouseout', mouseOut, true)
    document.addEventListener('click', elementPicked, true)
}

function stopPickingElement() {
    pickStatue = false
    if (currentElement) {
        currentElement._unHighlight()
    }
    document.removeEventListener('mousedown', stopEventPropagation, true)
    document.removeEventListener('mouseup', stopEventPropagation, true)
    document.removeEventListener('mouseenter', stopEventPropagation, true)
    document.removeEventListener('mouseleave', stopEventPropagation, true)
    document.removeEventListener('mouseover', mouseOver, true)
    document.removeEventListener('mouseout', mouseOut, true)
    document.removeEventListener('click', elementPicked, true)
    document.removeEventListener('contextmenu', elementPicked, true)
}



function mouseOut(event) {
    unHighlightElement(event.target)
    // highlightElements(event.target, '#d6d84b', '#f8fa47')
}

function mouseOver(event) {
    lastMouseOverEvent = event
    var element = event.target
    if (event === lastMouseOverEvent) {
        lastMouseOverEvent = null

        if (currentElement) {
            unHighlightElement(currentElement)
        }

        if (element) {
            highlightElement(element, '#d6d84b', '#f8fa47')
        }

        currentElement = element
    }
}

function elementPicked(event) {
    if (!currentElement) {
        return
    }
    var path = getElementPath(event.target)
    postMessage(path)
    stopPickingElement()
    event.preventDefault()
    event.stopPropagation()
}

function highlightElement(element, shadowColor, backgroundColor) {
    const originalBoxShadow = element.style.getPropertyValue('box-shadow')
    const originalBoxShadowPriority =
        element.style.getPropertyPriority('box-shadow')
    const originalBackgroundColor =
        element.style.getPropertyValue('background-color')
    const originalBackgroundColorPriority =
        element.style.getPropertyPriority('background-color')

    element.style.setProperty('box-shadow', 'inset 0px 0px 5px ' + shadowColor,
        'important')
    element.style.setProperty('background-color', backgroundColor, 'important')

    element._unHighlight = () => {
        element.style.removeProperty('box-shadow')
        element.style.setProperty(
            'box-shadow',
            originalBoxShadow,
            originalBoxShadowPriority
        )

        element.style.removeProperty('background-color')
        element.style.setProperty(
            'background-color',
            originalBackgroundColor,
            originalBackgroundColorPriority
        )
    }
}

function unHighlightElement(element) {
    if (element && '_unHighlight' in element) {
        element._unHighlight()
        delete element._unHighlight
    }
}

function stopEventPropagation(event) {
    event.stopPropagation()
}

function getElementPath(element) {
    debugger
    function _getPath(element) {
        if (element.nodeName === 'BODY') {
            return
        }

        arr.push({
            nodeName: element.nodeName,
            id: element.id,
            className: element.className
        })
        _getPath(element.parentNode)
    }

    const arr = []

    _getPath(element)


    let node
    let path
    const pathArr = []
    for (let i = arr.length - 1; i >= 0; i--) {
        node = arr[i]
        path = ''
        path += node.nodeName
        if (node.id) {
            path += `[id='${node.id}']`
        } else {
            if (node.className) {
                path += `[class='${node.className}']`
            }
        }
        pathArr.push(path)
    }

    return path

}

function postMessage(msg) {
    parent.postMessage(msg, '*')
}

window.addEventListener('message', messageHandle, false)
postMessage({ type: 'done' })
