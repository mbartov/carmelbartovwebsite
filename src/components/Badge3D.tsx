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
import { useMediaQuery } from "@/hooks/useMediaQuery";
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
/** Wide enough that the oval stays visible around a thinner band */
const SLOT_WIDTH = 0.55 * BADGE_SCALE;
const SLOT_HEIGHT = 0.11 * BADGE_SCALE;
const IMAGE_Y = 0.55 * BADGE_SCALE;
const IMAGE_RADIUS = 0.32 * BADGE_SCALE;
/** Attach above the card so the rope meets the slot cleanly */
const CARD_OFFSET = CARD_HEIGHT / 2 + 0.12 * BADGE_SCALE;

const BAND_SLOT_RATIO = 0.7;

/** Band = 70% of slot opening (scaled from the original 0.9 @ 0.42 slot) */
const REF_SLOT_WIDTH = 0.42 * BADGE_SCALE;
const BAND_LINE_WIDTH =
  0.9 * BAND_SLOT_RATIO * (SLOT_WIDTH / REF_SLOT_WIDTH);

const ROPE_SEGMENT = 0.5;
const ANCHOR_X_DESKTOP = 2.2;
const ANCHOR_X_MOBILE = 0;
const ANCHOR_Y = 2.3;

function cardCenter(anchorX: number, side: number) {
  return {
    x: anchorX + side * ROPE_SEGMENT * 1.5,
    y: ANCHOR_Y - CARD_OFFSET,
  };
}

const WIND_IMPULSE_SCALE = 0.9;
const WIND_STILL_THRESHOLD = 0.4;

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
    lang === "he" ? "עורכת וידאו ומפיקת תוכן" : "VIDEO EDITOR & CONTENT PRODUCER";

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

function useIsMobile() {
  return useMediaQuery("(max-width: 639px)");
}

function Lanyard({ anchorX, lang }: { anchorX: number; lang: Lang }) {
  const cardGeometry = useCardGeometry();
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const slotWorld = useMemo(() => new THREE.Vector3(), []);
  const slotQuat = useMemo(() => new THREE.Quaternion(), []);

  const side = anchorX === 0 ? 1 : Math.sign(anchorX);

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

  // pointerup often never reaches the canvas when the mouse is released
  // outside the browser window/tab — end the drag from the document instead.
  useEffect(() => {
    if (!dragged) return;

    const endDrag = () => {
      drag(false);
      lastPointerX.current = null;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") endDrag();
    };

    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("blur", endDrag);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.documentElement.addEventListener("mouseleave", endDrag);

    return () => {
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("blur", endDrag);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.documentElement.removeEventListener("mouseleave", endDrag);
    };
  }, [dragged]);

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

    if (!fixed.current || !card.current || !band.current) return;

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
            (e.target as Element | null)?.releasePointerCapture?.(e.pointerId);
            drag(false);
          }}
          onPointerCancel={(e) => {
            (e.target as Element | null)?.releasePointerCapture?.(e.pointerId);
            drag(false);
          }}
          onLostPointerCapture={() => {
            drag(false);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            (e.target as Element | null)?.setPointerCapture?.(e.pointerId);
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
            <CardFace lang={lang} />
          </Suspense>
          {/* Front fill — moves with the card so name/role stay lit */}
          <pointLight position={[0, 0, 2.2]} intensity={3} decay={0} />
        </group>
      </RigidBody>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color={PURPLE}
          resolution={resolution}
          lineWidth={BAND_LINE_WIDTH}
          repeat={[-3, 1]}
        />
      </mesh>
    </>
  );
}

export default function Badge3D() {
  const isMobile = useIsMobile();
  const { lang } = useLanguage();
  const side = lang === "he" ? -1 : 1;
  const anchorX = (isMobile ? ANCHOR_X_MOBILE : ANCHOR_X_DESKTOP) * side;
  const center = cardCenter(anchorX, side);

  return (
    <div className="pointer-events-auto absolute inset-0 touch-pan-y sm:touch-none">
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        <ambientLight intensity={0.75} />
        <directionalLight
          position={[center.x, center.y, 11]}
          intensity={1.2}
        />
        <pointLight position={[0, 0, 12]} intensity={3} decay={0} />
        <pointLight
          position={[center.x, center.y, 9]}
          intensity={4}
          decay={0}
        />
        <Suspense fallback={null}>
          <Physics gravity={[0, -32, 0]} interpolate key={`${lang}-${anchorX}`}>
            <Lanyard anchorX={anchorX} lang={lang} />
          </Physics>
        </Suspense>
        <Environment resolution={64}>
          <Lightformer
            intensity={2}
            color="white"
            position={[center.x, center.y, 5]}
            scale={[3.5, 4.5, 1]}
          />
          <Lightformer
            intensity={0.8}
            color={PURPLE}
            position={[-4 * side, 2, 3]}
            scale={[4, 4, 1]}
          />
          <Lightformer
            intensity={1.2}
            color={CREAM}
            position={[center.x, center.y, 3]}
            scale={[3, 4, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}
