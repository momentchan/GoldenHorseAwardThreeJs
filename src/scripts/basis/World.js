import WorldBase from "../../three.js-gist/World/WorldBase"
import BackgroundFractal from '../background/BackgroundFractal'
import FractalLayerGenerator from "../fractal/FractalLayerGenerator"
import LineGenerator from "../line/LineGenerator"
import BrushGenerator from "../brush/BrushGenerator"
import LightGenerator from "../light/LightGenerator"
import LogoSVG from "../logo/LogoSVG"
import LogoPng from "../logo/LogoPng"

export default class World extends WorldBase {
    constructor(experience) {
        super(experience)
        this.debug = this.experience.debug
        this.keyInput = this.experience.keyInput

        this.parameters = {
            backgroundFractal: true,
            fractalLayer: true,
            brush: true,
            light: true,
            line: true,
            logo: true
        }

        this.resources.on('ready', () => {
            this.backgroundFractal = new BackgroundFractal(this.experience)
            this.fractalLayerGenerator = new FractalLayerGenerator(this.experience)
            this.brushGenerator = new BrushGenerator(this.experience)
            this.lightGenerator = new LightGenerator(this.experience)
            this.lineInstancedGenerator = new LineGenerator(this.experience)

            if (this.experience.isMobile())
                this.logo = new LogoPng(this.experience)
            else {
                this.logo = new LogoSVG(this.experience)
            }
        })

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(this.constructor.name)

            this.debugFolder.add(this.parameters, 'backgroundFractal')
                .onChange(value => this.backgroundFractal.show(value))

            this.debugFolder.add(this.parameters, 'fractalLayer')
                .onChange(value => this.fractalLayerGenerator.show(value))

            this.debugFolder.add(this.parameters, 'brush')
                .onChange(value => this.brushGenerator.show(value))

            this.debugFolder.add(this.parameters, 'light')
                .onChange(value => this.lightGenerator.show(value))

            this.debugFolder.add(this.parameters, 'line')
                .onChange(value => this.lineInstancedGenerator.show(value))

            this.debugFolder.add(this.parameters, 'logo')
                .onChange(value => this.logo.show(value))
        }

        // keyInput
        this.keyInput.onKeyDownEvent('1', () => { this.fractalLayerGenerator.showOrHide() })
        this.keyInput.onKeyDownEvent('2', () => { this.brushGenerator.showOrHide() })
        this.keyInput.onKeyDownEvent('3', () => { this.lightGenerator.showOrHide() })
        this.keyInput.onKeyDownEvent('4', () => { this.lineInstancedGenerator.showOrHide() })
        this.keyInput.onKeyDownEvent('5', () => { this.logo.showOrHide() })
        this.keyInput.onKeyDownEvent('6', () => { this.backgroundFractal.showOrHide() })
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

        if (this.logo) {
            this.logo.update()
        }
    }
}