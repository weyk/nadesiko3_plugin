(function(){
  document.addEventListener("DOMContentLoaded", function(event) {
    console.log('ContentLoaded')
    // スクリプトタグの中身を得る
    let counter = 0
    let hasDelay = false
    const scripts = document.querySelectorAll('script')
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i]
      const type = script.type
      if (type === 'nako' || type === 'なでしこ' || type === 'application/x-nako3' || type === 'application/x-nadesiko3' || type === 'application/x-なでしこ') {
        counter = counter + 1
        if (script.getAttribute("delay") !== null) {
          hasDelay = true
        }else{
          setTimeout(function(){
            const text = script.text
            navigator.nako3.run(text)
          },1)
        }
      }
    }
    if (hasDelay) {
      window.addEventListener("load", function(event) {
        console.log('WindowLoaded')
        let counter = 0
        const scripts = document.querySelectorAll('script')
        for (let i = 0; i < scripts.length; i++) {
          const script = scripts[i]
          const type = script.type
          if (type === 'nako' || type === 'なでしこ' || type === 'application/x-nako3' || type === 'application/x-nadesiko3' || type === 'application/x-なでしこ') {
            counter = counter + 1
            if (typeof script.getAttribute("delay") !== "undefined") {
              setTimeout(function(){
                const text = script.text
                navigator.nako3.run(script.text)
              },1)
            }
          }
        }
        console.log('counter='+counter)
      })
    }
    console.log('counter='+counter)
  })
})()
