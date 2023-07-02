import * as THREE from 'three'

export default class TouchDetector {
    constructor(experience, generator) {
        this.experience = experience
        this.generator = generator

        this.canvas = this.experience.canvas

        this.startX = 0
        this.startY = 0

        this.touchX = 0
        this.touchY = 0

        this.isSwiped = false

        this.canvas.addEventListener('touchstart', e => this.onTouchStart(e))
        this.canvas.addEventListener('touchmove', e => this.onTouchMove(e))
        this.canvas.addEventListener('touchend', e => this.onTouchEnd(e))
        this.canvas.addEventListener('touchcancel', e => this.onTouchEnd(e))

    }

    onTouchStart(event) {
        this.isSwiped = true
        this.getTouchPosition(event.touches[0])

        this.startX = this.touchX
        this.startY = this.touchY
    }

    onTouchMove(event) {
        event.preventDefault()

        if (this.isSwiped) {
            this.getTouchPosition(event.touches[0])
            const diffX = this.touchX - this.startX
            const diffY = this.touchY - this.startY


        }
    }

    onTouchEnd(event) {
        this.isSwiped = false

        this.generator.addInteractiveBrush(new THREE.Vector2(this.startX, this.startY), new THREE.Vector2(this.touchX, this.touchY))
    }

    getTouchPosition(touch) {
        const rect = this.canvas.getBoundingClientRect()

        const screenX = touch.clientX - rect.left
        const screenY = touch.clientY - rect.top

        const ndcX = (screenX / rect.width) * 2 - 1
        const ndcY = -(screenY / rect.height) * 2 + 1

        this.touchX = ndcX
        this.touchY = ndcY

        // (-1, 1)
        // console.log(`${this.touchX} ${this.touchY}`);
    }
}