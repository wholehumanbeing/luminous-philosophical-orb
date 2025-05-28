
// Easing function for smooth transitions
export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Calculate sphere positions for helix transformation
export const calculateHelixPosition = (
  originalRadius: number,
  sphereIndex: number,
  totalSpheres: number,
  progress: number,
  maxHeight: number
): THREE.Vector3 => {
  if (progress === 0) {
    return new THREE.Vector3(0, 0, 0);
  }

  const easedProgress = easeInOutCubic(progress);
  const heightStep = maxHeight / totalSpheres;
  const helixRadius = 8;
  
  // Calculate helix position
  const t = sphereIndex / totalSpheres;
  const angle = t * Math.PI * 4;
  const y = (sphereIndex - totalSpheres / 2) * heightStep;
  
  const helixPosition = new THREE.Vector3(
    Math.cos(angle) * helixRadius,
    y,
    Math.sin(angle) * helixRadius
  );
  
  // Interpolate between original position and helix position
  const originalPosition = new THREE.Vector3(0, 0, 0);
  return originalPosition.lerp(helixPosition, easedProgress);
};
