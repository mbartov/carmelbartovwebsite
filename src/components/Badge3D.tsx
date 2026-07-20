"use client";

import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
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
import { useLanguage, type Lang } from "./LanguageContext";

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
// Physics pivot sits above the card's top edge (not at the visual slot)
const CARD_OFFSET = CARD_HEIGHT / 2 + 0.15 * BADGE_SCALE;
/** Fills the whole slot opening so the pink page never shows through */
const CLIP_WIDTH = SLOT_WIDTH * 0.95;
const CLIP_HEIGHT = SLOT_HEIGHT * 0.95;
const CLIP_DEPTH = CARD_DEPTH + 0.16 * BADGE_SCALE;
/** Card-local strap from the physics attach point down through the slot */
const STRAP_TOP = CARD_OFFSET;
const STRAP_BOTTOM = SLOT_Y - CLIP_HEIGHT * 0.5;
const STRAP_HEIGHT = STRAP_TOP - STRAP_BOTTOM;
const STRAP_MID_Y = (STRAP_TOP + STRAP_BOTTOM) / 2;

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

function CardFace({ lang }: { lang: Lang }) {
  const texture = useTexture("/images/carmel-headshot.jpg");
  const role =
    lang === "he" ? "עורכת וידאו ויוצרת תוכן" : "VIDEO EDITOR & CONTENT CREATOR";

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
        fontSize={lang === "he" ? 0.1 * BADGE_SCALE : 0.09 * BADGE_SCALE}
        lineHeight={1.2}
        font={lang === "he" ? "/fonts/Rubik-Bold.ttf" : undefined}
        color={INK}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={1.25 * BADGE_SCALE}
        direction={lang === "he" ? "rtl" : "ltr"}
      >
        {role}
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

function Lanyard({ anchorX, lang }: { anchorX: number; lang: Lang }) {
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
  // Hang further toward the outer edge on whichever side the badge sits
  const side = anchorX === 0 ? 1 : Math.sign(anchorX);

  // Static resolution — updating MeshLine resolution every resize/frame
  // causes the band tip to shimmer (known meshline/lanyard issue).
  const resolution = useMemo(
    () =>
      new THREE.Vector2(
        typeof window !== "undefined" ? window.innerWidth : 1280,
        typeof window !== "undefined" ? window.innerHeight : 800
      ),
    []
  );
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
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
      // Band stops at j3 (physics attach). A card-parented strap covers the
      // slot — never run MeshLine into the hole (that tip-over-pink flicker).
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.translation());
      curve.points[2].copy(j1.current.translation());
      curve.points[3].copy(fixed.current.translation());
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
        position={[anchorX + side * ROPE_SEGMENT * 0.5, ANCHOR_Y, 0]}
        ref={j1}
        linearDamping={2}
        angularDamping={2}
        canSleep
      >
        <BallCollider args={[0.06]} />
      </RigidBody>
      <RigidBody
        position={[anchorX + side * ROPE_SEGMENT, ANCHOR_Y, 0]}
        ref={j2}
        linearDamping={2}
        angularDamping={2}
        canSleep
      >
        <BallCollider args={[0.06]} />
      </RigidBody>
      <RigidBody
        position={[anchorX + side * ROPE_SEGMENT * 1.5, ANCHOR_Y, 0]}
        ref={j3}
        linearDamping={2}
        angularDamping={2}
        canSleep
      >
        <BallCollider args={[0.06]} />
      </RigidBody>
      <RigidBody
        position={[
          anchorX + side * ROPE_SEGMENT * 1.5,
          ANCHOR_Y - CARD_OFFSET,
          0,
        ]}
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
          {/* Card-locked strap: fills the slot and meets j3 so MeshLine never
              has to draw into the hole over the pink backdrop */}
          <mesh position={[0, STRAP_MID_Y, 0]}>
            <boxGeometry args={[CLIP_WIDTH, STRAP_HEIGHT, CLIP_DEPTH]} />
            <meshBasicMaterial color={PURPLE} />
          </mesh>
          <Suspense fallback={null}>
            <CardFace lang={lang} />
          </Suspense>
        </group>
      </RigidBody>

      <mesh ref={band} renderOrder={2}>
        <meshLineGeometry />
        <meshLineMaterial
          color={PURPLE}
          resolution={resolution}
          lineWidth={0.9}
          repeat={[-3, 1]}
          depthTest={false}
          depthWrite={false}
          transparent
        />
      </mesh>
    </>
  );
}

export default function Badge3D() {
  const isMobile = useIsMobile();
  const { lang } = useLanguage();
  // Mirror to the left in Hebrew so the badge sits opposite the RTL hero copy
  const side = lang === "he" ? -1 : 1;
  const anchorX = (isMobile ? ANCHOR_X_MOBILE : ANCHOR_X_DESKTOP) * side;

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
          <Physics gravity={[0, -32, 0]} interpolate key={`${lang}-${anchorX}`}>
            <Lanyard anchorX={anchorX} lang={lang} />
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
            position={[-4 * side, 2, 3]}
            scale={[4, 4, 1]}
          />
          <Lightformer
            intensity={1.5}
            color={CREAM}
            position={[4 * side, 1, 3]}
            scale={[4, 4, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}
