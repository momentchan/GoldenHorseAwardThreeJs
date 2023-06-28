import { MathUtils } from 'three'


export default class Instance {
    constructor(generater, id) {
        this.id = id

        this.generater = generater
        this.scene = this.generater.scene
        this.camera = this.generater.camera
        this.items = this.generater.items
        this.parameters = this.generater.parameters
        this.time = this.generater.time

        this.t = 0

        this.lifetime = MathUtils.randFloat(this.parameters.lifetime.x, this.parameters.lifetime.y) * 1000

        this.setupMesh()
    }

    setupMesh() { }

    updateMaterials() { }

    update() {
        this.t += this.time.delta
        this.age = this.t / this.lifetime
    }

    destroy() {
        this.generater.removeInstance(this.id)

        if (this.mesh)
            this.scene.remove(this.mesh);
        if (this.mesh.geometry)
            this.mesh.geometry.dispose();
        if (this.mesh.material)
            this.mesh.material.dispose();

        delete this
    }
}