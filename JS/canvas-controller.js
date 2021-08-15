'use strict'

var gCanvas;
var gCtx;

function drawCanvas() {
    var meme = getMeme()
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    var img = new Image()
    img.src = getImgUrl(meme.selectedImgId);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        meme.lines.forEach(function (line, idx) {
            if (meme.lines[idx].shown) { drawTxt(line, idx) }
        })
    }
}

function drawTxt(line, idx) {
    if (line.y === null) {
        line.y = gCanvas.height - 60
    }
    if (getMeme().selectedLineIdx === idx) {
        updateRectMeasures(line.x, line.y, idx, 0)
        drawRect(line.coords)
    }
    gCtx.lineWidth = 2
    gCtx.strokeStyle = line.stroke
    gCtx.fillStyle = line.fill
    gCtx.font = line.size + 'px ' + line.font
    gCtx.fillText(line.txt, line.x, line.y)
    gCtx.strokeText(line.txt, line.x, line.y)
}

function drawRect(coords) {
    gCtx.beginPath()
    gCtx.rect(coords.xStart, coords.yStart, coords.xEnd, coords.yEnd)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
}

function onUploadToCanvas(elImg) {
    uploadToCanvas(+elImg.dataset.id)
    switchPage('canvas')
}    

function onUpdateTxt() {
    console.log('im here');
    const txt = document.querySelector('[name="txt-input"]').value
    var line = getUpdatedLine(txt)
    calcLineWidth(line)
    updateRectMeasures(line.x, line.y, getMeme().selectedLineIdx, 0)
    drawCanvas()
}

function onCleanTxt() {
    document.querySelector('[name="txt-input"]').value = ''
}

function onClickCanvas(event){
    const pos = {x: event.offsetX,
    y: event.offsetY}
    const line = getClickedLine(pos)
    if(!line)return
    document.querySelector('.txt-input').focus()
    
}

function onChangeFontSize(event) {
    changeFontSize(+event.dataset.diff)
    drawCanvas()
}    

function onChangeFontFamily(event) {
    changeFontFamily(event.value)
    drawCanvas()
}    

function onChangeStrokeColor(event) {
    changeStrokeColor(event.value)
    drawCanvas()
}   

function onChangeFillColor(event) {
changeFillColor(event.value)
drawCanvas()
}    

function onChangeLocation(event) {
    changeLocation(event.dataset.diff)
    drawCanvas()
}    

function onAddLine() {
    addLine()
    drawCanvas()
    document.querySelector('.txt-input').focus()
}    

function onRemoveLine() {
    removeLine()
    drawCanvas()
}    

function onSwitchLine() {
    // onCleanTxt()
    switchLine()
    document.querySelector('.txt-input').focus()    
    drawCanvas()
}    

function onAlignTxt(event) {
    alignTxt(event.dataset.align)
    drawCanvas()
}

function onSave() {
    let imgURL = gCanvas.toDataURL();
    saveImg(imgURL)
    renderModal('save')
}

function onRemoveImgFromStorge(id) {
    removeImgFromStorge(id)
    renderMemes()
}

function onDownload(event){
    console.log('imdownloading');
    console.log(gCanvas);
    var imgContent = gCanvas.toDataURL('image/jpeg')
    event.href = imgContent
    renderModal('download')
}

function renderModal(msg){
    var elModal = document.querySelector('.modal')
    elModal.innerText = msg +' Meme'
    elModal.classList.toggle('hidden')
    setTimeout(function(){
        elModal.classList.toggle('hidden')
    },1500)
}

