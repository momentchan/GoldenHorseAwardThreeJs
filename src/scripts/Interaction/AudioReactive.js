import * as THREE from 'three'

export default class AudioReactive {
    constructor() {
        this.connectAudioAPI()
        this.audioTexture = new THREE.DataTexture(this.audioData, this.analyser.fftSize / 2, 1, THREE.RedFormat)
    }

    getUserMedia(dictionary, callback) {
        try {
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

            navigator.getUserMedia(dictionary, callback, (e) => {
                console.dir(e)
            })
        } catch (e) {
            alert('getUserMedia threw exception :' + e)
        }
    }

    connectAudioAPI() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.context.createAnalyser()
            this.analyser.fftSize = 2048
            this.audioData = new Uint8Array(this.analyser.frequencyBinCount)

            navigator.mediaDevices
                .getUserMedia({ audio: true, video: false })
                .then((stream) => {
                    this.mediaSource = this.context.createMediaStreamSource(stream)
                    this.mediaSource.connect(this.analyser)
                    this.update()

                    this.context.resume()
                })
                .catch((err) => {
                    alert(err)
                })
        } catch (e) {
            alert(e)
        }
    }

    getTexture() {
        return this.audioTexture
    }

    update() {
        // update FTT
        this.analyser.getByteFrequencyData(this.audioData)
        this.audioTexture.needsUpdate = true
    }
}