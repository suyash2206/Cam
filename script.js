let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let captureBtn = document.getElementById('captureBtn');
let previewImage = document.getElementById('capturedImage');
let downloadLink = document.getElementById('downloadLink');
let ageResult = document.getElementById('ageResult');
let genderResult = document.getElementById('genderResult');

// Load the pre-trained age and gender model
let ageGenderModel;

async function loadModel() {
    // You need a model URL here that has been converted for TensorFlow.js format
    ageGenderModel = await tf.loadGraphModel('path/to/model.json');
}

// Start the webcam
async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing the webcam: ', err);
        alert('Please allow access to your webcam.');
    }
}

// Capture the image from the video stream
captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageDataURL = canvas.toDataURL('image/png');
    previewImage.src = imageDataURL;

    // Make the download link available
    downloadLink.href = imageDataURL;
    downloadLink.style.display = 'inline';
    downloadLink.textContent = 'Download Image';

    // Convert the captured image to tensor and run the prediction
    runAgeGenderPrediction();
});

// Run the age and gender prediction
async function runAgeGenderPrediction() {
    const imageTensor = tf.browser.fromPixels(canvas).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    
    // Pass the image tensor to the model for predictions
    const predictions = await ageGenderModel.predict(imageTensor).data();
    
    // Assume the model returns an array with age and gender
    const [predictedAge, predictedGender] = predictions;

    // Update the UI with the results
    ageResult.textContent = `Age: ${Math.round(predictedAge)}`;
    genderResult.textContent = `Gender: ${predictedGender > 0.5 ? 'Male' : 'Female'}`;
}

// Start the webcam and load the model
startVideo();
loadModel();
