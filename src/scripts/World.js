import WorldBase from "../three.js-gist/World/WorldBase"
import BackgroundFractal from './BackgroundFractal'
import FractalLayerGenerator from "./FractalLayerGenerator"

export default class World extends WorldBase {
    constructor(experience) {
        super(experience)

        this.resources.on('ready', () => {
            this.backgroundFractal = new BackgroundFractal(this.experience)
            this.fractalLayerGenerator = new FractalLayerGenerator(this.experience)
        })
    }

    update() {
        if (this.backgroundFractal) {
            this.backgroundFractal.update()
        }

        if(this.fractalLayerGenerator){
            this.fractalLayerGenerator.update()
        }
    }
}