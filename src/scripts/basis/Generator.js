import { MathUtils } from 'three'

export default class Generator {

    constructor(experience) {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.items = this.experience.resources.items
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.isMagicHour = this.experience.isMagicHour
        this.isMobile = this.experience.isMobile()

        this.instances = []
        this.instanceId = 0

        this.setupParameters()
    }

    setupParameters() {
        this.parameters = {}
     }

    getInstance(instanceId) { }

    addInstance() {
        // console.log(`${this.constructor.name}: add ${this.instanceId}`);

        const instance = this.getInstance(this.instanceId)
        this.instances.push(instance)
        this.instanceId++
    }

    startGenerateInstances() {
        const interval = MathUtils.randFloat(this.parameters.generateInterval.x, this.parameters.generateInterval.y) * 1000
        setTimeout(() => {
            this.addInstance()
            this.startGenerateInstances()
        }, interval);
    };

    update() {
        for (var instance of this.instances) {
            instance.update()
        }
    }

    removeInstance(id) {
        // console.log(`${this.constructor.name}: remove ${id}`);

        this.instances = this.instances.filter(item => item.id !== id)
    }
}