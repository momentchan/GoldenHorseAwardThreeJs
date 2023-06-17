import WorldBase from "../three.js-gist/World/WorldBase"
import BackgroundFractal from './BackgroundFractal'

export default class World extends WorldBase {
    constructor(experience) {
        super(experience)

        this.resources.on('ready', () => {
            this.backgroundFractal = new BackgroundFractal(this.experience)
        })
    }

    update() {
        if (this.backgroundFractal) {
            this.backgroundFractal.update()
        }
    }
}