function executeScript(tabId, frameId) {
    console.log(tabId, frameId);
    chrome.tabs.executeScript(tabId, {
        frameId: frameId,      // <== LOOK HERE
        file: "element.selection.js"
    });
}

// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.webNavigation.getAllFrames({ tabId: tab.id }, function (fs) {

//         chrome.tabs.executeScript(tab.tabId, {
//             frameId: fs[0].frameId,      // <== LOOK HERE
//             file: "element.selection.js"
//         });


//     })
// });


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const { type, url } = request
    let tabId, frameId
    if (type === 'inertScript') {
        tabId = sender.tab.id

        chrome.webNavigation.getAllFrames({ tabId: tabId }, function (fs) {

            for (let i in fs) {
                if (fs[i].url === url) {
                    frameId = fs[i].frameId
                }
            }

            if (tabId != 0 && frameId != 0) {
                executeScript(tabId, frameId)
            }


        })
    }

    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});


// chrome.runtime.onConnect.addListener(function (connect) {
//     if (connect.name === 'elementSelect') {
//         tabId = connect.sender.tab

//         connect.onMessage.addListener(function (msg) {
//             const { type, url } = msg
//             if (type === '')
//                 // sendAjax(msg.req, function (res) {
//                 //     connect.postMessage({
//                 //         id: msg.id,
//                 //         res: res
//                 //     })
//                 // }, function (err) {
//                 //     connect.postMessage({
//                 //         id: msg.id,
//                 //         res: err
//                 //     })
//                 // })
//                 console.log(msg)
//         })
//     }
// });