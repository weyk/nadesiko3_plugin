module.exports = {
  ui: {
      port: 9000
  },
  files: [
      "demo/**",
      "release/*.js"
  ],
  server: {
      "routes": {
        "/demo/js/three/examples": "node_modules/three/examples",
        "/demo/js/three": "node_modules/three/build",
        "/demo/js/polyfill": "node_modules/babel-polyfill/dist",
        "/demo": "demo",
        "/release/wnako3.js": "../nadesiko3/release/wnako3.js",
        "/release/plugin_turtle.js": "../nadesiko3/release/plugin_turtle.js",
        "/release/editor.js": "../nadesiko3/release/editor.js",
        "/release/terminal.js": "../nadesiko3/release/terminal.js",
        "/release/command.json": "../nadesiko3/release/command.json",
        "/release/plugin_weykdatetime.js": "../nadesiko3-weykdatetime/src/plugin_weykdatetime.js",
        "/release/weykdatetime.json": "../nadesiko3-weykdatetime/release/weykdatetime.json",
        "/release": "release"
      },
      baseDir: ".",
      index: "index.html",
      middleware: function(req, res, next){
          var timestamp = "[" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "] ";
           console.log(timestamp + req.method + " " + req.originalUrl + " - " +  req.connection.remoteAddress + " - " + req.headers['user-agent']);
           next();
      }
  },
  startPath: "/demo/index_weyk.html"
}
