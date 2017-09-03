/**
 *
 *
 */

const PluginWeykDateTime = {
  '初期化': {
    type: 'func',
    josi: [],
    fn: function(sys) {
      if (sys._weykdatetime) return
      sys._weykdatetime = {
        s2dttm: function (s, nm) {
          let dt = null
          if (s instanceof Date) {
            dt = s
          } else
          if (s instanceof String || typeof s == "string") {
            const ymd = s.match(/^([0-9]{4})\/([0-9]{2})\/([0-9]{2})/)
            const hms = s.match(/([0-9]{2}):([0-9]{2}):([0-9]{2})(\.([0-9]+))?$/)
            if (ymd && hms) {
              const y = parseInt(ymd[1],10)
              const m = parseInt(ymd[2],10)-1
              const d = parseInt(ymd[3],10)
              const h = parseInt(hms[1],10)
              const mi = parseInt(hms[2],10)
              const se = parseInt(hms[3],10)
              const f = (hms[5]===undefined)?0:parseInt(hms[5],10)
              dt = new Date(y,m,d,h,mi,se,f)
            } else
            if (ymd) {
              const y = parseInt(ymd[1],10)
              const m = parseInt(ymd[2],10)-1
              const d = parseInt(ymd[3],10)
              dt = new Date(y,m,d)
            } else
            if (hms) {
              const now = new Date()
              const y = now.getFullYear()
              const m = now.getMonth()
              const d = now.getDate()
              const h = parseInt(hms[1],10)
              const mi = parseInt(hms[2],10)
              const se = parseInt(hms[3],10)
              const f = (hms[5]===undefined)?0:parseInt(hms[5],10)
              dt = new Date(y,m,d,h,mi,se,f)
            } else {
              throw Error(`${nm}の書式がおかしいです(${s})`)
            }
          } else {
            const type = typeof s
            throw Error(`${nm}に指定された型がおかしいです(${type})`)
          }
          return dt
        },
        s2dt: function (s, nm) {
          let dt = null
          if (s instanceof Date) {
            dt = s
          } else
          if (s instanceof String || typeof s == "string") {
            const ymd = s.match(/^([0-9]{4})\/([0-9]{2})\/([0-9]{2})$/)
            if (ymd) {
              const y = parseInt(ymd[1],10)
              const m = parseInt(ymd[2],10)-1
              const d = parseInt(ymd[3],10)
              dt = new Date(y,m,d)
            } else {
              throw Error(`${nm}の書式がおかしいです(${s})`)
            }
          } else {
            const type = typeof s
            throw Error(`${nm}に指定された型がおかしいです(${type})`)
          }
          return dt
        },
        dt2s: function (dt) {
          return ""+dt.getFullYear()+"/"+((dt.getMonth()<9)?"0":"")+(dt.getMonth()+1)+"/"+((dt.getDate()<10)?"0":"")+dt.getDate()
        },
        tm2s: function (dt) {
          return ""+((dt.getHours()<10)?"0":"")+dt.getHours()+":"+((dt.getMinutes()<10)?"0":"")+dt.getMinutes()+":"+((dt.getSeconds()<10)?"0":"")+dt.getSeconds()
        },
        dttm2s: function (dt) {
          return dt2s(dt)+" "+tm2s(dt)
        }
      }
      return
    }
  },
  '日付加算': { // @Date型もしくは「YYYY/MM/DD」形式の日付文字列に指定した日付を加算(+Y/M/D)または減算(-Y/M/D)しDate型もしくは日付文字列を返す // @ひづけかさん
    type: 'func',
    josi: [['に'],['を']],
    fn: function (s1, a,  sys) {
      // 補正値の引数をdy,dm,ddの数値に変換する
      // 符号は結果変数にそのままおいとく
      const delta = a.match(/^([-+]?)([0-9]+)\/([0-9]+)\/([0-9]+)$/)
      if (!delta) {
        throw Error(`加算値の書式がおかしいです(加算値:${a})`)
      }
      if (delta[1] != '' && delta[1] != '+' && delta[1] != '-') {
        throw Error(`加算値の符号がおかしいです(符号:${delta[1]})`)
      }
      const dy = parseInt(delta[2],10)
      const dm = parseInt(delta[3],10)
      const dd = parseInt(delta[4],10)
      // 日付引数の日付をy,m,dの数値に変換する
      const dt = sys._weykdatetime.s2dt(s1,'日付')
      let y = dt.getFullYear()
      let m = dt.getMonth()
      const d = dt.getDate()
      // 年と月に実際の加減算を行う
      if (delta[1] == '-') {
        y = y - dy
        m = m - dm
      } else {
        y = y + dy + Math.floor((m + dm) / 12)
        m = (m + dm) % 12
      }
      // 更新年、更新月、旧日でDate型を生成し、日の差を加算/減算する
      const r = new Date(y,m,d)
      if (delta[1] == '-') {
        r.setTime(r.getTime() - dd * 24 * 60 * 60 * 1000)
      } else {
        r.setTime(r.getTime() + dd * 24 * 60 * 60 * 1000)
      }
      // 元の型と同じ型で結果を返す
      if (s1 instanceof Date) {
        return r
      }
      return sys._weykdatetime.dt2s(r)
    }
  },
  '時間加算': { // @「HH:MM:SS」形式の時刻文字列に指定した時刻を加算(+H/M/S)または減算(-H/M/S)し時刻文字列を返す // @じかんかさん
    type: 'func',
    josi: [['に'],['を']],
    fn: function (s1, a,  sys) {
      // 補正値の引数をdh,dm,dsの数値に変換する
      // 符号は結果変数にそのままおいとく
      const delta = a.match(/^([-+]?)([0-9]+):([0-9]+):([0-9]+)$/)
      if (!delta) {
        throw Error(`加算値の書式がおかしいです(加算値:${a})`)
      }
      if (delta[1] != '' && delta[1] != '+' && delta[1] != '-') {
        throw Error(`加算値の符号がおかしいです(符号:${delta[1]})`)
      }
      const dh = parseInt(delta[2],10)
      const dm = parseInt(delta[3],10)
      const ds = parseInt(delta[4],10)
      const df = ( ( dh * 60 ) + dm ) * 60 + ds
      // 時刻引数の時分秒をh,m,sの数値に変換する
      let h = 0
      let m = 0
      let s = 0
      const hms = s1.match(/([0-9]{2}):([0-9]{2}):([0-9]{2})$/)
      if (hms) {
        h = parseInt(hms[1],10)
        m = parseInt(hms[2],10)
        s = parseInt(hms[3],10)
      } else {
        throw Error(`時間の書式がおかしいです(時間:${tm})`)
      }
      // 時分秒を通算秒に変換する
      let r = ( ( h * 60 ) + m ) * 60 + s
      // 通算秒に実際の加減算を行う
      r = r + df * ((delta[1] == '-') ? -1 : 1)
      // 負数となった場合は正数となるよう補正する
      if (r < 0) {
        r = r + Math.ceil(-r / (24 * 60 * 60)) * 24 * 60 * 60
      }
      // 通算秒を時分秒に分離する
      s = r % 60
      m = Math.floor(r / 60) % 60
      h = Math.floor(r / 60 / 60) % 24
      return ""+((h<10)?"0":"")+h+":"+((m<10)?"0":"")+m+":"+((s<10)?"0":"")+s
    }
  },
  '日数差': { // @Date型もしくは「YYYY/MM/DD」形式の日付文字列を２つ指定しその日数を返す // @にっすうさ
    type: 'func',
    josi: [['と','から'],['の','までの']],
    fn: function (s1, s2,  sys) {
      const dt1 = sys._weykdatetime.s2dt(s1,"日付1")
      const dt2 = sys._weykdatetime.s2dt(s2,"日付2")
      const dif = (dt1.getTime() - dt2.getTime()) / 24 / 60 / 60 / 1000
      if (dif > 0) {
        return Math.floor(dif)
      } else {
        return Math.ceil(dif)
      }
    }
  },
  '時間差': { // @Date型もしくは日時文字列を２つ指定しその時間単位での差を返す // @じかんさ
    type: 'func',
    josi: [['と','から'],['の','までの']],
    fn: function (s1, s2,  sys) {
      const dt1 = sys._weykdatetime.s2dttm(s1,"引数1")
      const dt2 = sys._weykdatetime.s2dttm(s2,"引数2")
      const dif = (dt2.getTime() - dt1.getTime()) / 60 / 60 / 1000
      if (dif > 0) {
        return Math.floor(dif)
      } else {
        return Math.ceil(dif)
      }
    }
  },
  '分差': { // @Date型もしくは日時文字列を２つ指定しその分単位での差を返す // @ふんさ
    type: 'func',
    josi: [['と','から'],['の','までの']],
    fn: function (s1, s2,  sys) {
      const dt1 = sys._weykdatetime.s2dttm(s1,"引数1")
      const dt2 = sys._weykdatetime.s2dttm(s2,"引数2")
      const dif = (dt2.getTime() - dt1.getTime()) / 60 / 1000
      if (dif > 0) {
        return Math.floor(dif)
      } else {
        return Math.ceil(dif)
      }
    }
  },
  '秒差': { // @Date型もしくは日時文字列を２つ指定しその秒単位での差を返す // @びょうさ
    type: 'func',
    josi: [['と','から'],['の','までの']],
    fn: function (s1, s2,  sys) {
      const dt1 = sys._weykdatetime.s2dttm(s1,"引数1")
      const dt2 = sys._weykdatetime.s2dttm(s2,"引数2")
      const dif = (dt2.getTime() - dt1.getTime()) / 1000
      if (dif > 0) {
        return Math.floor(dif)
      } else {
        return Math.ceil(dif)
      }
    }
  }
}

module.exports = PluginWeykDateTime

// scriptタグで取り込んだ時、自動で登録する
if (typeof (navigator) === 'object') {
  navigator.nako3.addPluginObject('PluginWeykDateTime', PluginWeykDateTime)
}
