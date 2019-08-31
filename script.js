const video = document.getElementById('video');
const textBox = document.getElementById('textBox');

const MODEL_URL = '/models'

loadModels();

async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    startVideo();
}



function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
        video.srcObject = stream;
    }).catch(err => console.log(err));


}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const videoSize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, videoSize);

    setInterval(async () => {
        const detectionsWithLandmarks = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
        const resizedResults = faceapi.resizeResults(detectionsWithLandmarks, videoSize);
        if (detectionsWithLandmarks.length) {
            console.log(detectionsWithLandmarks[0].expressions)
            if (detectionsWithLandmarks[0].expressions.happy > 0.86) {
                document.getElementById('textbox').value += '😀';
            }
            if (detectionsWithLandmarks[0].expressions.sad > 0.86) {
                document.getElementById('textbox').value += '😥';
            }
            if (detectionsWithLandmarks[0].expressions.angry > 0.86) {
                document.getElementById('textbox').value += '😡';
            }
            if (detectionsWithLandmarks[0].expressions.surprised > 0.86) {
                document.getElementById('textbox').value += '😮';
            }
            if (detectionsWithLandmarks[0].expressions.disgusted > 0.86) {
                document.getElementById('textbox').value += '🤮';
            }
            if (detectionsWithLandmarks[0].expressions.fearful > 0.86) {
                document.getElementById('textbox').value += '😱';
            }
        }
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedResults)
        faceapi.draw.drawFaceLandmarks(canvas, resizedResults)
        faceapi.draw.drawFaceExpressions(canvas, resizedResults)

    }, 100);

})

