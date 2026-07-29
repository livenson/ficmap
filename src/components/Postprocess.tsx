import {
  EffectComposer,
  Bloom,
  BrightnessContrast,
  HueSaturation,
  Vignette,
} from '@react-three/postprocessing'

/**
 * A light color-grade pass that unifies the whole scene: soft bloom on the
 * brightest highlights (snow, water glints, lava, lightning), a touch more
 * contrast, a gentle desaturation for harmony, and a subtle vignette. Kept
 * deliberately restrained so it reads as polish, not a filter.
 */
export function Postprocess() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.45}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      <BrightnessContrast brightness={0} contrast={0.06} />
      <HueSaturation saturation={-0.07} hue={0} />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  )
}
