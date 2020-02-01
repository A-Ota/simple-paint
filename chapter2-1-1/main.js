// Canvasクリック時のイベントを設定しておく
let canvas = null
function init() {
  canvas = document.getElementById('main-canvas')
  canvas.addEventListener('click', event => {
    console.log(`座標(${event.clientX}, ${event.clientY})がクリックされた。`)
  })
}