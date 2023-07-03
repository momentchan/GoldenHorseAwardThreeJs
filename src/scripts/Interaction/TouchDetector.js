import * as THREE from 'three'
import TrailRenderer from '../../TrailRenderer'

export default class TouchDetector {
    constructor(experience, generator) {
        this.experience = experience
        this.generator = generator

        this.canvas = this.experience.canvas

        this.touchX = 0
        this.touchY = 0

        this.minimunTouches = 10

        this.isSwiped = false

        this.canvas.addEventListener('touchstart', e => this.onTouchStart(e))
        this.canvas.addEventListener('touchmove', e => this.onTouchMove(e))
        this.canvas.addEventListener('touchend', e => this.onTouchEnd(e))
        this.canvas.addEventListener('touchcancel', e => this.onTouchEnd(e))

        this.touches = []
    }
    

    onTouchStart(event) {
        this.isSwiped = true
        this.getTouchPosition(event.touches[0])

        this.touches.length = 0
    }

    onTouchMove(event) {
        event.preventDefault()

        if (this.isSwiped) {
            this.getTouchPosition(event.touches[0])
            this.touches.push(new THREE.Vector2(this.touchX, this.touchY))
        }
    }

    onTouchEnd(event) {
        this.isSwiped = false

        if (this.touches.length > this.minimunTouches)
            this.generator.addInteractiveBrush(this.touches)
        // console.log(this.touches);
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