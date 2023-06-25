import * as THREE from 'three'
import RendererBase from "../../three.js-gist/Common/RendererBase"
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { ToneMapShader } from 'three/examples/jsm/shaders/ToneMapShader';
import { BackgroundOverlayShader } from '../../shaders/postProcessing/BackgroundOverlayShader';


export default class Renderer extends RendererBase {

    setInstance() {
        super.setInstance()
        this.composer = new EffectComposer(this.instance);
        this.resources = this.experience.resources

        this.params = {
            averageLuminance: 1.0,
            maxLuminance: 2.0,
            minLuminance: 0.01,
            middleGrey: 0.6
        };

        this.debug = this.experience.debug

        this.resources.on('ready', () => {
            // Render pass
            const renderPass = new RenderPass(this.scene, this.camera.instance)
            this.composer.addPass(renderPass)

            // Custom Pass
            const overlayPass = new ShaderPass(BackgroundOverlayShader)
            overlayPass.material.uniforms.uTexture.value = this.experience.resources.items.backgroundOverlay
            this.composer.addPass(overlayPass)

            const GammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
            //  this.composer.addPass(GammaCorrectionPass)

            // const toneMapPass = new ShaderPass(ToneMapShader)
            // this.composer.addPass(toneMapPass)

            // if (this.debug.active) {
            //     this.folder = this.debug.ui.addFolder("postprocessing")
            //     this.folder.add(this.params, 'averageLuminance', 0, 2)
            //         .onChange(() => toneMapPass.uniforms.averageLuminance.value = this.params.averageLuminance)
            //         this.folder.add(this.params, 'maxLuminance', 0, 5)
            //         .onChange(() => toneMapPass.uniforms.maxLuminance.value = this.params.maxLuminance)
            //         this.folder.add(this.params, 'minLuminance', 0, 1)
            //         .onChange(() => toneMapPass.uniforms.minLuminance.value = this.params.minLuminance)
            //         this.folder.add(this.params, 'middleGrey', 0, 2)
            //         .onChange(() => toneMapPass.uniforms.middleGrey.value = this.params.middleGrey)
            // }
        })
    }

    update() {
        this.instance.toneMappingExposure = this.params.exposure;
        this.composer.render()
    }
}