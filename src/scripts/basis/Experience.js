import * as THREE from 'three'
import ExperienceBase from "../../three.js-gist/Common/ExperienceBase"
import Renderer from "./Renderer"
import Camera from "./Camera";
import World from "./World";
import Gyroscoe from './Gyroscope';
import BufferCamera from './BufferCamera';

export default class Experience extends ExperienceBase {
    constructor(canvas, sources) {
        super(canvas, sources)

        this.bufferScene = new THREE.Scene()
        this.bufferCamera = new BufferCamera(this)

        this.gyro = new Gyroscoe()
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.world = new World(this)
    }
    resize() {
        super.resize()
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        super.update()
        this.world.update()
        this.camera.update()
        this.renderer.update()
    }

    destroy() {
        super.destroy()
        this.camera.controls.dispose()
        this.renderer.instance.dispose()
    }
}