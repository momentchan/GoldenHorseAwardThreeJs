import WorldBase from "../three.js-gist/World/WorldBase"
import BackgroundFractal from './BackgroundFractal'
import FractalLayerGenerator from "./FractalLayerGenerator"
import BrushGenerator from "./BrushGenerator"
import BrushGeneratorNew from "./BrushGeneratorNew"

export default class World extends WorldBase {
    constructor(experience) {
        super(experience)

        this.resources.on('ready', () => {
            this.backgroundFractal = new BackgroundFractal(this.experience)
            // this.fractalLayerGenerator = new FractalLayerGenerator(this.experience)
            // this.brushGenerator = new BrushGenerator(this.experience)
            this.brushGenerator = new BrushGeneratorNew(this.experience)
        })
    }

    update() {
        if (this.backgroundFractal) {
            this.backgroundFractal.update()
        }

        if(this.fractalLayerGenerator){
            this.fractalLayerGenerator.update()
        }

        if(this.brushGenerator){
            this.brushGenerator.update()
        }
    }
}