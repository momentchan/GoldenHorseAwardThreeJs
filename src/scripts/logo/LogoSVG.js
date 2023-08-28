import * as THREE from 'three'
import vertexShader from '../../three.js-gist/Shader/ScreenVertex.js'
import { fragmentShader } from '../../shaders/LogoShader.js'
import { MathUtils } from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

export default class Logo {

    constructor(experience) {

        this.experience = experience
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.items = this.experience.resources.items
        this.isMagicHour = this.experience.isMagicHour
        this.cameraGroup = this.camera.cameraGroup
        this.sizes = this.experience.sizes

        this.distance = 0.5
        const { w, h } = this.camera.getWorldSizeAtDistance(this.distance)

        this.s = [0.00017, 0.00012]
        this.y = [0.4, -0.04]

        this.logoTop = this.createSVG(this.items.logoTopSVG, 0.018, this.s[0] * h, this.y[0] * h)
        this.logoBottom = this.createSVG(this.items.logoBottomSVG, 0.0395, this.s[1] * h, this.y[1] * h)
    }

    createSVG(data, offset, s, y) {
        const paths = data.paths;
        const group = new THREE.Group();

        for (let i = 0; i < paths.length; i++) {

            const path = paths[i];

            const material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
            });

            const shapes = SVGLoader.createShapes(path);

            for (let j = 0; j < shapes.length; j++) {

                const shape = shapes[j];
                const geometry = new THREE.ShapeGeometry(shape);
                geometry.applyMatrix4(new THREE.Matrix4().makeScale(-1, -1, 1))
                const mesh = new THREE.Mesh(geometry, material);
                group.add(mesh);
            }
        }
        this.cameraGroup.add(group);
        group.position.set(offset, y, this.camera.getWorldPos().z + this.distance)
        group.scale.multiplyScalar(s)

        const box = new THREE.Box3().setFromObject(group);
        const size = box.getSize(new THREE.Vector3());
        const yOffset = size.y / 2;
        const xOffset = size.x / 2;

        group.children.forEach((item) => {
            item.position.x = xOffset;
            item.position.y = yOffset;
        });

        return group
    }

    update() {
    }

    show(visible) {
        this.logoTop.visible = visible
        this.logoBottom.visible = visible
    }
}