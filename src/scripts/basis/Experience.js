import ExperienceBase from "../../three.js-gist/Common/ExperienceBase"
import Renderer from "./Renderer"
import Camera from "./Camera";
import World from "./World";
import Touch from "../../three.js-gist/Utils/Touch"
import Audio from '../../three.js-gist/Utils/Audio';
import FractalMask from '../../three.js-gist/Feature/RTWriter/FractalMask';

export default class Experience extends ExperienceBase {
    constructor(canvas, sources) {
        super(canvas, sources)

        this.isNight = this.getMode()

        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.fractalMask = new FractalMask(this)
        this.world = new World(this)

        this.audio = new Audio()
        this.touch = new Touch(this.canvas)
    }

    getMode() {
        var now = new Date();
        var currentHour = now.getHours();
        return currentHour >= 17
    }

    resize() {
        super.resize()
        this.camera.resize()
        this.renderer.resize()
        this.fractalMask.resize()
    }

    update() {
        super.update()
        this.world.update()
        this.camera.update()
        this.renderer.update()
        this.audio.update()
        this.fractalMask.update()
    }

    destroy() {
        super.destroy()
        this.camera.controls.dispose()
        this.renderer.instance.dispose()
    }
}