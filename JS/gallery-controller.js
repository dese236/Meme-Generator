
'use strict'


function renderGallary() {
    var imgs = getImgs()
    var strHtml = ''
    imgs.forEach(function (img) {
        strHtml += ` 
        <div class="card">
        <img src="./imgs/${img.id}.jpg" alt="" data-id="${img.id}" onclick="onUploadToCanvas(this)">
        </div>`;
    })
    document.querySelector('.gallary-images-cont').innerHTML = strHtml
}
 

function renderMemes() {
    var memes = loadFromStorage('memes')
    var strHtml = ''
    memes.forEach(function (currMeme) {
        strHtml += ` 
        <div class="card saved-meme">
        <img src="${currMeme.dataURL}" alt="" data-id="${currMeme.id}" onclick="onUploadToCanvas(this)">
        <button onclick="onRemoveImgFromStorge(${currMeme.id})" class="delete-meme fa fa-trash"></button>
        </div>`;
    })
    document.querySelector('.memes-container').innerHTML = strHtml
}

function onSetSearch() {
    var searchKey = document.querySelector('.search-input').value
    renderFilteredGallary(searchKey)
}
function renderFilteredGallary(searchKey){
if (searchKey === '') return renderGallary()
console.log('this is the search', searchKey);
var images = getImgByKey(searchKey.toLowerCase())

var strHtml = ''
images.forEach(function (img) {
    strHtml += ` 
    <div class="card flex-col align-center">
    <img src="imgs/${img.id}.jpg" alt="" data-id="${img.id}" onclick="onUploadToCanvas(this)">
    </div>`;
})
document.querySelector('.gallary-images-cont').innerHTML = strHtml
}


function onFilter(searchKey){
    renderFilteredGallary(searchKey)
    // renderKeys()
}

// function renderKeys(){
  
//     var elFilterKeys =document.querySelectorAll('.filter-btn')
//     elFilterKeys.forEach(function(elKey){
//         updateFontSize(elKey)
//     })
// }

// function updateFontSize(el){
//     const keys = getKeyWords()
//     keys.find(function(key){
//         if (el.classList.contains(key)) {
//         el.style.font-size = keys.key
//         return 
//         }

//     })
// }


function onToggleMenu(){
    document.body.classList.toggle('nav-open');
}




