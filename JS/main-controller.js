
'use strict'



function onInit() {
    gCanvas = document.querySelector('.my-canvas')
    gCtx = gCanvas.getContext('2d')
    renderGallary()
    addEventListeners()
    getNewMemeLines()
}

function addEventListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    console.log('onDown');
    const pos = getEvPos(ev)
    var clickedLine = getClickedLine(pos)
    if (!clickedLine.line) return
    console.log('trying to focus');
    updateSelectedLine(clickedLine.idx)
    updateLocationDiff(pos)
    setDrag(true)
    drawCanvas()
    document.body.style.cursor = 'grabbing'

}

function onMove(ev) {
    if (gIsDrag) {
        console.log('im on the move');
        const pos = getEvPos(ev)
        updateLineLocation(pos)
        drawCanvas()
    }
}

function onUp() {
   setDrag(false)
   document.body.style.cursor = 'grab'
}

function getEvPos(ev) {
    return {
        x: ev.offsetX,
        y: ev.offsetY
    }
}

function onChangePage(event) {
    switchPage(event.dataset.page)
}    

function switchPage(page) {
    var elSections = document.querySelectorAll('section')
    elSections.forEach(function (sec) {
        if (sec.dataset.page === page) {
            sec.classList.remove('hidden')
            renderPage(page)
        } else {
            sec.classList.add('hidden')
        }    
    })    
}   

function renderPage(page) {
    switch (page) {
        case 'gallary':
            renderGallary()
            break
        case 'canvas':
            getNewMemeLines()
            drawCanvas()
            break
        case 'memes':
            renderMemes()
            break
    }        
} 