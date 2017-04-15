const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video: false, audio:false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
    })
        .catch(err => {
            console.error(`OH NO!!!!`, err)
        });
}

function paintToCanvas() {
    var width = video.videoWidth;
    var height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        var pixels = ctx.getImageData(0, 0, width, height);
        // mess with the pixels
        // pixels = redEffect(pixels);
        pixels = greenScreen(pixels);
        // pixels = rgbSplit(pixels);
        // put the pixels back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    // play the sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of canvas
    var data = canvas.toDataURL('image/jpeg');
    var link = document.createElement('a');
    link.href= data;
    link.setAttribute('download', 'me');
    link.innerHTML = `<img src="${data}" alt="me" />`
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(var i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // Red
        pixels.data[i + 1] = pixels.data[i + 1] - 50;  // Green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(var i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // Red
        pixels.data[i + 100] = pixels.data[i + 1];  // Green
        pixels.data[i - 150] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function greenScreen(pixels) {
  var levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);