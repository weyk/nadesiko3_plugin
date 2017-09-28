/**
 *
 *
 */

const PluginWeykThree = {
  '初期化': {
    type: 'func',
    josi: [],
    fn: function(sys) {
      if (sys._weykthreejs) return
      sys._weykthreejs = {
        _scene : null,
        _camera: null,
        _renderer: null,
        _scene_list : [],
        _camera_list : []
      }
    }
  },
  // @ThreeJS操作
  'TJSシーン作成': { // @ThreeJSのシーンを作成し、シーンオブジェクトを返す // @TJSしーんさくせい
    type: 'func',
    josi: [[]],
    fn: function (sys) {
      if (!sys._weykthreejs) return null
      if (typeof THREE === 'undefined') {
        throw new Error('three.jsが読み込まれていません')
      }
      const scene = new THREE.Scene()
      if (scene === null) {
        throw new Error('シーンを作成できません')
      }
      sys._weykthreejs._scene = scene
      sys._weykthreejs._scene_list.push(scene)
      return scene
    }
  },
  'TJS透視投影カメラ作成': { // @透視投影カメラを作成しそのオブジェクトを返す // @TJSとうしとうえいかめらさくせい
    type: 'func',
    josi: [['の']],
    fn: function (param, sys) {
      if (!sys._weykthreejs) return null
      if (typeof THREE === 'undefined') {
        throw new Error('three.jsが読み込まれていません')
      }
      if (sys._weykthreejs._camera !== null) {
        throw new Error('カメラは既に作成済みです。カメラは１つしか作成できません(制限事項)')
      }
      if (!Array.isArray(param) || param.length !== 4) {
        throw new Error('カメラの仕様を配列で指定してください([視野角, アスペクト比, 最近距離, 最遠距離])')
      }
      const camera = new THREE.PerspectiveCamera(param[0], param[1], param[2], param[3])
      if (camera === null) {
        throw new Error('透視投影カメラを作成できません')
      }
      sys._weykthreejs._camera = camera
      sys._weykthreejs._camera_list.push(camera)
      return camera
    }
  },
  'TJSカメラ位置設定': { // @カメラを指定した座標に配置する // @TJSかめらいちせってい
    type: 'func',
    josi: [['を'],['に']],
    fn: function (camera, xyz, sys) {
      if (!sys._weykthreejs) return null
      if (typeof THREE === 'undefined') {
        throw new Error('three.jsが読み込まれていません')
      }
      if (sys._weykthreejs._camera === null) {
        throw new Error('カメラが作成されていません。先にカメラを作成してください')
      }
      if (!Array.isArray(xyz) || xyz.length !== 3) {
        throw new Error(`カメラの座標を配列で指定してください([x, y, z]:${typeof xyz}:${xyz.length})`)
      }
      camera.position.set(xyz[0], xyz[1], xyz[2])
      return null
    }
  },
  'TJSカメラ上方設定': { // @カメラの上として扱う方向を指定する // @TJSかめらじょうほうせってい
    type: 'func',
    josi: [['を'],['に']],
    fn: function (camera, vec, sys) {
      if (!sys._weykthreejs) return null
      if (typeof THREE === 'undefined') {
        throw new Error('three.jsが読み込まれていません')
      }
      if (sys._weykthreejs._camera === null) {
        throw new Error('カメラが作成されていません。先にカメラを作成してください')
      }
      let dir = []
      if (Array.isArray(vec) && vec.length === 3) {
        dir = vec
      } else
      if (typeof vec == "string" || typeof vec == "String") {
        if (vec == "+X")      dir = [  1.0,  0.0,  0.0]
        else if (vec == "-X") dir = [ -1.0,  0.0,  0.0]
        else if (vec == "+Y") dir = [  0.0,  1.0,  0.0]
        else if (vec == "-Y") dir = [  0.0, -1.0,  0.0]
        else if (vec == "+Z") dir = [  0.0,  0.0,  1.0]
        else if (vec == "-Z") dir = [  0.0,  0.0, -1.0]
        else {
          throw new Error('カメラの上方向を表す文字列が正しくありません。文字列もしくは単位ベクトルの配列で指定してください("+","-"と"X","Y","Z"の組み合わせ or [x, y, z])')
        }
      } else {
        throw new Error('カメラの上方向にする方向を文字列もしくは単位ベクトルの配列で指定してください("+","-"と"X","Y","Z"の組み合わせ or [x, y, z])')
      }
      camera.up.x = dir[0]
      camera.up.y = dir[1]
      camera.up.z = dir[2]
      return null
    }
  },
  'TJS視点設定': { // @カメラを向ける先の座標を指定する // @TJSしてんせってい
    type: 'func',
    josi: [['を'],['に','へ']],
    fn: function (camera, at, sys) {
      if (!sys._weykthreejs) return null
      if (typeof THREE === 'undefined') {
        throw new Error('three.jsが読み込まれていません')
      }
      if (sys._weykthreejs._camera === null) {
        throw new Error('カメラが作成されていません。先にカメラを作成してください')
      }
      if (!Array.isArray(at) || at.length !== 3) {
        throw new Error('カメラを向ける先の座標を配列で指定してください([x,y,z])')
      }
      camera.lookAt({ x: at[0], y: at[1], z: at[2]})
      return null
    }
  },
  'TJS描画準備': { // @指定したシーンの描画の準備し、描画オブジェクトを返す // @TJSびょうがじゅんび
    type: 'func',
    josi: [['に','へ']],
    fn: function (to, sys) {
      if (!sys._weykthreejs) return null
      if (typeof THREE === 'undefined') {
        throw new Error('three.jsが読み込まれていません')
      }
      if (typeof to === 'string') to = document.getElementById(to)
      if (!to) throw new Error('描画準備に指定した描画先に誤りがあります')
      const renderer = new THREE.WebGLRenderer()
      to.appendChild(renderer.domElement)
      sys._weykthreejs._renderer = renderer
      return renderer
    }
  },
  'TJS描画': { // @指定した描画オブジェクトに対してシーン・カメラで描画する // @TJSびょうが
    type: 'func',
    josi: [['に'],['を'],['で']],
    fn: function (renderer, scene, camera, sys) {
      if (!sys._weykthreejs) return null
      if (typeof THREE === 'undefined') {
        throw new Error('three.jsが読み込まれていません')
      }
      renderer.render( scene, camera )
      return null
    }
  }
}

module.exports = PluginWeykThree

// scriptタグで取り込んだ時、自動で登録する
if (typeof (navigator) === 'object') {
  navigator.nako3.addPluginObject('PluginWeykThree', PluginWeykThree)
}
