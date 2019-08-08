


window.addEventListener('message', function (event) {
    // var connect = chrome.runtime.connect({ name: 'elementSelect' });
    if (event.source != window)
        return;

    const { type, url } = event.data

    if (type && (type === 'inertScript')) {
        chrome.runtime.sendMessage(event.data, function (response) {

        });
    }
}, false);

var div = window.document.createElement('div')
div.style.display = 'none'
div.id = 'element_selection'
window.document.body.appendChild(div)