import { MathUtils } from 'three'


export default class Instance {
    constructor(generator, id) {
        this.id = id

        this.generator = generator
        this.experience = this.generator.experience
        this.scene = this.generator.scene
        this.camera = this.generator.camera
        this.items = this.generator.items
        this.parameters = this.generator.parameters
        this.time = this.generator.time
        this.sizes = this.generator.sizes

        this.t = 0

        this.lifetime = MathUtils.randFloat(this.parameters.lifetime.x, this.parameters.lifetime.y) * 1000
    }

    setupMesh() { }

    updateMaterials() { }

    update() {
        this.t += this.time.delta
        this.age = this.t / this.lifetime
    }

    destroy() {
        this.generator.removeInstance(this.id)

        if (this.mesh)
            this.scene.remove(this.mesh);
        if (this.mesh.geometry)
            this.mesh.geometry.dispose();
        if (this.mesh.material)
            this.mesh.material.dispose();

        delete this
    }
}