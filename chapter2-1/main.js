// クリック時にカラーピッカーで選択されている色を出力する。
let canvas = null
function init() {
  const drawColorInput = document.getElementById('draw-color')
  canvas = document.getElementById('main-canvas')
  canvas.addEventListener('click', event => {
    console.log(`描画色は${drawColorInput.value}です。`)
  })
}