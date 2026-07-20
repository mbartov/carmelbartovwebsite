"use client";

import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Text, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

const INK = "#161614";
const SILVER = "#c7cbd1";
const CREAM = "#f7ead1";
const PURPLE = "#8b57de";

const BADGE_SCALE = 1.25;
const CARD_WIDTH = 1.6 * BADGE_SCALE;
const CARD_HEIGHT = 2.25 * BADGE_SCALE;
const CARD_DEPTH = 0.02 * BADGE_SCALE;
const CARD_RADIUS = 0.12 * BADGE_SCALE;
const SLOT_Y = 0.95 * BADGE_SCALE;
const SLOT_WIDTH = 0.42 * BADGE_SCALE;
const SLOT_HEIGHT = 0.09 * BADGE_SCALE;
const IMAGE_Y = 0.55 * BADGE_SCALE;
const IMAGE_RADIUS = 0.32 * BADGE_SCALE;

function roundedRectShape(
  width: number,
  height: number,
  radius: number,
  cx = 0,
  cy = 0
) {
  const shape = new THREE.Shape();
  const w = width / 2;
  const h = height / 2;
  shape.moveTo(cx - w, cy - h + radius);
  shape.lineTo(cx - w, cy + h - radius);
  shape.quadraticCurveTo(cx - w, cy + h, cx - w + radius, cy + h);
  shape.lineTo(cx + w - radius, cy + h);
  shape.quadraticCurveTo(cx + w, cy + h, cx + w, cy + h - radius);
  shape.lineTo(cx + w, cy - h + radius);
  shape.quadraticCurveTo(cx + w, cy - h, cx + w - radius, cy - h);
  shape.lineTo(cx - w + radius, cy - h);
  shape.quadraticCurveTo(cx - w, cy - h, cx - w, cy - h + radius);
  return shape;
}

function useCardGeometry() {
  return useMemo(() => {
    const outline = roundedRectShape(CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS);
    outline.holes.push(
      roundedRectShape(SLOT_WIDTH, SLOT_HEIGHT, SLOT_HEIGHT / 2, 0, SLOT_Y)
    );
    const geometry = new THREE.ExtrudeGeometry(outline, {
      depth: CARD_DEPTH,
      bevelEnabled: false,
    });
    geometry.translate(0, 0, -CARD_DEPTH / 2);
    return geometry;
  }, []);
}

function CardFace() {
  const texture = useTexture("/images/carmel-headshot.jpg");
  return (
    <group position={[0, 0, CARD_DEPTH / 2 + 0.002]}>
      <mesh position={[0, IMAGE_Y, 0]}>
        <circleGeometry args={[IMAGE_RADIUS, 32]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      <Text
        position={[0, -0.13 * BADGE_SCALE, 0]}
        fontSize={0.21 * BADGE_SCALE}
        lineHeight={0.95}
        font="/fonts/Anton-Regular.ttf"
        color={INK}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={1.4 * BADGE_SCALE}
      >
        {"CARMEL\nBARTOV"}
      </Text>
      <Text
        position={[0, -0.62 * BADGE_SCALE, 0]}
        fontSize={0.09 * BADGE_SCALE}
        lineHeight={1.2}
        color={INK}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={1.15 * BADGE_SCALE}
      >
        VIDEO EDITOR & CONTENT CREATOR
      </Text>
      <Text
        position={[0, -0.85 * BADGE_SCALE, 0]}
        fontSize={0.08 * BADGE_SCALE}
        color={INK}
        anchorX="center"
        anchorY="middle"
      >
        @carmelbartov
      </Text>
    </group>
  );
}

const ROPE_SEGMENT = 0.5;
// Physics pivot sits above the card's top edge (not at the visual slot) so the
// rope's end point never overlaps the card mesh — that overlap was causing
// z-fighting/flicker between the band and the card surface as it swung.
const CARD_OFFSET = CARD_HEIGHT / 2 + 0.15 * BADGE_SCALE;
const ANCHOR_X_DESKTOP = 2.2;
const ANCHOR_X_MOBILE = 0;
const ANCHOR_Y = 2.3;

const WIND_IMPULSE_SCALE = 0.9;
const WIND_STILL_THRESHOLD = 0.4;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

function Lanyard({ anchorX }: { anchorX: number }) {
  const cardGeometry = useCardGeometry();
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const slotWorld = new THREE.Vector3();
  const slotQuat = new THREE.Quaternion();

  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const lastPointerX = useRef<number | null>(null);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_OFFSET, 0],
  ]);

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      // The band is extended past its physics endpoint (j3) with an extra
      // point drawn at the card's slot cutout, so it visually threads through
      // the hole with no gap. It's appended after j3 rather than replacing it
      // — replacing it let the spline interpolate directly between the
      // independently-moving j2 (rope physics) and the card-tracked slot
      // point, which pinched/tapered the ribbon short of the slot as the two
      // drifted apart. It's also offset slightly in front of the card face
      // (not z=0, the card's mid-depth) so the opaque front cap around the
      // hole never occludes it — that occlusion was the flicker.
      const cardPos = card.current.translation();
      const cardRot = card.current.rotation();
      slotQuat.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
      slotWorld
        .set(0, SLOT_Y, CARD_DEPTH / 2 + 0.02 * BADGE_SCALE)
        .applyQuaternion(slotQuat)
        .add(vec.set(cardPos.x, cardPos.y, cardPos.z));

      curve.points[0].copy(slotWorld);
      curve.points[1].copy(j3.current.translation());
      curve.points[2].copy(j2.current.translation());
      curve.points[3].copy(j1.current.translation());
      curve.points[4].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      const angSq = ang.x * ang.x + ang.y * ang.y + ang.z * ang.z;
      if (angSq > 0.0004 || Math.abs(rot.y) > 0.01) {
        card.current.setAngvel(
          { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
          true
        );
      }
    }
  });

  return (
    <>
      <RigidBody ref={fixed} position={[anchorX, ANCHOR_Y, 0]} type="fixed" />
      <RigidBody
        position={[anchorX + ROPE_SEGMENT * 0.5, ANCHOR_Y, 0]}
        ref={j1}
        linearDamping={2}
        angularDamping={2}
        canSleep
      >
        <BallCollider args={[0.06]} />
      </RigidBody>
      <RigidBody
        position={[anchorX + ROPE_SEGMENT, ANCHOR_Y, 0]}
        ref={j2}
        linearDamping={2}
        angularDamping={2}
        canSleep
      >
        <BallCollider args={[0.06]} />
      </RigidBody>
      <RigidBody
        position={[anchorX + ROPE_SEGMENT * 1.5, ANCHOR_Y, 0]}
        ref={j3}
        linearDamping={2}
        angularDamping={2}
        canSleep
      >
        <BallCollider args={[0.06]} />
      </RigidBody>
      <RigidBody
        position={[anchorX + ROPE_SEGMENT * 1.5, ANCHOR_Y - CARD_OFFSET, 0]}
        ref={card}
        angularDamping={4}
        linearDamping={4}
        canSleep
        type={dragged ? "kinematicPosition" : "dynamic"}
      >
        <CuboidCollider
          args={[CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_DEPTH / 2]}
        />
        <group
          onPointerUp={(e) => {
            (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
            drag(false);
          }}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            drag(
              new THREE.Vector3()
                .copy(e.point)
                .sub(vec.copy(card.current!.translation()))
            );
          }}
          onPointerMove={(e) => {
            if (dragged || !card.current) return;
            const x = e.point.x;
            if (lastPointerX.current !== null) {
              const deltaX = x - lastPointerX.current;
              const linvel = card.current.linvel();
              const speed = Math.sqrt(
                linvel.x * linvel.x + linvel.y * linvel.y + linvel.z * linvel.z
              );
              if (speed < WIND_STILL_THRESHOLD && Math.abs(deltaX) > 0.0001) {
                card.current.applyImpulse(
                  { x: deltaX * WIND_IMPULSE_SCALE, y: 0, z: 0 },
                  true
                );
              }
            }
            lastPointerX.current = x;
          }}
          onPointerLeave={() => {
            lastPointerX.current = null;
          }}
        >
          <mesh geometry={cardGeometry}>
            <meshStandardMaterial
              color={SILVER}
              metalness={1}
              roughness={0.15}
              envMapIntensity={1.5}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Suspense fallback={null}>
            <CardFace />
          </Suspense>
        </group>
      </RigidBody>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color={PURPLE}
          resolution={[width, height]}
          lineWidth={0.9}
          repeat={[-3, 1]}
        />
      </mesh>
    </>
  );
}

export default function Badge3D() {
  const isMobile = useIsMobile();
  const anchorX = isMobile ? ANCHOR_X_MOBILE : ANCHOR_X_DESKTOP;

  return (
    <div className="pointer-events-auto absolute inset-0 touch-pan-y sm:touch-none">
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 6, 5]} intensity={1} />
        {/* headlight: travels with the camera so whichever face is toward the
            viewer stays lit, even as the badge swings on the lanyard */}
        <pointLight position={[0, 0, 12]} intensity={5} decay={0} />
        <pointLight position={[anchorX, ANCHOR_Y - 1.5, 9]} intensity={3} decay={0} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -32, 0]} interpolate>
            <Lanyard anchorX={anchorX} />
          </Physics>
        </Suspense>
        <Environment resolution={64}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, 4, -3]}
            scale={[6, 6, 1]}
          />
          <Lightformer
            intensity={1.2}
            color={PURPLE}
            position={[-4, 2, 3]}
            scale={[4, 4, 1]}
          />
          <Lightformer
            intensity={1.5}
            color={CREAM}
            position={[4, 1, 3]}
            scale={[4, 4, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}
