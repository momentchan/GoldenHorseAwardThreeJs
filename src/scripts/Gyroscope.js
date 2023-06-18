export default class Gyroscoe {
    constructor() {
        this.debugText = null;

        this.debugText = document.createElement('div');
        this.debugText.id = 'debug-text';
        document.body.appendChild(this.debugText);

        this.alpha = 0
        this.beta = 0
        this.gamma = 0
        

        if (window.DeviceMotionEvent &&
            typeof window.DeviceMotionEvent.requestPermission === "function"
        ) {
            window.DeviceMotionEvent.requestPermission();
        }

        if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
            // Request permission to access motion sensors (required for newer versions of iOS)
            window.DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        // Permission granted, add event listener for motion data
                        window.addEventListener("deviceorientation", this.handleOrientation.bind(this));
                    } else {
                        // Permission denied, display error message
                        this.debugText.textContent = 'Motion sensor permission denied';
                    }
                })
                .catch(error => {
                    // Error occurred while requesting permission, display error message
                    console.error('Motion sensor permission error:', error);
                    this.debugText.textContent = 'Motion sensor permission error';
                });
        } else {
            window.addEventListener("deviceorientation", this.handleOrientation.bind(this));
        }
    }

    handleOrientation(event) {
        // Check if the event contains gyroscope data
        if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
            // Gyroscope data is available
            this.alpha = event.alpha; // Z-axis rotation (in degrees)
            this.beta = event.beta; // X-axis rotation (in degrees)
            this.gamma = event.gamma; // Y-axis rotation (in degrees)

            // Update the debug text with gyroscope values
            var text = 'Gyro:\n' +
                'Alpha: ' + this.alpha.toFixed(2) + '\n' +
                'Beta: ' + this.beta.toFixed(2) + '\n' +
                'Gamma: ' + this.gamma.toFixed(2);
            this.debugText.textContent = text;
        } else {
            // Gyroscope data is not available
            this.debugText.textContent = 'Gyroscope data not available';
        }
    }
}