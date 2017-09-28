/**
 *
 *
 */

const errMsgCanvasInit = 'WebGLによる描画を行うためには、HTML内にcanvasを配置し、idを振って『WGLしょきか』命令に指定します。'

const PluginWeykWebGL = {
  '初期化': {
    type: 'func',
    josi: [],
    fn: function(sys) {
      if (sys._weykwebgl) return
      sys._weykwebgl = {
        vertShaderCode : "
attribute vec3 vertPos;
attribute vec4 vertColor;
uniform mat4 mvMatrix;
uniform mat4 pjMatrix;
varying lowp vec4 vColor;
void main(void) {
  gl_Position = pjMatrix * mvMatrix * vec4(vertPos, 1.0);
  vColor = vertColor;
}
"
        fragShaderCode : "
varying lowp vec4 vColor;
void main(void) {
  gl_FragColor = vColor;
}
"
        initShader: function(sys){
          const glCtx = sys._weykwebgl.__ctx
          const fragShader = glCtx.createShader(glCtx.FRAGMENT_SHADER);

          glCtx.shaderSource(fragShader, sys._weykwebgl.fragShaderCode)
          glCtx.compileShader(fragShader)

          if (!glCtx.getShaderParameter(fragShader, glCtx.COMPILE_STATUS)) {
            const errmsg = "fragment shader compile failed: "
                         + glCtx.getShaderInfoLog(fragShader)
            alert(errmsg)
            throw new Error()
          }

          const vertShader = glCtx.createShader(glCtx.VERTEX_SHADER);

          glCtx.shaderSource(vertShader, sys._weykwebgl.vertShaderCode)
          glCtx.compileShader(vertShader)

          if (!glCtx.getShaderParameter(vertShader, glCtx.COMPILE_STATUS)) {
            const errmsg = "vertex shader compile failed : "
                         + glCtx.getShaderInfoLog(vertShader)
            alert(errmsg)
            throw new Error(errmsg)
          }

          // link the compiled vertex and fragment shaders 
          const shaderProg = glCtx.createProgram();
          glCtx.attachShader(shaderProg, vertShader);
          glCtx.attachShader(shaderProg, fragShader);
          glCtx.linkProgram(shaderProg)
        }
      }
    }
  },
  'WGL初期化': { // @描画先にCanvasを指定して描画API(WebGL)の利用準備する // @WGLしょきか
    type: 'func',
    josi: [['の', 'へ']],
    fn: function (cv, sys) {
      if (typeof cv === 'string') cv = document.getElementById(cv)
      if (!cv) throw new Error(errMsgCanvasInit)
      sys._weykwebgl.__canvas = cv
      sys._weykwebgl.__ctx = cv.getContext("webgl") || cv.getContext("experimental-webgl")
      if (sys._weykwebgl.__ctx == null) {
        return 'WebGLを利用できません'
      }
      sys._weykwebgl.initShader(sys)
      sys._weykwebgl.__ctx.viewport(0, 0, cv.width, cv.height)
      return 'OK'
    }
  }
}

module.exports = PluginWeykWebGL

// scriptタグで取り込んだ時、自動で登録する
if (typeof (navigator) === 'object') {
  navigator.nako3.addPluginObject('PluginWeykWebGL', PluginWeykWebGL)
}
