import * as THREE from 'three'
import { MathUtils } from 'three'

export default class Logo {

    constructor(experience) {
        this.experience = experience
        this.camera = this.experience.camera
        this.items = this.experience.resources.items
        this.isMagicHour = this.experience.isMagicHour
        this.cameraGroup = this.camera.cameraGroup
        this.sizes = this.experience.sizes

        this.distance = 2
        const { w, h } = this.camera.getWorldSizeAtDistance(this.distance)

        this.s = [0.2, 0.45]
        this.y = [0.3, -0.28]

        this.logoUp = this.createLogo(this.items.logoUpTex, this.s[0] * h, this.y[0] * h)
        this.logoBottom = this.createLogo(this.items.logoBottomTex, this.s[1] * h, this.y[1] * h)
    }


    createLogo(tex, size, y) {
        const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

        this.material = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            alphaTest: 0.5
        });

        const mesh = new THREE.Mesh(geometry, this.material)
        mesh.rotateY(MathUtils.degToRad(180))
        mesh.scale.set(size, size, 1)
        this.cameraGroup.add(mesh)
        mesh.position.set(0, y, this.camera.getWorldPos().z + this.distance)
        return mesh
    }
}