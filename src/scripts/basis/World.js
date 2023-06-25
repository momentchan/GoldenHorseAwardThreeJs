import WorldBase from "../../three.js-gist/World/WorldBase"
import BackgroundFractal from '../background/BackgroundFractal'
import FractalLayerGenerator from "../fractal/FractalLayerGenerator"
import BrushGeneratorInstanced from "../brush/instanced/BrushGeneratorInstanced"
import BrushGeneratorTiling from "../brush/tiling/BrushGeneratorTiling"
import BrushGeneratorVideo from "../brush/video/BrushGeneratorVideo"

export default class World extends WorldBase {
    constructor(experience) {
        super(experience)

        this.resources.on('ready', () => {
            this.backgroundFractal = new BackgroundFractal(this.experience)
            this.fractalLayerGenerator = new FractalLayerGenerator(this.experience)
            // this.brushGenerator = new BrushGeneratorInstanced(this.experience)
            // this.brushGenerator = new BrushGeneratorTiling(this.experience)
            this.brushGenerator = new BrushGeneratorVideo(this.experience)
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