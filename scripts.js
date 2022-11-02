setTimeout(() => {
  if (document.getElementById("showIfAppExit")) {
    document.getElementById("showIfAppExit").style.display = 'block';
  }
}, 1000);
setTimeout(() => {
  if (document.getElementById("showIfAppExit")) {
    document.getElementById("showIfAppExit").style.display = 'block';
  }
}, 2000);
setTimeout(() => {
  if (document.getElementById("showIfAppExit")) {
    document.getElementById("showIfAppExit").style.display = 'block';
  }
}, 3000);
setTimeout(() => {
  if (document.getElementById("showIfAppExit")) {
    document.getElementById("showIfAppExit").style.display = 'block';
  }
}, 5000);
setTimeout(() => {
  if (document.getElementById("showIfAppExit")) {
    document.getElementById("showIfAppExit").style.display = 'block';
  }
}, 10000);
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
  if (document.getElementById("showIfAppExit")) {
    document.getElementById("showIfAppExit").style.display = 'block';
  }
});
window.onload = function () {
  console.log("window.onload");
  if (document.getElementById("showIfAppExit")) {
    document.getElementById("showIfAppExit").style.display = 'block';
  }
};
if (window && window.ondomcontentready) {
  console.log("window.ondomcontentready");
  window.ondomcontentready = function () {
    if (document.getElementById("showIfAppExit")) {
      document.getElementById("showIfAppExit").style.display = 'block';
    }
  };
}
function shappify_addJs(src) {
  var fileref = document.createElement('script');
  fileref.setAttribute("type", "text/javascript");
  fileref.setAttribute("src", src);
  document.getElementsByTagName("head")[0].appendChild(fileref);
}
// Finger Print script tag definition
function newFingerprint2(src) {
  var newfingerprint = document.createElement('script');
  newfingerprint.setAttribute("type", "text/javascript");
  newfingerprint.setAttribute("src", src);
  document.getElementsByTagName("head")[0].appendChild(newfingerprint);
}