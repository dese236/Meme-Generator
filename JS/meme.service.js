
var gKeywords = { 'happy': 6, 'comic': 3  , 'movie' :4 , 'politics' :3 , 'baby' :4}
var gIsDrag = false


var gImgs = [
    { id: 1, url: ("imgs/1.jpg"), keywords: ['happy', 'comic', 'politics'] },
    { id: 2, url: ("imgs/2.jpg"), keywords: ['happy', 'animal', 'lova'] },
    { id: 3, url: ("imgs/3.jpg"), keywords: ['happy', 'animal', 'baby'] },
    { id: 4, url: ("imgs/4.jpg"), keywords: ['happy', 'animal'] },
    { id: 5, url: ("imgs/5.jpg"), keywords: ['happy', 'baby'] },
    { id: 6, url: ("imgs/6.jpg"), keywords: ['happy', 'comic'] },
    { id: 7, url: ("imgs/7.jpg"), keywords: ['happy', 'baby'] },
    { id: 8, url: ("imgs/8.jpg"), keywords: ['happy'] },
    { id: 9, url: ("imgs/9.jpg"), keywords: ['happy', 'baby'] },
    { id: 10, url: ("imgs/10.jpg"), keywords: ['happy', 'politics'] },
    { id: 11, url: ("imgs/11.jpg"), keywords: ['happy'] },
    { id: 12, url: ("imgs/12.jpg"), keywords: ['happy'] },
    { id: 13, url: ("imgs/13.jpg"), keywords: ['happy', 'movie'] },
    { id: 14, url: ("imgs/14.jpg"), keywords: ['happy', 'movie'] },
    { id: 15, url: ("imgs/15.jpg"), keywords: ['happy'] },
    { id: 16, url: ("imgs/16.jpg"), keywords: ['happy', 'comic', 'movie'] },
    { id: 17, url: ("imgs/17.jpg"), keywords: ['happy', 'politics'] },
    { id: 18, url: ("imgs/18.jpg"), keywords: ['happy', 'movie'] },
];

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 1,
    numOfLines: 2,
    LocationDiff: { x: 0, y: 0 },
}
function getNewMemeLines() {
    gMeme.lines = 
        [
        {
            shown: true,
            txt: 'Enter new text',
            size: 40,
            width: null,
            fill: 'white',
            stroke: 'black',
            font: 'impact',
            x: 100,
            y: 60
        },
        {
            shown: true,
            txt: 'I always eat Salad',
            size: 40,
            width: null,
            fill: 'white',
            stroke: 'black',
            font: 'impact',
            x: 100,
            y: null
        }
        ]
}


var gSavedMemes = [];
var gRectCoords = {
    xStart: null,
    xEnd: null,
    yStart: null,
    yEnd: null,
}

function getMeme() {
    return gMeme
}

function getImgs() {
    return gImgs
}

function getKeyWords(){
    return gKeywords
}



function getImgUrl(id) {
    var img = gImgs.find(img => img.id === id)
    return img.url
}

function createNewLine() {
    return {
        shown: true,
        txt: 'enter text',
        size: 40,
        width: null,
        fill: 'white',
        stroke: 'black',
        font: 'impact',
        x: 100,
        y: 250
    }
}
function saveImg(dataURL) {
    // gSavedMemes.push(dataURL)
    gSavedMemes.push({ id: gSavedMemes.length, dataURL, meme: JSON.parse(JSON.stringify(gMeme)) })
    saveToStorage('memes', gSavedMemes)
    // var memes = loadFromStorage('memes')
    // console.log('memes' , memes);
}
function addLine() {
    var line = createNewLine() 
    gMeme.numOfLines++
    gMeme.selectedLineIdx = gMeme.numOfLines - 1
    document.querySelector('.txt-input').value = line.txt
    gMeme.lines.push(line)
    updateRectMeasures(line.x, line.y, gMeme.numOfLines - 1, 0)
    console.log(line.coords , 'this is coods');
    // return gMeme.lines[gMeme.selectedLineIdx]
}
function removeLine() {
    gMeme.lines[gMeme.selectedLineIdx].shown = false
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.numOfLines--
    gMeme.selectedLineIdx--


    switchLine()
}

function removeImgFromStorge(id) {
    gSavedMemes.splice(id, 1)
    saveToStorage('memes', gSavedMemes)
}

function getLineLocation(height, idx) {
    if (idx === 0) return gMeme.lines[idx].y = 40
    else if (idx === 1) return gMeme.lines[idx].y = height - 40
    else if (idx === 2) return gMeme.lines[idx].y = height / 2
}

function getUpdatedLine(newTxt) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.txt = newTxt
    return line
}

function changeFontSize(diff) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.size += diff
    updateRectMeasures(line.x, line.y, gMeme.selectedLineIdx, diff)

}

function changeFontFamily(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].font = fontFamily

}

function changeStrokeColor(strokeColor) {
    gMeme.lines[gMeme.selectedLineIdx].stroke = strokeColor
}

function changeFillColor(fillColor) {
    gMeme.lines[gMeme.selectedLineIdx].fill = fillColor
}

function changeLocation(diff) {
    var line = gMeme.lines[gMeme.selectedLineIdx]
    line.y += 20 * diff
    updateRectMeasures(line.x, line.y, gMeme.selectedLineIdx, 0)
}

function uploadToCanvas(id) {
    gMeme.selectedImgId = id
}

function alignTxt(direction) {
    var line = gMeme.lines[gMeme.selectedLineIdx]
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
}



function switchLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
        gMeme.selectedLineIdx = 0
    } else {
        gMeme.selectedLineIdx = gMeme.selectedLineIdx + 1
    }
    document.querySelector('.txt-input').value = gMeme.lines[gMeme.selectedLineIdx].txt


}

function updateRectMeasures(x, y, idx, diff) {
    if (gMeme.numOfLines === 1) return
    var line = gMeme.lines[idx]
    line.width = calcLineWidth(line, diff)

    var rectHeight = gMeme.lines[idx].size + 5
    line.coords = {
        xStart: x - 5,
        yStart: y+ 5,
        xEnd: line.width +10,
        yEnd: -rectHeight
    }

}

function calcLineWidth(line, diff) {
    if (line.width) {
        line.width += (line.width / line.size) * diff
    }
    else {
        line.width = gCtx.measureText(line.txt).width
    }
    return line.width
}

function getRectCoords() {
    return gRectCoords
}


function getImgByKey(searchKey) {
    return gImgs.filter(function (img) {
        return (img.keywords.includes(searchKey))
    })
}

function getClickedLine(pos) {
    var lineIdx;
    var currLine = gMeme.lines.find(function (line, idx) {
        lineIdx = idx
        if (!line.coords) calcLineWidth(line, 0)
        return (pos.x >= line.x) && (pos.x <= line.x + line.width) &&
            (pos.y <= line.y) && (pos.y >= line.y - line.size)
    })
    console.log( { idx: lineIdx, line: currLine });
    return { idx: lineIdx, line: currLine }
}

function updateLocationDiff(pos) {
    console.log(pos , 'this is pos');
    console.log('this is line cooeds' , gMeme.lines[gMeme.selectedLineIdx].coords);
    gMeme.LocationDiff.x = gMeme.lines[gMeme.selectedLineIdx].x - pos.x
    gMeme.LocationDiff.y = gMeme.lines[gMeme.selectedLineIdx].y - pos.y
    console.log('diff is', gMeme.LocationDiff);
}

function setDrag(isDrag) {
    gIsDrag = isDrag

}
function updateLineLocation(pos) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.x = pos.x + gMeme.LocationDiff.x
    line.y = pos.y + gMeme.LocationDiff.y
    // line.y+=pos.y
}

function updateSelectedLine(idx) {
    if (idx ===gMeme.selectedLineIdx) return
    console.log('updating text box');
    console.log(gMeme.lines[idx]);
    document.querySelector('.txt-input').value = gMeme.lines[idx].txt
    gMeme.selectedLineIdx = idx
}