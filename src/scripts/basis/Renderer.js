import RendererBase from "../../three.js-gist/Common/RendererBase"
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { screenOverlayShader } from '../../shaders/ScreenOverlayShader';

export default class Renderer extends RendererBase {

    setInstance() {
        super.setInstance()
        this.composer = new EffectComposer(this.instance)
        this.resources = this.experience.resources
        this.keyInput = this.experience.keyInput

        this.debug = this.experience.debug
        this.resources.on('ready', () => {
            // Render pass
            const renderPass = new RenderPass(this.scene, this.camera.instance)
            this.composer.addPass(renderPass)

            // Overlay Pass
            const overlayPass = new ShaderPass(screenOverlayShader)
            overlayPass.material.uniforms.uOverlay.value = this.experience.isMobile() ? 0.3 : 0.5
            overlayPass.material.uniforms.uTexture.value = this.experience.isMagicHour ?
                this.experience.resources.items.overlayRedTex :
                this.experience.resources.items.overlayBlueTex

            this.keyInput.onKeyDownEvent('7', () => {
                if (overlayPass.material.uniforms.uOverlay.value != 0)
                    overlayPass.material.uniforms.uOverlay.value = 0
                else
                    overlayPass.material.uniforms.uOverlay.value = this.experience.isMobile() ? 0.3 : 0.5
            })

            this.composer.addPass(overlayPass)

            // FXAA
            const fxaaPass = new ShaderPass(FXAAShader);
            fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.sizes.width * this.sizes.pixelRatio);
            fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.sizes.height * this.sizes.pixelRatio);
            this.composer.addPass(fxaaPass);
        })

    }

    resize() {
        super.resize()
        const fxaaPass = this.composer.passes[2];
        fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.sizes.width * this.sizes.pixelRatio);
        fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.sizes.height * this.sizes.pixelRatio);
    }

    update() {
        this.composer.render()
    }
}