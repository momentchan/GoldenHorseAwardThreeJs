import ExperienceBase from "../../three.js-gist/Common/ExperienceBase"
import Renderer from "./Renderer"
import Camera from "./Camera";
import World from "./World";
import Touch from "../../three.js-gist/Utils/Touch"
import FractalMask from '../../three.js-gist/Feature/RTWriter/FractalMask';

export default class Experience extends ExperienceBase {
    constructor(canvas, sources, sunset) {
        super(canvas, sources)

        console.log(sunset);

        this.isMagicHour = this.isMagicHour(sunset)

        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.fractalMask = new FractalMask(this)
        this.world = new World(this)
        this.touch = new Touch(this.canvas)
    }

    isMagicHour(time) {
        const now = new Date();
        const diff = now - time;
        const diffInMinutes = Math.floor(diff / 1000 / 60);

        // console.log(diffInMinutes);

        return diffInMinutes >= -30 && diffInMinutes <= 30;
    }

    isMobile() {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return regex.test(navigator.userAgent);
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
        this.fractalMask.update()
    }

    destroy() {
        super.destroy()
        this.camera.controls.dispose()
        this.renderer.instance.dispose()
    }
}