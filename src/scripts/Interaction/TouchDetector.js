export default class TouchDetector {
    constructor(experience) {
        this.experience = experience
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
            
            console.log(`${diffX} ${diffY}`);
        }
    }

    onTouchEnd(event) {
        this.isSwiped = false
    }

    getTouchPosition(touch) {
        const rect = this.canvas.getBoundingClientRect()

        const screenX = touch.clientX - rect.left
        const screenY = touch.clientY - rect.top

        const ndcX = (screenX / this.canvas.width) * 2
        const ndcY = -(screenY / this.canvas.height) * 2 + 1

        this.touchX = ndcX
        this.touchY = ndcY

        // console.log(ndcX)
        // console.log(ndcY)

    }
}