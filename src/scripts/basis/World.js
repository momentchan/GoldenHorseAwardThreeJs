import WorldBase from "../../three.js-gist/World/WorldBase"
import BackgroundFractal from '../background/BackgroundFractal'
import FractalLayerGenerator from "../fractal/FractalLayerGenerator"
import LineGenerator from "../line/LineGenerator"
import BrushGenerator from "../brush/BrushGenerator"
import LightGenerator from "../light/LightGenerator"
import Logo from "../logo/logo"

export default class World extends WorldBase {
    constructor(experience) {
        super(experience)

        this.resources.on('ready', () => {
            this.backgroundFractal = new BackgroundFractal(this.experience)
            this.fractalLayerGenerator = new FractalLayerGenerator(this.experience)
            this.brushGenerator = new BrushGenerator(this.experience)
            this.lightGenerator = new LightGenerator(this.experience)
            this.lineInstancedGenerator = new LineGenerator(this.experience)

            if (!this.experience.isMobile())
                this.logo = new Logo(this.experience)
        })
    }

    update() {
        if (this.backgroundFractal) {
            this.backgroundFractal.update()
        }

        if (this.fractalLayerGenerator) {
            this.fractalLayerGenerator.update()
        }

        if (this.brushGenerator) {
            this.brushGenerator.update()
        }

        if (this.lineInstancedGenerator) {
            this.lineInstancedGenerator.update()
        }

        if (this.lightGenerator) {
            this.lightGenerator.update()
        }
    }
}