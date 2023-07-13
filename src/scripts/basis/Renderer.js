import RendererBase from "../../three.js-gist/Common/RendererBase"
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { backgroundOverlayShader } from '../../shaders/BackgroundOverlayShader';

export default class Renderer extends RendererBase {

    setInstance() {
        super.setInstance()
        this.composer = new EffectComposer(this.instance)
        this.resources = this.experience.resources

        this.debug = this.experience.debug
        this.resources.on('ready', () => {
            // Render pass
            const renderPass = new RenderPass(this.scene, this.camera.instance)
            this.composer.addPass(renderPass)

            // Overlay Pass
            const overlayPass = new ShaderPass(backgroundOverlayShader)
            overlayPass.material.uniforms.uTexture.value = this.experience.resources.items.backgroundOverlay
            this.composer.addPass(overlayPass)

            // FXAA
            const fxaaPass = new ShaderPass(FXAAShader);
            fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.sizes.width * this.sizes.pixelRatio);
            fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.sizes.height * this.sizes.pixelRatio);
            this.composer.addPass(fxaaPass);
        })
    }

    update() {
        this.composer.render()
    }
}