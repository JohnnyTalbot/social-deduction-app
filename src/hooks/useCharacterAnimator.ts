import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { Player } from '@/types/game';

/**
 * Hook to manage character animations
 * @param target The object with animations (usually a skinned mesh or scene)
 * @param animations The array of AnimationClips from GLTF
 */
export function useCharacterAnimator(
  target: THREE.Object3D | null,
  animations: THREE.AnimationClip[] = [],
  playerId?: string,
  updatePlayerById?: (playerId: string, partial: Partial<Player>) => void
) {
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});

  useEffect(() => {
    if (!target || !animations.length) return;

    const mixer = new THREE.AnimationMixer(target);
    mixerRef.current = mixer;

    // Preload actions and store them
    for (const clip of animations) {
      const action = mixer.clipAction(clip);
      actionsRef.current[clip.name] = action;
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(target);
    };
  }, [target, animations]);

  // Advance animation each frame
  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });

  /**
   * Plays an animation by name
   * @param name The name of the animation
   * @param options Optional settings
   */
  const playAnimation = (
    name: string,
    options?: {
      loopOnce?: boolean;
      fadeDuration?: number;
      timeScale?: number;
    }
  ) => {
    const mixer = mixerRef.current;
    if (!mixer) return;

    const action = actionsRef.current[name];
    if (!action) {
      console.warn(`Animation '${name}' not found`);
      return;
    }

    // Skip if already playing this action
    if (currentActionRef.current === action && action.isRunning()) return;

    // Fade out previous action
    if (currentActionRef.current && currentActionRef.current !== action) {
      currentActionRef.current.fadeOut(options?.fadeDuration ?? 0.2);
    }

    if (options?.loopOnce) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;

      // Remove previous listener to avoid stacking
      mixer.removeEventListener('finished', onFinished);
      mixer.addEventListener('finished', onFinished);
    } else {
      mixer.removeEventListener('finished', onFinished);
    }

    function onFinished(e: THREE.AnimationMixerEventMap['finished']) {
      if (e.action === action) {
        playAnimation('idle');
      }

      if (!updatePlayerById || !playerId) return;

      updatePlayerById(playerId, {
        isAnimating: false,
        currentAnimation: ""
      })
    }

    action.reset();
    action.setEffectiveTimeScale(options?.timeScale ?? 1);
    action.fadeIn(options?.fadeDuration ?? 0.2);
    action.play();

    currentActionRef.current = action;
  };


  return {
    playAnimation,
    mixer: mixerRef,
    currentAction: currentActionRef,
  };
}
