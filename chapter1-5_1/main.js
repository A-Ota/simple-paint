// Monaco Editorで公開メソッドを補完できるように
// 16x16のセルを作成し配列に格納されている色を描画する
let canvas = null
const PIXEL_SIZE = 16
const CANVAS_SIZE = 16
// 16x16のピクセルを格納する2次元配列
const pixelData = new Array(CANVAS_SIZE)
for (let i = 0; i < CANVAS_SIZE; ++i) {
  pixelData[i] = new Array(CANVAS_SIZE).fill('cccccc')
}
let monacoEditorModel = null
let pixelCallback = null

// クリック時にカラーピッカーで選択されている色を出力する。
function init() {
  initMonacoEditor()
  canvas = document.getElementById('main-canvas')
  canvas.addEventListener('click', event => {
    const pixelX = Math.floor(event.offsetX / PIXEL_SIZE)
    const pixelY = Math.floor(event.offsetY / PIXEL_SIZE)
    if (document.getElementById('pen-tool').checked) {
      executePenTool(pixelX, pixelY)
    } else {
      executeFillTool(pixelX, pixelY)
    }
    drawCanvas()
  })
  drawCanvas()
}

// MonacoEditor初期化
function initMonacoEditor() {
  require.config({ 
    paths: { 'vs': '../node_modules/monaco-editor/min/vs' },
    'vs/nls' : {
      availableLanguages : {
        "*" : "ja"
      }
    }
  });
  require(['vs/editor/editor.main'], function() {
    monacoEditorModel = monaco.editor.createModel(`alert('Hello World!!')`, 'javascript')
    var editor = monaco.editor.create(document.getElementById('container'), {})
    editor.updateOptions({"lineNumbers": false});
    editor.setModel(monacoEditorModel)
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`
    /**
     * @return {number} キャンバスサイズ
     */
    function getCanvasSize() {}
    /**
     * @param {number} x X座標
     * @param {number} y Y座標
     * @return {string} そのピクセル座標に設定されている色
     */
    function getPixelColor(x, y) {}
    /**
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {string} color そのピクセル座標に設定する色
     */
    function setPixelColor(x, y, color) {}
    /**
     * @param {PixelCallback} callback ピクセル設定時のフック
     */
    function setPixelCallback(callback) {}
    /**
     * @callback PixelCallback
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {string} color そのピクセル座標に設定する色
     */`)
  });
}

function setPixelData(pixelX, pixelY, color) {
  if (pixelCallback != null) {
    pixelCallback(pixelX, pixelY, color)
  } else {
    pixelData[pixelX][pixelY] = color
  }
}

// ペンツール実行
function executePenTool(pixelX, pixelY) {
  const drawColorInput = document.getElementById('draw-color')
  setPixelData(pixelX, pixelY, drawColorInput.value.replace('#', ''))
}

// 塗りつぶしツール実行
function executeFillTool(pixelX, pixelY) {
  const drawColorInput = document.getElementById('draw-color')
  var historySet = new Set()
  var srcColor = pixelData[pixelX][pixelY]
  var dstColor = drawColorInput.value.replace('#', '')
  // クリックされた座標を起点に、上下左右に再帰的に塗りつぶし
  fillRecursive(pixelX, pixelY, srcColor, dstColor, historySet)
}

function fillRecursive(pixelX, pixelY, srcColor, dstColor, historySet) {
  // 範囲外チェック
  if (pixelX < 0 || pixelX >= CANVAS_SIZE || pixelY < 0 || pixelY >= CANVAS_SIZE) {
    return
  }
  // すでに処理済み
  const cellKey = `${pixelX}_${pixelY}`
  if (historySet.has(cellKey)) {
    return
  }
  historySet.add(cellKey)
  // 塗りつぶし対象ではない
  if (pixelData[pixelX][pixelY] !== srcColor) {
    return
  }
  // 現在のピクセルに色を塗る
  setPixelData(pixelX, pixelY, dstColor)

  // 上下左右のピクセルも処理
  fillRecursive(pixelX + 1, pixelY, srcColor, dstColor, historySet)
  fillRecursive(pixelX - 1, pixelY, srcColor, dstColor, historySet)
  fillRecursive(pixelX, pixelY + 1, srcColor, dstColor, historySet)
  fillRecursive(pixelX, pixelY - 1, srcColor, dstColor, historySet)
}

// 各セルを描画
function drawCanvas() {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let y = 0; y < CANVAS_SIZE; ++y) {
    for (let x = 0; x < CANVAS_SIZE; ++x) {
      ctx.fillStyle = '#' + pixelData[x][y]
      ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)      
    }
  }
}

// プラグイン実行
function executePlugin() {
  eval(monacoEditorModel.getValue())
}

function savePlugin() {
  localStorage.setItem('plugin', monacoEditorModel.getValue())
}

function loadPlugin() {
  monacoEditorModel.setValue(localStorage.getItem('plugin'))
}

/*
setPixelCallback((x, y, color) => {
    const canvasSize = getCanvasSize()
    // 横線
    for (var ix = 0; ix < canvasSize; ++ix) {
      setPixelColor(ix, y, color)        
    }
    // 縦線
    for (var iy = 0; iy < canvasSize; ++iy) {
      setPixelColor(x, iy, color)        
    }
})
*/