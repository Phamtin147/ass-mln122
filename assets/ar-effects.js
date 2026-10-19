/**
 * GIỮ MỘT ĐỐM SÁNG: VÒM-9 (MLN122)
 * Advanced 3D Procedural Hologram & Interactive AR Visual Effects
 * 
 * Includes:
 * 1. monopoly-crush-effect: 3D Cybernetic Hand rising from below & crushing Nếp Sáng core with shockwaves
 * 2. intro-dome-effect: 3D Geodesic Vòm-9 Cyber Dome, pulsating AI Đốm entity & vertical beacon
 * 3. meter-scanner-effect: 3D TRỤC Digital Electric Meter ticking rapidly & surveillance laser cone
 * 4. evidence-drive-effect: 3D Hardware Drive 'NHÀ MÌNH', laser projector & 4 orbiting legal dossiers
 * 5. justice-lights-effect: 3D Scale of Justice & swirling swarm of community light sparks
 */

(function () {
  'use strict';

  const THREE = window.THREE || (typeof AFRAME !== 'undefined' ? AFRAME.THREE : null);

  // ================= SHARED AUDIO FX SYNTHESIZER =================
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playArSound = function (type) {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const t = ctx.currentTime;

      if (type === 'crush') {
        // Heavy low hydraulic clamp + noise crunch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(32, t + 0.35);
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      } else if (type === 'shockwave') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.5);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.5);
      } else if (type === 'glitch') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(920, t);
        osc.frequency.setValueAtTime(320, t + 0.05);
        osc.frequency.setValueAtTime(1200, t + 0.1);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      } else if (type === 'chime') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, t);
        osc.frequency.exponentialRampToValueAtTime(1320, t + 0.4);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.5);
      }
    } catch (e) {}
  };

  // Helper to create glowing Canvas Texture for symbols
  function createCrookedWindowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Cyber background
    ctx.fillStyle = '#061320';
    ctx.fillRect(0, 0, 256, 256);

    // Glowing border
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 236, 236);

    // Crooked window outline (Minh's handmade symbol)
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(50, 60);
    ctx.lineTo(200, 45); // slanted top
    ctx.lineTo(195, 205); // slightly angled right
    ctx.lineTo(45, 195); // slanted bottom
    ctx.closePath();
    ctx.stroke();

    // Cross panes
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(122, 52);
    ctx.lineTo(120, 200);
    ctx.moveTo(48, 128);
    ctx.lineTo(198, 125);
    ctx.stroke();

    // The signature off-center warm yellow dot (Chấm lệch đặc trưng)
    ctx.fillStyle = '#ff9900';
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(170, 172, 18, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  // ================= 1. TARGET 2: MONOPOLY CRUSH EFFECT =================
  // Signature scene: 3D Mechanical Hand rising from below & crushing Nếp Sáng core
  AFRAME.registerComponent('monopoly-crush-effect', {
    schema: {
      active: { type: 'boolean', default: true }
    },

    init: function () {
      const root = new THREE.Group();
      this.root = root;
      this.el.object3D.add(root);

      // Materials
      const darkMetalMat = new THREE.MeshStandardMaterial({
        color: 0x14161f,
        metalness: 0.85,
        roughness: 0.25
      });
      const jointChromeMat = new THREE.MeshStandardMaterial({
        color: 0x4a4f63,
        metalness: 0.95,
        roughness: 0.15
      });
      const neonRedMat = new THREE.MeshBasicMaterial({
        color: 0xff0044
      });
      const redEmissiveMat = new THREE.MeshStandardMaterial({
        color: 0x22050b,
        emissive: 0xff0033,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
      });

      // ---- A. THE RISING 3D ROBOTIC HAND (BÀN TAY CƠ KHÍ TRỤC) ----
      const handGroup = new THREE.Group();
      this.handGroup = handGroup;
      root.add(handGroup);

      // Forearm / Hydraulic Arm Base
      const armGeo = new THREE.CylinderGeometry(0.065, 0.085, 0.42, 16);
      const armMesh = new THREE.Mesh(armGeo, darkMetalMat);
      armMesh.position.set(0, -0.26, 0);
      handGroup.add(armMesh);

      // Arm glowing neon power veins (TRỤC Red Energy Line)
      const veinGeo = new THREE.CylinderGeometry(0.068, 0.088, 0.38, 8, 1, true);
      const veinMesh = new THREE.Mesh(veinGeo, new THREE.MeshBasicMaterial({ color: 0xff0044, wireframe: true }));
      veinMesh.position.set(0, -0.26, 0);
      handGroup.add(veinMesh);

      // Wrist Spherical Joint
      const wristGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const wristMesh = new THREE.Mesh(wristGeo, jointChromeMat);
      wristMesh.position.set(0, -0.04, 0);
      handGroup.add(wristMesh);

      // Armored Palm Plate
      const palmGeo = new THREE.BoxGeometry(0.24, 0.07, 0.18);
      const palmMesh = new THREE.Mesh(palmGeo, darkMetalMat);
      palmMesh.position.set(0, 0.02, 0);
      handGroup.add(palmMesh);

      // TRỤC Corporate Hexagon Crest on Palm
      const hexGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.015, 6);
      const hexMesh = new THREE.Mesh(hexGeo, redEmissiveMat);
      hexMesh.rotation.x = Math.PI / 2;
      hexMesh.position.set(0, 0.02, 0.095);
      handGroup.add(hexMesh);

      // Multi-jointed Articulated Fingers (4 Main Fingers + 1 Opposing Thumb)
      this.fingers = [];
      const fingerConfigs = [
        { x: -0.09, y: 0.05, z: 0.07, rotY: -0.22, length: 0.14 }, // Index
        { x: -0.03, y: 0.06, z: 0.08, rotY: -0.07, length: 0.16 }, // Middle
        { x: 0.03, y: 0.06, z: 0.08, rotY: 0.07, length: 0.15 },  // Ring
        { x: 0.09, y: 0.05, z: 0.07, rotY: 0.22, length: 0.13 },  // Pinky
        { x: -0.13, y: 0.01, z: 0.00, rotY: -1.05, length: 0.12 } // Opposing Thumb
      ];

      fingerConfigs.forEach((cfg) => {
        const knuckleGroup = new THREE.Group();
        knuckleGroup.position.set(cfg.x, cfg.y, cfg.z);
        knuckleGroup.rotation.y = cfg.rotY;

        // Base Joint Spherical Pivot
        const joint1 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), jointChromeMat);
        knuckleGroup.add(joint1);

        // Phalanx 1 (Lower Finger Segment)
        const p1Geo = new THREE.BoxGeometry(0.032, 0.032, cfg.length * 0.55);
        const p1Mesh = new THREE.Mesh(p1Geo, darkMetalMat);
        p1Mesh.position.set(0, 0, cfg.length * 0.28);
        knuckleGroup.add(p1Mesh);

        // Mid Joint Pivot
        const midJoint = new THREE.Group();
        midJoint.position.set(0, 0, cfg.length * 0.55);
        knuckleGroup.add(midJoint);

        const joint2 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), jointChromeMat);
        midJoint.add(joint2);

        // Phalanx 2 + Claw Sharp Tip (Upper Finger Segment)
        const p2Geo = new THREE.ConeGeometry(0.02, cfg.length * 0.5, 6);
        const p2Mesh = new THREE.Mesh(p2Geo, darkMetalMat);
        p2Mesh.rotation.x = Math.PI / 2;
        p2Mesh.position.set(0, 0, cfg.length * 0.25);
        midJoint.add(p2Mesh);

        // Glowing Claw Tip
        const tipGeo = new THREE.SphereGeometry(0.01, 8, 8);
        const tipMesh = new THREE.Mesh(tipGeo, neonRedMat);
        tipMesh.position.set(0, 0, cfg.length * 0.5);
        midJoint.add(tipMesh);

        handGroup.add(knuckleGroup);
        this.fingers.push({ knuckle: knuckleGroup, mid: midJoint });
      });

      // ---- B. THE NẾP SÁNG ENERGY CORE (LÕI NĂNG LƯỢNG BỊ BÓP NGHẸT) ----
      const coreGroup = new THREE.Group();
      this.coreGroup = coreGroup;
      coreGroup.position.set(0, 0.05, 0.22); // Hovering at center of hand reach
      root.add(coreGroup);

      // Translucent Glass Crystal Box
      const windowTex = createCrookedWindowTexture();
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.75,
        map: windowTex
      });
      const crystalGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
      this.coreCube = new THREE.Mesh(crystalGeo, crystalMat);
      coreGroup.add(this.coreCube);

      // Cyan Wireframe Cage around Core
      const cageMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
      this.cageMesh = new THREE.Mesh(new THREE.BoxGeometry(0.186, 0.186, 0.186), cageMat);
      coreGroup.add(this.cageMesh);

      // Glowing Inner Core (The Unquenchable Warm Spark - Đốm Sáng Bên Trong)
      const innerGeo = new THREE.SphereGeometry(0.065, 16, 16);
      this.innerCoreMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
      this.innerCoreMesh = new THREE.Mesh(innerGeo, this.innerCoreMat);
      coreGroup.add(this.innerCoreMesh);

      // ---- C. BLAST SHOCKWAVES & BURST SPARKS (HIỆU ỨNG NỔ VÀ BÓP NÁT) ----
      const shockGeo = new THREE.RingGeometry(0.04, 0.08, 32);
      this.shockMat = new THREE.MeshBasicMaterial({
        color: 0xff0044,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
      });
      this.shockwave1 = new THREE.Mesh(shockGeo, this.shockMat);
      this.shockwave1.position.set(0, 0.05, 0.22);
      root.add(this.shockwave1);

      this.shockwave2 = new THREE.Mesh(shockGeo, this.shockMat.clone());
      this.shockwave2.position.set(0, 0.05, 0.22);
      root.add(this.shockwave2);

      // Debris Spark Particles
      this.sparks = [];
      const sparkGeo = new THREE.TetrahedronGeometry(0.016);
      for (let i = 0; i < 24; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xff0044 : 0xffe600 });
        const mesh = new THREE.Mesh(sparkGeo, mat);
        mesh.visible = false;
        root.add(mesh);
        this.sparks.push({
          mesh: mesh,
          vel: new THREE.Vector3(
            (Math.random() - 0.5) * 0.7,
            (Math.random() - 0.5) * 0.7,
            (Math.random() - 0.5) * 0.7
          ),
          active: false
        });
      }

      this.colorCrushRed = new THREE.Color(0xff0022);
      this.colorCoreCyan = new THREE.Color(0x00f0ff);
      this.colorInnerRed = new THREE.Color(0xff0000);
      this.colorInnerGold = new THREE.Color(0xffea00);

      this.lastCrushTrigger = -1;
    },

    tick: function (time, delta) {
      if (!this.root) return;

      // 4.5-second cinematic cycle
      const cycleDuration = 4500;
      const t = (time % cycleDuration) / cycleDuration; // 0.0 to 1.0

      // ---- PHASE 1: RISING FROM BELOW (t: 0.0 -> 0.28) ----
      if (t < 0.28) {
        const p = t / 0.28;
        const ease = Math.sin((p * Math.PI) / 2); // Smooth rise

        // Hand ascends from behind/below the page (Y: -0.65 -> 0.0, Z: -0.2 -> 0.20)
        this.handGroup.position.set(0, -0.65 + ease * 0.65, -0.2 + ease * 0.40);
        this.handGroup.rotation.set(-0.35 * (1 - ease), 0, 0);

        // Fingers wide open in menacing claw stance
        this.fingers.forEach((f) => {
          f.knuckle.rotation.x = -0.65 * (1 - ease) - 0.35;
          f.mid.rotation.x = 0.25;
        });

        // Core floats peacefully at center, rotating gently
        this.coreGroup.position.set(0, 0.05, 0.22 + Math.sin(time * 0.003) * 0.02);
        this.coreGroup.scale.set(1.0, 1.0, 1.0);
        this.coreCube.material.color.setHex(0x00f0ff);
        this.cageMesh.material.color.setHex(0x00f0ff);
        this.innerCoreMat.color.setHex(0xffea00);
        this.coreGroup.rotation.y += 0.02;
        this.coreGroup.rotation.x = Math.sin(time * 0.002) * 0.15;

        this.shockwave1.material.opacity = 0;
        this.shockwave2.material.opacity = 0;
      }
      // ---- PHASE 2: CLOSING CLAWS & SQUEEZE (t: 0.28 -> 0.42) ----
      else if (t < 0.42) {
        const p = (t - 0.28) / 0.14;
        const ease = p * p; // Accelerating inward grab

        this.handGroup.position.set(0, 0.0, 0.20);
        this.handGroup.rotation.set(0, 0, 0);

        // Fingers curl rapidly inward toward core
        this.fingers.forEach((f) => {
          f.knuckle.rotation.x = -0.35 + ease * 1.15; // flexes inward
          f.mid.rotation.x = 0.25 + ease * 0.85;     // claw curls around
        });

        // Core starts feeling the grip
        this.coreGroup.rotation.y += 0.04;
        this.coreGroup.scale.set(1.0 - p * 0.2, 1.0 - p * 0.2, 1.0 - p * 0.2);
      }
      // ---- PHASE 3: THE CRUSH / BÓP NÁT (t: 0.42 -> 0.72) ----
      else if (t < 0.72) {
        const p = (t - 0.42) / 0.30;

        // Trigger sound once at crush impact
        const currentCycle = Math.floor(time / cycleDuration);
        if (this.lastCrushTrigger !== currentCycle) {
          this.lastCrushTrigger = currentCycle;
          window.playArSound('crush');
          setTimeout(() => window.playArSound('shockwave'), 120);

          // Explode debris sparks
          this.sparks.forEach((s) => {
            s.mesh.position.set(0, 0.05, 0.22);
            s.mesh.visible = true;
            s.active = true;
          });
        }

        // Maximum tight squeeze on fingers
        this.fingers.forEach((f) => {
          f.knuckle.rotation.x = 0.80 + Math.sin(time * 0.06) * 0.05; // shuddering grip
          f.mid.rotation.x = 1.10;
        });

        // Violent crushing jitter displacement & drastic shrink ("BÓP NÁT")
        const jitterX = (Math.random() - 0.5) * 0.018;
        const jitterY = (Math.random() - 0.5) * 0.018;
        this.coreGroup.position.set(jitterX, 0.05 + jitterY, 0.22);

        // Core is crushed down to 0.28 scale!
        const crushScale = Math.max(0.28, 0.8 - p * 0.65);
        this.coreGroup.scale.set(crushScale, crushScale, crushScale);

        // Alarm RED glitch state
        this.coreCube.material.color.setHex(0xff0022);
        this.cageMesh.material.color.setHex(0xff0044);
        this.innerCoreMat.color.setHex(0xff0000);

        // Expanding Shockwave 1
        const s1 = p * 4.0;
        this.shockwave1.scale.set(s1, s1, 1);
        this.shockwave1.material.opacity = Math.max(0, 1.0 - p * 2.2);

        // Expanding Shockwave 2
        const p2 = Math.max(0, p - 0.15) * 4.5;
        this.shockwave2.scale.set(p2, p2, 1);
        this.shockwave2.material.opacity = Math.max(0, 1.0 - (p - 0.15) * 2.5);

        // Fly out sparks
        this.sparks.forEach((s) => {
          if (s.active) {
            s.mesh.position.addScaledVector(s.vel, delta * 0.002);
            s.mesh.rotation.x += 0.1;
            s.mesh.rotation.y += 0.1;
          }
        });
      }
      // ---- PHASE 4: RESURGENCE & RESET (t: 0.72 -> 1.0) ----
      else {
        const p = (t - 0.72) / 0.28;
        const ease = Math.sin((p * Math.PI) / 2);

        // Hand releases grip and recedes downward
        this.handGroup.position.set(0, -ease * 0.5, 0.20 - ease * 0.35);
        this.fingers.forEach((f) => {
          f.knuckle.rotation.x = 0.80 - ease * 1.2;
          f.mid.rotation.x = 1.10 - ease * 0.85;
        });

        // The indomitable "Đốm Sáng" inside reignites and restores its golden form!
        const restoreScale = 0.28 + ease * 0.72;
        this.coreGroup.scale.set(restoreScale, restoreScale, restoreScale);
        this.coreGroup.position.set(0, 0.05, 0.22);

        this.coreCube.material.color.lerpColors(
          this.colorCrushRed,
          this.colorCoreCyan,
          ease
        );
        this.innerCoreMat.color.lerpColors(
          this.colorInnerRed,
          this.colorInnerGold,
          ease
        );

        this.shockwave1.material.opacity = 0;
        this.shockwave2.material.opacity = 0;
        this.sparks.forEach((s) => (s.mesh.visible = false));
      }
    }
  });

  // ================= 2. TARGET 0: INTRO DOME & AI ĐỐM EFFECT =================
  // Opening scene: Expanding 3D Geodesic Vòm-9 Dome + Floating AI Đốm with animated blinking eyes
  AFRAME.registerComponent('intro-dome-effect', {
    init: function () {
      const root = new THREE.Group();
      this.root = root;
      this.el.object3D.add(root);

      // A. Geodesic Cyber Dome (Vòm-9)
      const domeGeo = new THREE.SphereGeometry(0.48, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const domeMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.45
      });
      this.dome = new THREE.Mesh(domeGeo, domeMat);
      this.dome.position.set(0, 0, 0.01);
      this.dome.rotation.x = Math.PI / 2; // Arches outward toward user
      root.add(this.dome);

      // B. Counter-Rotating Gyroscopic Concentric Rings
      const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide });
      const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xff007f, side: THREE.DoubleSide });
      this.ring1 = new THREE.Mesh(new THREE.RingGeometry(0.38, 0.395, 36), ringMat1);
      this.ring2 = new THREE.Mesh(new THREE.RingGeometry(0.26, 0.272, 36), ringMat2);
      this.ring1.position.set(0, 0.02, 0.04);
      this.ring2.position.set(0, 0.02, 0.06);
      root.add(this.ring1);
      root.add(this.ring2);

      // C. AI Đốm 3D Entity (Thực Thể AI Đốm Sáng)
      const domGroup = new THREE.Group();
      this.domGroup = domGroup;
      domGroup.position.set(0, 0.02, 0.24);
      root.add(domGroup);

      // Luminous Golden Sphere
      const domBodyGeo = new THREE.SphereGeometry(0.08, 24, 24);
      const domBodyMat = new THREE.MeshStandardMaterial({
        color: 0xffea00,
        emissive: 0xffcc00,
        emissiveIntensity: 0.9,
        metalness: 0.2,
        roughness: 0.1
      });
      this.domBody = new THREE.Mesh(domBodyGeo, domBodyMat);
      domGroup.add(this.domBody);

      // Cyan Glowing Aura Shell
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.3,
        wireframe: true
      });
      this.aura = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 16), auraMat);
      domGroup.add(this.aura);

      // Expressive Digital Eyes (Blinking Cyan Ovals)
      const eyeGeo = new THREE.SphereGeometry(0.016, 10, 10);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      this.leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      this.rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      this.leftEye.position.set(-0.028, 0.02, 0.072);
      this.rightEye.position.set(0.028, 0.02, 0.072);
      domGroup.add(this.leftEye);
      domGroup.add(this.rightEye);

      // Orbital Spark Particles circling Đốm
      this.orbiters = [];
      for (let i = 0; i < 3; i++) {
        const orb = new THREE.Mesh(
          new THREE.SphereGeometry(0.012, 8, 8),
          new THREE.MeshBasicMaterial({ color: i === 0 ? 0x00f0ff : i === 1 ? 0xff007f : 0x00ff66 })
        );
        root.add(orb);
        this.orbiters.push({ mesh: orb, angle: (i * Math.PI * 2) / 3, speed: 1.8 + i * 0.4 });
      }

      // Vertical Hologram Beacon Light Pillar
      const beamGeo = new THREE.CylinderGeometry(0.03, 0.08, 0.9, 16, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      this.beacon = new THREE.Mesh(beamGeo, beamMat);
      this.beacon.rotation.x = Math.PI / 2;
      this.beacon.position.set(0, 0.02, 0.45);
      root.add(this.beacon);
    },

    tick: function (time) {
      if (!this.root) return;
      const sec = time * 0.001;

      // Expand & pulse Dome
      const domeScale = 0.95 + Math.sin(sec * 1.5) * 0.05;
      this.dome.scale.set(domeScale, domeScale, domeScale);

      // Counter-rotating rings
      this.ring1.rotation.z = sec * 0.8;
      this.ring2.rotation.z = -sec * 1.2;

      // Gentle floating bob of AI Đốm
      this.domGroup.position.z = 0.24 + Math.sin(sec * 3.0) * 0.025;
      this.domGroup.position.x = Math.sin(sec * 1.2) * 0.02;
      this.aura.rotation.y = sec * 1.5;

      // Blinking Eyes (blink every ~2.5 seconds)
      const blinkPhase = (sec % 2.5);
      const eyeScaleY = (blinkPhase > 2.38) ? 0.08 : 1.0;
      this.leftEye.scale.y = eyeScaleY;
      this.rightEye.scale.y = eyeScaleY;

      // Orbiting energy particles
      this.orbiters.forEach((o) => {
        const a = o.angle + sec * o.speed;
        const rad = 0.16 + Math.sin(a * 2) * 0.03;
        o.mesh.position.set(
          this.domGroup.position.x + Math.cos(a) * rad,
          this.domGroup.position.y + Math.sin(a) * rad * 0.6,
          this.domGroup.position.z + Math.sin(a) * 0.08
        );
      });

      // Beacon rotation
      this.beacon.rotation.z = sec * 0.5;
    }
  });

  // ================= 3. TARGET 1: METER SCANNER EFFECT =================
  // Trang 1-2: 3D TRỤC Digital Electric Meter ticking upwards + oscillating surveillance laser cone
  AFRAME.registerComponent('meter-scanner-effect', {
    init: function () {
      const root = new THREE.Group();
      this.root = root;
      this.el.object3D.add(root);

      const darkMat = new THREE.MeshStandardMaterial({ color: 0x141724, metalness: 0.8, roughness: 0.3 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x050c18, transparent: true, opacity: 0.85 });

      // A. 3D Digital Electric Meter Box (Công Tơ Điện TRỤC)
      const meterGroup = new THREE.Group();
      meterGroup.position.set(0, 0.14, 0.18);
      root.add(meterGroup);

      const meterBody = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.08), darkMat);
      meterGroup.add(meterBody);

      const displayScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.14), glassMat);
      displayScreen.position.set(0, 0.01, 0.042);
      meterGroup.add(displayScreen);

      // Warning LED on top
      this.warnLed = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xff0044 })
      );
      this.warnLed.position.set(0, 0.13, 0.04);
      meterGroup.add(this.warnLed);

      // Rotating Rolling Number Cylinders (representing surging kWh counter)
      this.rollers = [];
      for (let i = 0; i < 4; i++) {
        const roller = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 0.045, 12),
          new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true })
        );
        roller.rotation.z = Math.PI / 2;
        roller.position.set(-0.09 + i * 0.06, 0.01, 0.045);
        meterGroup.add(roller);
        this.rollers.push(roller);
      }

      // B. Oscillating Surveillance Scanner Cone (TRỤC Grid Scanner)
      const scanConeGeo = new THREE.ConeGeometry(0.35, 0.65, 32, 1, true);
      const scanConeMat = new THREE.MeshBasicMaterial({
        color: 0xff0044,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide
      });
      this.scanCone = new THREE.Mesh(scanConeGeo, scanConeMat);
      this.scanCone.rotation.x = -Math.PI / 2; // points toward page
      this.scanCone.position.set(0, -0.05, 0.35);
      root.add(this.scanCone);

      // C. Floating Crooked Window Prototype Sketch
      const windowTex = createCrookedWindowTexture();
      const sketchMat = new THREE.MeshBasicMaterial({ map: windowTex, transparent: true, opacity: 0.9 });
      this.sketchMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.20, 0.20), sketchMat);
      this.sketchMesh.position.set(0, -0.22, 0.12);
      root.add(this.sketchMesh);
    },

    tick: function (time) {
      if (!this.root) return;
      const sec = time * 0.001;

      // Roll electric meter numbers continuously
      this.rollers.forEach((r, idx) => {
        r.rotation.x += (idx + 1) * 0.03;
      });

      // Blink red alarm LED at 2Hz ("TÍCH... TÍCH...")
      const isBlink = Math.sin(sec * 12.0) > 0;
      this.warnLed.material.color.setHex(isBlink ? 0xff0044 : 0x33000f);

      // Oscillate surveillance laser scanner cone across page (+- 26 deg)
      this.scanCone.rotation.y = Math.sin(sec * 2.2) * 0.45;
      this.scanCone.position.x = Math.sin(sec * 2.2) * 0.12;

      // Sketch mesh gentle hover
      this.sketchMesh.position.z = 0.12 + Math.sin(sec * 2.0) * 0.015;
    }
  });

  // ================= 4. TARGET 3: EVIDENCE HARDWARE DRIVE EFFECT =================
  // Trang 5: 3D Hardware Drive 'NHÀ MÌNH', vertical laser projector & 4 orbiting legal dossiers
  AFRAME.registerComponent('evidence-drive-effect', {
    init: function () {
      const root = new THREE.Group();
      this.root = root;
      this.el.object3D.add(root);

      const metalMat = new THREE.MeshStandardMaterial({ color: 0x222633, metalness: 0.9, roughness: 0.2 });
      const greenLedMat = new THREE.MeshBasicMaterial({ color: 0x00ff66 });

      // A. 3D Hardware Storage Drive "NHÀ MÌNH"
      const driveGroup = new THREE.Group();
      driveGroup.position.set(0, 0.02, 0.15);
      root.add(driveGroup);

      // Aluminum Drive Enclosure
      const driveBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.05), metalMat);
      driveGroup.add(driveBody);

      // Status Green LED Strip
      const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.015, 0.01), greenLedMat);
      ledStrip.position.set(0, -0.09, 0.028);
      driveGroup.add(ledStrip);

      // Embossed Crooked Window Emblem on Drive
      const windowTex = createCrookedWindowTexture();
      const emblem = new THREE.Mesh(
        new THREE.PlaneGeometry(0.10, 0.10),
        new THREE.MeshBasicMaterial({ map: windowTex, transparent: true })
      );
      emblem.position.set(0, 0.02, 0.028);
      driveGroup.add(emblem);

      // B. Vertical Data Projection Holo-Beam
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.12, 0.7, 16, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00ff66,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.rotation.x = Math.PI / 2;
      beam.position.set(0, 0.02, 0.35);
      root.add(beam);

      // C. 4 Orbiting 3D Holographic Evidence Tablets
      const titles = ['1. BẢN VẼ NẾP SÁNG', '2. NHẬT KÝ LỆNH ÉP', '3. TỪ CHỐI KẾT NỐI', '4. THỎA THUẬN VÒM-9'];
      this.tablets = [];

      titles.forEach((txt, idx) => {
        const tabCanvas = document.createElement('canvas');
        tabCanvas.width = 256;
        tabCanvas.height = 128;
        const ctx = tabCanvas.getContext('2d');
        ctx.fillStyle = '#061a10';
        ctx.fillRect(0, 0, 256, 128);
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, 248, 120);
        ctx.fillStyle = '#ffe600';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(txt, 14, 48);
        ctx.fillStyle = '#00f0ff';
        ctx.font = '14px monospace';
        ctx.fillText('>> HỒ SƠ ĐỐI CHIẾU <<', 14, 88);

        const tabTex = new THREE.CanvasTexture(tabCanvas);
        const tabMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(0.24, 0.12),
          new THREE.MeshBasicMaterial({ map: tabTex, transparent: true, side: THREE.DoubleSide })
        );
        root.add(tabMesh);
        this.tablets.push({ mesh: tabMesh, angle: (idx * Math.PI * 2) / 4 });
      });
    },

    tick: function (time) {
      if (!this.root) return;
      const sec = time * 0.001;

      // Orbit 4 legal evidence dossiers around drive
      this.tablets.forEach((t, i) => {
        const a = t.angle + sec * 0.9;
        const rad = 0.32;
        t.mesh.position.set(
          Math.cos(a) * rad,
          0.02 + Math.sin(a * 2) * 0.04,
          0.18 + Math.sin(a) * 0.12 + (i % 2 === 0 ? 0.05 : -0.05)
        );
        t.mesh.rotation.z = -Math.sin(a) * 0.3;
      });
    }
  });

  // ================= 5. TARGET 4: JUSTICE LIGHTS & COMMUNITY HOPE =================
  // Trang 6: 3D Scale of Justice & swirling constellation of community light sparks
  AFRAME.registerComponent('justice-lights-effect', {
    init: function () {
      const root = new THREE.Group();
      this.root = root;
      this.el.object3D.add(root);

      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffea00, metalness: 0.9, roughness: 0.2 });
      const cyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

      // A. 3D Scale of Justice (Cán Cân Công Lý Vòm-9)
      const scaleGroup = new THREE.Group();
      this.scaleGroup = scaleGroup;
      scaleGroup.position.set(0, 0.05, 0.18);
      root.add(scaleGroup);

      // Central Pillar
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.025, 0.32, 16), goldMat);
      scaleGroup.add(pillar);

      // Crossbeam that tilts
      this.crossbeam = new THREE.Group();
      this.crossbeam.position.set(0, 0.14, 0);
      scaleGroup.add(this.crossbeam);

      const beamBar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.46, 12), goldMat);
      beamBar.rotation.z = Math.PI / 2;
      this.crossbeam.add(beamBar);

      // Left Pan: TRỤC Monopoly Weight
      const leftPanGroup = new THREE.Group();
      leftPanGroup.position.set(-0.21, -0.08, 0);
      this.crossbeam.add(leftPanGroup);
      const pan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.01, 0.02, 16), goldMat);
      leftPanGroup.add(pan1);
      const weight1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0xff0044 }));
      weight1.position.set(0, 0.03, 0);
      leftPanGroup.add(weight1);

      // Right Pan: Citizen Petition Signatures
      const rightPanGroup = new THREE.Group();
      rightPanGroup.position.set(0.21, -0.08, 0);
      this.crossbeam.add(rightPanGroup);
      const pan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.01, 0.02, 16), goldMat);
      rightPanGroup.add(pan2);
      const weight2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), cyanMat);
      weight2.position.set(0, 0.03, 0);
      rightPanGroup.add(weight2);

      // B. Swarm of 36 Community Light Sparks (Ngàn Đốm Sáng Vòm-9)
      this.sparks = [];
      const sparkGeo = new THREE.SphereGeometry(0.012, 8, 8);
      for (let i = 0; i < 36; i++) {
        const sMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xffea00 : 0x00ff66 });
        const sMesh = new THREE.Mesh(sparkGeo, sMat);
        root.add(sMesh);
        this.sparks.push({
          mesh: sMesh,
          rad: 0.15 + Math.random() * 0.32,
          speed: 1.0 + Math.random() * 1.5,
          angle: Math.random() * Math.PI * 2,
          baseZ: 0.08 + Math.random() * 0.35,
          zSpeed: 0.4 + Math.random() * 0.6
        });
      }
    },

    tick: function (time) {
      if (!this.root) return;
      const sec = time * 0.001;

      // Balance tilts dynamically as community petitions weigh in, settling into justice!
      this.crossbeam.rotation.z = Math.sin(sec * 1.5) * 0.12;

      // Swirl community light particles upward into constellation
      this.sparks.forEach((s) => {
        const a = s.angle + sec * s.speed;
        s.mesh.position.set(
          Math.cos(a) * s.rad,
          Math.sin(a) * s.rad * 0.8,
          ((s.baseZ + sec * s.zSpeed) % 0.45)
        );
      });
    }
  });

})();
