import * as THREE from 'three'
import Line from "./Line"
import { randomRange } from '../../three.js-gist/Utils/Helper'

export default class LineGenerator {

    constructor(experience) {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.items = this.experience.resources.items

        this.distanceToCamera = 1
        this.lifetime = new THREE.Vector2(5, 10)
        this.generateInterval = new THREE.Vector2(5, 15)

        this.lines = []
        this.lineId = 0

        this.textures = [
            this.experience.resources.items.lineTex1,
            this.experience.resources.items.lineTex2,
            this.experience.resources.items.lineTex3,
        ]

        // this.setupDebug()
        this.generateLine()
        this.startGenerateLines()
    }


    setupDebug() {

    }

    getRandomTex() {
        var randomIndex = Math.floor(Math.random() * this.textures.length);
        console.log(randomIndex);
        return this.textures[randomIndex]
    }


    startGenerateLines() {
        const interval = randomRange(this.generateInterval) * 1000
        setTimeout(() => {
            this.generateLine()
            this.startGenerateLines()
        }, interval);
    };

    generateLine() {
        const line = new Line(this, this.lineId)
        this.lines.push(line)
        this.lineId++
    }

    update() {
        for (var line of this.lines) {
            line.update()
        }
    }

    removeLineFromList(id) {
        // console.log(id);
        this.lines = this.lines.filter(item => item.id !== id)
    }
}