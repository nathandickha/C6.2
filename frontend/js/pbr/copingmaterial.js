// js/pbr/copingMaterial.js
import * as THREE from "https://esm.sh/three@0.158.0";

let cachedMaterial = null;

export async function loadCopingMaterial(scene) {
  if (cachedMaterial) return cachedMaterial;

  const texLoader = new THREE.TextureLoader();

    /* -------------------------------------------------------
     ENVIRONMENT
     Environment is configured in scene.js (PMREM + background).
  ------------------------------------------------------- */


  /* -------------------------------------------------------
     LOAD PBR COPING TEXTURES
  ------------------------------------------------------- */
  const baseColor    = texLoader.load(new URL("../../textures/Coping/TilesTravertine001_COL_2K.webp", import.meta.url).href);
  const normalMap    = texLoader.load(new URL("../../textures/Coping/TilesTravertine001_NRM_2K.webp", import.meta.url).href);
  const aoMap        = texLoader.load(new URL("../../textures/Coping/TilesTravertine001_AO_2K.webp", import.meta.url).href);
  const roughnessMap = texLoader.load(new URL("../../textures/Coping/TilesTravertine001_GLOSS_2K.webp", import.meta.url).href);
  const heightMap    = texLoader.load(new URL("../../textures/Coping/TilesTravertine001_DISP_2K.webp", import.meta.url).href);

  // Proper wrapping for tiled surfaces
  [
    baseColor,
    normalMap,
    aoMap,
    roughnessMap,
    heightMap
  ].forEach((t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
  });

  /* -------------------------------------------------------
     MATERIAL SETTINGS
  ------------------------------------------------------- */
  cachedMaterial = new THREE.MeshStandardMaterial({
    map: baseColor,
    normalMap,
    aoMap,
    roughnessMap,
    displacementMap: heightMap,

    displacementScale: 0.005,   // small relief
    roughness: 0.6,
    metalness: 0.0,

    envMapIntensity: 1.2,

    color: 0xffffff
  });

  cachedMaterial.userData.isCoping = true;

  return cachedMaterial;
}
