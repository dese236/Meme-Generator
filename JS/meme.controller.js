'use strict'


var gCanvas;
var gCtx;
// var gIsSave = false;


function onInit() {
    gCanvas = document.querySelector('.my-canvas')
    gCtx = gCanvas.getContext('2d')
    renderGallary()
    addEventListeners()
    // drawCanvas()
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
    // gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    // gCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    console.log('onDown');
    const pos = getEvPos(ev)
    var clickedLine = getClickedLine(pos)
    if (!clickedLine) return
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

function renderGallary() {
    var imgs = getImgs()
    var strHtml = ''
    imgs.forEach(function (img) {
        strHtml += ` 
        <div class="card">
        <img src="./IMAGES/${img.id}.jpg" alt="" data-id="${img.id}" onclick="uploadToCanvas(this)">
        </div>`;
    })
    document.querySelector('.gallary-images-cont').innerHTML = strHtml
}


function drawCanvas() {
    var meme = getMeme()
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    var img = new Image()
    img.src = getImgUrl(meme.selectedImgId);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        meme.lines.forEach(function (line, idx) {
            if (meme.lines[idx].shown) { drawText(line.txt, idx) }
        })
    }
}

function onGetTxt() {
    console.log('im here');
    const txt = document.querySelector('[name="txt-input"]').value
    const meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    meme.lines[meme.selectedLineIdx].txt = txt
    calcLineWidth(line)
    updateRectMeasures(line.x, line.y, meme.selectedLineIdx, 0)
    drawCanvas()
}

function onCleanTxt() {
    document.querySelector('[name="txt-input"]').value = ''
}
function drawText(txt, idx) {
    var meme = getMeme()
    var line = meme.lines[idx]
    if (line.y === null) {
        line.y = gCanvas.height - 60
    }
    if (meme.selectedLineIdx === idx) {
        updateRectMeasures(line.x, line.y, idx, 0)
        drawRect(line.coords)
    }

    gCtx.lineWidth = 2
    gCtx.strokeStyle = line.stroke
    gCtx.fillStyle = line.fill
    gCtx.font = line.size + 'px ' + line.font
    gCtx.fillText(txt, line.x, line.y)
    gCtx.strokeText(txt, line.x, line.y)

}

function drawRect(coords) {
    gCtx.beginPath()
    gCtx.rect(coords.xStart, coords.yStart, coords.xEnd, coords.yEnd)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
}


function onChangeFontSize(event) {
    var diff = +event.dataset.diff
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    line.size += diff
    updateRectMeasures(line.x, line.y, meme.selectedLineIdx, diff)
    meme.lines[meme.selectedLineIdx].size += diff
    drawCanvas()
}

function onChangeFontFamily(event) {
    const meme = getMeme()
    const fontFamily = event.value
    const line = meme.lines[meme.selectedLineIdx]
    line.font = fontFamily
    drawCanvas()
}

function onChangeStrokeColor(event) {
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    line.stroke = event.value

    drawCanvas()
}

function onChangeFillColor(event) {
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    line.fill = event.value
    drawCanvas()
}

function onChangeLocation(event) {
    const meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    var diff = 20 * +event.dataset.diff
    meme.lines[meme.selectedLineIdx].y += diff
    updateRectMeasures(line.x, line.y, meme.selectedLineIdx, 0)
    drawCanvas()
}

function onAddLine() {
    var line = addLine()
    var meme = getMeme()
    updateRectMeasures(line.x, line.y, meme.numOfLines - 1, 0)
    drawCanvas()
    // meme.selectedLineIdx++

}

function onRemoveLine() {
    removeLine()
    drawCanvas()
}

function onSwitchLine() {
    switchLine()
    drawCanvas()
}

function uploadToCanvas(elImg) {
    var meme = getMeme()
    // meme.selectedImgId = elImg.id
    meme.selectedImgId = +elImg.dataset.id
    switchPage('canvas')

    // drawCanvas()
}

function onChangePage(event) {
    // event.classList.add('active')
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
            drawCanvas()
            break
        case 'memes':
            renderMemes()
            break
    }
}

function onAlignTxt(event) {
    var direction = event.dataset.align
    var meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]

    // var currLineWidth = calcLineWidth(line)
    switch (direction) {
        case 'left':
            line.x = 40
            break;
        case 'right':
            line.x = gCanvas.width - line.width - 40
            break;
        case 'center':
            line.x = (gCanvas.width - line.width) / 2
            break;
        default:
            break;
    }
    drawCanvas()
}




function onSave() {
    // gIsSave = true
    // drawCanvas()
    // drawRect({
    //     xStart : gCanvas.height+10,
    //     xEnd : gCanvas.height+10,
    //     yStart : gCanvas.height+10,
    //     yEnd : gCanvas.height+10
    //  })
    let imgURL = gCanvas.toDataURL();
    gIsSave = false
    // saveImg(imgURL);
    // localStorage.setItem('img', gCanvas.toDataURL())
    saveImg(imgURL)
}


function renderMemes() {
    var memes = loadFromStorage('memes')
    var strHtml = ''
    memes.forEach(function (currMeme) {
        strHtml += ` 
        <div class="card saved-meme">
        <img src="${currMeme.dataURL}" alt="" data-id="${currMeme.id}" onclick="uploadToCanvas(this)">
        <button onclick="onRemoveImgFromStorge(${currMeme.id})" class="delete-meme fa fa-trash"></button>
        </div>`;
    })
    document.querySelector('.memes-container').innerHTML = strHtml
}

function onRemoveImgFromStorge(id) {
    removeImgFromStorge(id)
    renderMemes()
}

function onSetSearch() {
    var searchKey = document.querySelector('.search-input').value
    if (searchKey === '') return renderGallary()
    console.log('this is the search', searchKey);
    var images = getImgByKey(searchKey.toLowerCase())

    var strHtml = ''
    images.forEach(function (img) {
        strHtml += ` 
        <div class="card flex-col align-center">
        <img src="IMAGES/${img.id}.jpg" alt="" data-id="${img.id}" onclick="uploadToCanvas(this)">
        </div>`;
    })
    document.querySelector('.gallary-images-cont').innerHTML = strHtml

}

function onDownload(event){
    var imgContent = gCanvas.toDataURL('image/jpeg')
    event.href = imgContent
}


function onToggleMenu(){
    document.body.classList.toggle('nav-open');
    // document.querySelector('.nav-btn').classList.toggle('.hidden')
    // document.querySelector('.close-nav-btn').classList.toggle('.hidden')
}