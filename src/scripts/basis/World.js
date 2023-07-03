import WorldBase from "../../three.js-gist/World/WorldBase"
import BackgroundFractal from '../background/BackgroundFractal'
import FractalLayerGenerator from "../fractal/FractalLayerGenerator"
import LineInstancedGenerator from "../line/instanced/LineInstancedGenerator"
import BrushStillGenerator from "../brush/still/BrushStillGenerator"


export default class World extends WorldBase {
    constructor(experience) {
        super(experience)

        this.resources.on('ready', () => {
            this.backgroundFractal = new BackgroundFractal(this.experience)
            this.fractalLayerGenerator = new FractalLayerGenerator(this.experience)
            this.brushGenerator = new BrushStillGenerator(this.experience)
            this.lineInstancedGenerator = new LineInstancedGenerator(this.experience)
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

        if(this.lineGenerator){
            this.lineGenerator.update()
        }

        if(this.lineInstancedGenerator){
            this.lineInstancedGenerator.update()
        }

        if(this.audioInput){
            this.audioInput.update()
        }
    }
}