/*
 * Giữ Một Đốm Sáng: Vòm-9 (MLN122) — AR trang 4 "Dự án Nếp Sáng"
 *
 * Component A-Frame: nep-sang-effect
 *   - Gắn vào <a-entity mindar-image-target="targetIndex: 0">: chạy khi camera nhận ra trang.
 *   - Gắn vào một entity thường với mode: preview: chạy khi gọi NepSang.play().
 *
 * Toạ độ theo trang: rộng 1 đơn vị (x từ -0.5 đến 0.5), cao 1200/896 ≈ 1.339
 * (y từ -0.67 đến 0.67), z hướng ra khỏi mặt giấy về phía người xem.
 */
(function () {
  'use strict';

  const THREE = AFRAME.THREE;
  const PAGE_H = 1200 / 896;
  const FONT = '"Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif';

  const C = {
    amber: '#ffd23f',
    amberDeep: '#ff9a1f',
    cyan: '#3ee6ff',
    ink: '#081420',
    paper: '#fffaf0',
    white: '#ffffff',
  };

  // ------------------------------------------------------------------
  // Âm thanh tổng hợp (không cần file), chỉ phát sau khi người dùng chạm
  // ------------------------------------------------------------------
  const Sound = {
    ctx: null,
    on: true,
    unlock() {
      try {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended') this.ctx.resume();
      } catch (e) { /* trình duyệt không hỗ trợ: im lặng */ }
    },
    tone(type, f0, f1, dur, vol, delay) {
      const ctx = this.ctx;
      const t = ctx.currentTime + (delay || 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f0, t);
      osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },
    play(name) {
      if (!this.on || !this.ctx) return;
      try {
        switch (name) {
          case 'scan': this.tone('sine', 520, 1040, 0.5, 0.12); break;
          case 'node': this.tone('triangle', 1300, 1500, 0.07, 0.05); break;
          case 'lift': this.tone('sine', 330, 660, 0.6, 0.1); this.tone('sine', 495, 990, 0.6, 0.05, 0.05); break;
          case 'pop': this.tone('sine', 400, 1600, 0.18, 0.16); this.tone('triangle', 1600, 2400, 0.25, 0.06, 0.12); break;
          case 'spark': [1320, 1760, 2093].forEach((f, i) => this.tone('sine', f, f * 1.01, 0.35, 0.07, i * 0.06)); break;
          case 'warm': [523, 659, 784].forEach((f, i) => this.tone('sine', f, f, 0.9, 0.06, i * 0.09)); break;
        }
      } catch (e) { /* bỏ qua */ }
    },
  };

  // ------------------------------------------------------------------
  // Tiện ích vẽ
  // ------------------------------------------------------------------
  const PX = 1400; // số pixel canvas cho 1 đơn vị toạ độ: chữ đủ nét trên điện thoại

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrap(ctx, text, maxW) {
    const words = text.split(' ');
    const out = [];
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        out.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
    return out;
  }

  /**
   * Tạo một tấm chữ (mặt phẳng) có nền.
   * lines: [{ text, size, weight, color, spacing }]
   * style: 'card' (nền tối), 'bubble' (bong bóng thoại trắng), 'tag' (nhãn nhỏ)
   */
  function textPanel(opts) {
    const width = opts.width;
    const pad = opts.pad != null ? opts.pad : 34;
    const align = opts.align || 'left';
    const style = opts.style || 'card';
    const W = Math.round(width * PX);
    const maxW = W - pad * 2;

    const measure = document.createElement('canvas').getContext('2d');
    const laid = [];
    let H = pad;
    for (const l of opts.lines) {
      measure.font = `${l.weight || 600} ${l.size}px ${FONT}`;
      if (l.spacing) measure.letterSpacing = l.spacing + 'px';
      const parts = wrap(measure, l.text, maxW);
      for (const p of parts) {
        laid.push({ text: p, l, y: H + l.size * 0.92 });
        H += l.size * 1.28;
      }
      H += l.gapAfter || 0;
    }
    H += pad - (opts.lines.length ? opts.lines[opts.lines.length - 1].size * 0.2 : 0);
    const tailH = opts.tail ? 46 : 0;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = Math.round(H + tailH);
    const ctx = canvas.getContext('2d');

    const r = style === 'tag' ? Math.min(28, H / 2) : 30;
    if (style === 'bubble') {
      ctx.fillStyle = C.paper;
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 7;
      roundRect(ctx, 4, 4, W - 8, H - 8, r);
      ctx.fill();
      ctx.stroke();
      if (opts.tail) {
        const tx = opts.tail === 'right' ? W - 120 : 120;
        const dir = opts.tail === 'right' ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(tx - 34, H - 9);
        ctx.lineTo(tx + 40 * dir, H + tailH - 4);
        ctx.lineTo(tx + 26, H - 9);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(tx - 34, H - 6);
        ctx.lineTo(tx + 40 * dir, H + tailH - 4);
        ctx.lineTo(tx + 26, H - 6);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = style === 'tag' ? 'rgba(6, 16, 28, 0.86)' : 'rgba(6, 16, 28, 0.9)';
      roundRect(ctx, 0, 0, W, H, r);
      ctx.fill();
      ctx.strokeStyle = opts.border || 'rgba(62, 230, 255, 0.55)';
      ctx.lineWidth = 4;
      roundRect(ctx, 2, 2, W - 4, H - 4, r);
      ctx.stroke();
      if (opts.stripe) {
        ctx.fillStyle = opts.stripe;
        roundRect(ctx, 0, 0, 14, H, 7);
        ctx.fill();
      }
    }

    for (const it of laid) {
      const l = it.l;
      ctx.font = `${l.weight || 600} ${l.size}px ${FONT}`;
      ctx.letterSpacing = (l.spacing || 0) + 'px';
      ctx.fillStyle = l.color || (style === 'bubble' ? C.ink : C.white);
      ctx.textAlign = align;
      const x = align === 'center' ? W / 2 : align === 'right' ? W - pad : pad + (opts.stripe ? 10 : 0);
      ctx.fillText(it.text, x, it.y);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    const height = (H + tailH) / PX;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
    mesh.renderOrder = 20;
    mesh.userData.height = height;
    return mesh;
  }

  function glowTexture(inner, outer) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.35, outer);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  function glowSprite(tex, size, opacity) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, depthWrite: false, opacity: opacity == null ? 1 : opacity,
      blending: THREE.AdditiveBlending,
    }));
    s.scale.set(size, size, 1);
    return s;
  }

  // Thanh nối giữa hai điểm (đường mạng nơ-ron, tia sáng)
  function segment(a, b, radius, material) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(radius, radius, len, 6, 1, true);
    const m = new THREE.Mesh(geo, material);
    m.position.copy(a).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return m;
  }

  // Ô cửa sổ méo: nét vẽ tay phát sáng, nền trong suốt
  function crookedWindowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    g.lineCap = 'round';
    g.lineJoin = 'round';
    const pts = [[86, 104], [418, 70], [404, 430], [78, 404]];
    const draw = (color, width, blur) => {
      g.shadowColor = C.amber;
      g.shadowBlur = blur;
      g.strokeStyle = color;
      g.lineWidth = width;
      g.beginPath();
      g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < 4; i++) g.lineTo(pts[i][0], pts[i][1]);
      g.closePath();
      g.stroke();
      g.lineWidth = width * 0.6;
      g.beginPath();
      g.moveTo(250, 88);
      g.lineTo(244, 420);
      g.moveTo(82, 256);
      g.lineTo(410, 250);
      g.stroke();
    };
    draw('rgba(255, 210, 63, 0.35)', 34, 40);
    draw(C.amber, 16, 24);
    draw('#fff6cf', 5, 0);
    return new THREE.CanvasTexture(c);
  }

  // ------------------------------------------------------------------
  // Hoạt ảnh
  // ------------------------------------------------------------------
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
  const easeOut = (x) => { x = clamp01(x); return 1 - Math.pow(1 - x, 3); };
  const backOut = (x) => { x = clamp01(x); const s = 1.9; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
  const phase = (t, start, dur) => clamp01((t - start) / dur);

  // Mốc thời gian (giây) kể từ lúc nhận ra trang
  const T = {
    scan: 0.0,
    nodes: 0.7,
    labels: 1.3,
    pulses: 1.6,
    caption: 1.9,
    lift: 2.3,
    windowLabel: 3.0,
    domPop: 3.4,
    domToNet: 4.6,
    domToWindow: 6.0,
    domToRest: 7.5,
    say: 8.6,
    card: 9.8,
  };

  AFRAME.registerComponent('nep-sang-effect', {
    schema: {
      mode: { type: 'string', default: 'target' }, // 'target' | 'preview'
    },

    init() {
      this.t = 0;
      this.running = false;
      this.started = false;
      this.lostAt = 0;
      this.fired = new Set();

      this.root = new THREE.Group();
      this.el.object3D.add(this.root);
      this.build();
      this.apply(0);

      if (this.data.mode === 'target') {
        this.el.addEventListener('targetFound', () => {
          const longGone = performance.now() - this.lostAt > 2500;
          if (!this.started || longGone) this.restart();
          this.running = true;
          this.el.emit('nepsang-found');
        });
        this.el.addEventListener('targetLost', () => {
          this.running = false;
          this.lostAt = performance.now();
          this.el.emit('nepsang-lost');
        });
      }
    },

    restart() {
      this.t = 0;
      this.started = true;
      this.fired.clear();
      this.running = true;
    },

    stop() {
      this.running = false;
    },

    cue(name, at, fn) {
      if (this.t >= at && !this.fired.has(name)) {
        this.fired.add(name);
        fn();
      }
    },

    build() {
      const root = this.root;
      const cyanMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending });
      const glowCyan = glowTexture('rgba(255,255,255,1)', 'rgba(62,230,255,0.55)');
      const glowAmber = glowTexture('rgba(255,255,240,1)', 'rgba(255,190,40,0.6)');
      this.tex = { glowCyan, glowAmber };

      // --- 1. Quét trang: vạch sáng + 4 góc khung ---
      this.scanBar = new THREE.Mesh(
        new THREE.PlaneGeometry(1.04, 0.014),
        new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      this.scanBar.position.z = 0.01;
      root.add(this.scanBar);

      this.corners = new THREE.Group();
      const cornerMat = new THREE.MeshBasicMaterial({ color: C.amber, transparent: true, opacity: 0.95, depthWrite: false });
      const L = 0.09, w = 0.012;
      [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sy]) => {
        const cx = sx * 0.5, cy = sy * PAGE_H / 2;
        const h = new THREE.Mesh(new THREE.PlaneGeometry(L, w), cornerMat);
        h.position.set(cx - sx * L / 2, cy, 0.006);
        const v = new THREE.Mesh(new THREE.PlaneGeometry(w, L), cornerMat);
        v.position.set(cx, cy - sy * L / 2, 0.006);
        this.corners.add(h, v);
      });
      root.add(this.corners);

      // --- 2. Mạng nơ-ron Nếp Sáng nổi lên trên khung tranh đầu trang ---
      const net = new THREE.Group();
      net.position.z = 0.1;
      root.add(net);
      this.net = net;

      const inputs = [
        { label: 'Có ai trong phòng?', y: 0.585 },
        { label: 'Giờ trong ngày', y: 0.505 },
        { label: 'Nhiệt độ phòng', y: 0.425 },
        { label: 'Thói quen nhà mình', y: 0.345 },
      ].map((d) => ({ ...d, p: new THREE.Vector3(-0.1, d.y, 0) }));
      const hidden = [0.6, 0.53, 0.465, 0.4, 0.33].map((y) => ({ p: new THREE.Vector3(0.1, y, 0) }));
      const output = { p: new THREE.Vector3(0.31, 0.465, 0) };
      this.netNodes = { inputs, hidden, output };

      const nodeGeo = new THREE.SphereGeometry(0.017, 16, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: C.cyan });
      [...inputs, ...hidden].forEach((n) => {
        n.mesh = new THREE.Mesh(nodeGeo, nodeMat);
        n.mesh.position.copy(n.p);
        n.halo = glowSprite(glowCyan, 0.07, 0.6);
        n.halo.position.copy(n.p);
        net.add(n.mesh, n.halo);
      });
      output.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.03, 20, 16), new THREE.MeshBasicMaterial({ color: C.amber }));
      output.mesh.position.copy(output.p);
      output.halo = glowSprite(glowAmber, 0.16, 0.8);
      output.halo.position.copy(output.p);
      net.add(output.mesh, output.halo);

      this.edges = [];
      const edgeMat = cyanMat.clone();
      this.edgeMat = edgeMat;
      inputs.forEach((a) => hidden.forEach((b) => { const s = segment(a.p, b.p, 0.0022, edgeMat); net.add(s); this.edges.push(s); }));
      hidden.forEach((b) => { const s = segment(b.p, output.p, 0.0028, edgeMat); net.add(s); this.edges.push(s); });

      // xung tín hiệu chạy từ đầu vào tới Nếp Sáng
      this.pulses = [];
      const pulseGeo = new THREE.SphereGeometry(0.008, 10, 8);
      const pulseMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
      for (let i = 0; i < 12; i++) {
        const m = new THREE.Mesh(pulseGeo, pulseMat);
        const g = glowSprite(glowCyan, 0.045, 0.9);
        m.add(g);
        m.visible = false;
        net.add(m);
        this.pulses.push({ m, u: Math.random(), a: (i * 7) % 4, b: (i * 3) % 5, speed: 0.45 + Math.random() * 0.3 });
      }

      // nhãn đầu vào
      this.inputLabels = inputs.map((n) => {
        const lab = textPanel({
          width: 0.33, align: 'right', style: 'tag', pad: 22,
          lines: [{ text: n.label, size: 40, weight: 600 }],
        });
        lab.position.set(n.p.x - 0.03 - 0.165, n.p.y, 0.002); // nằm gọn trong mép trái trang
        net.add(lab);
        return lab;
      });
      this.outputLabel = textPanel({
        width: 0.28, align: 'center', style: 'tag', pad: 20, border: 'rgba(255,210,63,0.7)',
        lines: [
          { text: 'NẾP SÁNG', size: 52, weight: 800, color: C.amber, spacing: 2 },
          { text: 'bật vừa đủ', size: 36, weight: 600 },
        ],
      });
      this.outputLabel.position.set(output.p.x - 0.01, output.p.y - 0.115, 0.004);
      net.add(this.outputLabel);

      this.caption = textPanel({
        width: 0.86, align: 'center', style: 'card', pad: 26,
        lines: [{ text: 'Nếp Sáng học nhu cầu thật của từng nhà để chỉ bật vừa đủ, bớt lãng phí điện.', size: 40, weight: 600 }],
      });
      this.caption.position.set(0, 0.255, 0.004);
      net.add(this.caption);

      // --- 3. Ô cửa sổ méo bay lên khỏi trang ---
      const win = new THREE.Group();
      win.position.set(-0.235, 0.035, 0);
      root.add(win);
      this.win = win;
      const winTex = crookedWindowTexture();
      this.winPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.32, 0.32),
        new THREE.MeshBasicMaterial({ map: winTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      win.add(this.winPlane);
      this.winGhost = new THREE.Mesh(
        new THREE.PlaneGeometry(0.32, 0.32),
        new THREE.MeshBasicMaterial({ map: winTex, transparent: true, opacity: 0.25, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      this.winGhost.position.set(-0.235, 0.035, 0.003);
      root.add(this.winGhost);

      // chấm vàng lệch ở góc dưới phải
      this.dot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 18, 14), new THREE.MeshBasicMaterial({ color: C.amberDeep }));
      this.dot.position.set(0.06, -0.064, 0.012);
      this.dotGlow = glowSprite(glowAmber, 0.12, 0.9);
      this.dotGlow.position.copy(this.dot.position);
      win.add(this.dot, this.dotGlow);

      // tia sáng nối bản vẽ trên giấy với ô cửa đang nổi
      this.beams = [];
      const beamMat = new THREE.MeshBasicMaterial({ color: C.amber, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending });
      this.beamMat = beamMat;
      [[-0.12, 0.12], [0.12, 0.12], [-0.12, -0.12], [0.12, -0.12]].forEach(([dx, dy]) => {
        const b = segment(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1), 0.0025, beamMat);
        b.userData.off = [dx, dy];
        root.add(b);
        this.beams.push(b);
      });

      this.winLabel = textPanel({
        width: 0.46, align: 'center', style: 'card', pad: 22, border: 'rgba(255,210,63,0.7)',
        lines: [
          { text: 'Dấu riêng của Minh và Đốm', size: 42, weight: 800, color: C.amber },
          { text: 'ô cửa méo, chấm vàng lệch', size: 32, weight: 500 },
          { text: 'ở góc dưới bên phải', size: 32, weight: 500 },
        ],
      });
      this.winLabel.position.set(-0.24, -0.16, 0.16);
      root.add(this.winLabel);

      // --- 4. Đốm ---
      const dom = new THREE.Group();
      root.add(dom);
      this.dom = dom;
      const body = new THREE.Group();
      dom.add(body);
      this.domBody = body;
      body.add(glowSprite(glowCyan, 0.24, 0.75));
      body.add(glowSprite(glowAmber, 0.15, 0.9));
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.042, 28, 20), new THREE.MeshBasicMaterial({ color: '#ffd84a' }));
      body.add(core);
      const shine = new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 10), new THREE.MeshBasicMaterial({ color: '#fffbe6' }));
      shine.position.set(0.014, 0.018, 0.03);
      body.add(shine);
      const eyeGeo = new THREE.SphereGeometry(0.0078, 14, 10);
      const eyeMat = new THREE.MeshBasicMaterial({ color: '#1b1206' });
      const glintMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
      this.eyes = [-1, 1].map((s) => {
        const e = new THREE.Mesh(eyeGeo, eyeMat);
        e.position.set(s * 0.015, 0.004, 0.038);
        e.scale.set(1, 1.35, 0.6);
        const glint = new THREE.Mesh(new THREE.SphereGeometry(0.0026, 8, 6), glintMat);
        glint.position.set(0.003, 0.004, 0.006);
        e.add(glint);
        body.add(e);
        return e;
      });
      const cheekMat = new THREE.MeshBasicMaterial({ color: '#ff8a7a', transparent: true, opacity: 0.6, depthWrite: false });
      [-1, 1].forEach((s) => {
        const ch = new THREE.Mesh(new THREE.CircleGeometry(0.0065, 16), cheekMat);
        ch.position.set(s * 0.026, -0.009, 0.0335);
        body.add(ch);
      });
      const antMat = new THREE.MeshBasicMaterial({ color: '#ffcf33' });
      [-1, 1].forEach((s) => {
        const a = segment(new THREE.Vector3(s * 0.012, 0.036, 0.01), new THREE.Vector3(s * 0.026, 0.07, 0.012), 0.0025, antMat);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.007, 10, 8), antMat);
        tip.position.set(s * 0.027, 0.072, 0.012);
        body.add(a, tip);
      });

      // bụi sáng bay theo Đốm
      const N = 48;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
      geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
      this.sparks = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.022, map: glowAmber, vertexColors: true, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, sizeAttenuation: true,
      }));
      this.sparkData = Array.from({ length: N }, () => ({ life: 0, v: new THREE.Vector3(), p: new THREE.Vector3() }));
      this.sparkNext = 0;
      root.add(this.sparks);

      // vị trí các chặng bay của Đốm
      this.domPath = {
        start: new THREE.Vector3(0.225, 0.03, 0.02),
        popped: new THREE.Vector3(0.225, 0.05, 0.19),
        atNet: new THREE.Vector3(output.p.x, output.p.y - 0.005, 0.22),
        atWindow: new THREE.Vector3(-0.235 + 0.06, 0.035 - 0.064, 0.2), // đáp đúng vào chấm vàng lệch (kịch bản P04-K03)
        rest: new THREE.Vector3(0.27, -0.33, 0.18),
      };

      // --- 5. Bong bóng thoại ---
      this.bubbleLight = textPanel({
        width: 0.24, align: 'center', style: 'bubble', pad: 20, tail: 'left',
        lines: [{ text: 'Ánh sáng!', size: 46, weight: 800 }],
      });
      this.bubbleLight.position.set(0.3, 0.17, 0.2);
      root.add(this.bubbleLight);

      this.bubbleHome = textPanel({
        width: 0.6, align: 'center', style: 'bubble', pad: 24, tail: 'right',
        lines: [{ text: 'Nhà mình vẫn phải sáng chứ.', size: 44, weight: 800 }],
      });
      this.bubbleHome.position.set(-0.1, -0.265, 0.2);
      root.add(this.bubbleHome);

      // --- 6. Thẻ lý luận MLN122 ---
      this.card = textPanel({
        width: 0.92, style: 'card', pad: 30, stripe: C.amber,
        lines: [
          { text: 'MLN122 · CHƯƠNG 4', size: 30, weight: 700, color: C.cyan, spacing: 3, gapAfter: 6 },
          { text: 'Ý tưởng, dữ liệu và dấu riêng này là thành quả lao động của Minh và Đốm.', size: 38, weight: 600, gapAfter: 4 },
          { text: 'Hãy nhớ ô cửa méo này:', size: 36, weight: 700, color: C.amber },
          { text: 'nó sẽ xuất hiện lại trong sản phẩm của TRỤC.', size: 36, weight: 700, color: C.amber },
        ],
      });
      this.card.position.set(0, -0.53, 0.12);
      root.add(this.card);
    },

    emitSpark(at, spread) {
      const s = this.sparkData[this.sparkNext];
      this.sparkNext = (this.sparkNext + 1) % this.sparkData.length;
      s.life = 1;
      s.p.copy(at);
      s.v.set((Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread, (Math.random() - 0.2) * spread);
    },

    domPosition(t, out) {
      const P = this.domPath;
      const arc = (a, b, u, lift) => {
        out.lerpVectors(a, b, ease(u));
        out.z += Math.sin(Math.PI * ease(u)) * lift;
      };
      if (t < T.domPop) return out.copy(P.start);
      if (t < T.domToNet) return out.lerpVectors(P.start, P.popped, backOut(phase(t, T.domPop, 0.6)));
      if (t < T.domToWindow) { arc(P.popped, P.atNet, phase(t, T.domToNet, 1.1), 0.08); return out; }
      if (t < T.domToRest) { arc(P.atNet, P.atWindow, phase(t, T.domToWindow, 1.2), 0.1); return out; }
      arc(P.atWindow, P.rest, phase(t, T.domToRest, 1.0), 0.06);
      if (t > T.domToRest + 1.0) {
        const k = t - (T.domToRest + 1.0);
        out.x += Math.sin(k * 0.9) * 0.025;
        out.y += Math.sin(k * 1.3) * 0.012;
      }
      return out;
    },

    // Đặt toàn bộ cảnh theo thời điểm t (giây)
    apply(t) {
      const show = (obj, k) => { obj.visible = k > 0.001; return k; };

      // quét trang
      const scanK = phase(t, T.scan, 0.9);
      show(this.scanBar, scanK > 0 && scanK < 1 ? 1 : 0);
      this.scanBar.position.y = PAGE_H / 2 - scanK * PAGE_H;
      const cornerK = easeOut(phase(t, T.scan, 0.4));
      show(this.corners, cornerK);
      this.corners.scale.setScalar(0.6 + 0.4 * cornerK);
      this.corners.children[0].material.opacity = 0.55 + 0.4 * (0.5 + 0.5 * Math.sin(t * 3));

      // mạng nơ-ron
      const { inputs, hidden, output } = this.netNodes;
      [...inputs, ...hidden].forEach((n, i) => {
        const k = backOut(phase(t, T.nodes + i * 0.07, 0.35));
        n.mesh.scale.setScalar(Math.max(0.001, k));
        n.halo.visible = n.mesh.visible = k > 0.001;
      });
      const outK = backOut(phase(t, T.nodes + 0.75, 0.45));
      const flash = t > T.domToWindow - 0.1 ? Math.max(0, 1 - (t - (T.domToWindow - 0.1)) * 1.5) : 0;
      output.mesh.scale.setScalar(Math.max(0.001, outK * (1 + 0.5 * flash)));
      output.mesh.visible = outK > 0.001;
      output.halo.visible = output.mesh.visible;
      output.halo.scale.setScalar(0.16 * (1 + 0.12 * Math.sin(t * 4) + 1.4 * flash));
      this.edgeMat.opacity = 0.5 * ease(phase(t, T.nodes + 0.2, 0.8));
      this.edges.forEach((e) => { e.visible = this.edgeMat.opacity > 0.01; });

      const labK = ease(phase(t, T.labels, 0.5));
      this.inputLabels.forEach((l, i) => {
        const k = ease(phase(t, T.labels + i * 0.08, 0.4));
        show(l, k);
        l.material.opacity = k;
      });
      show(this.outputLabel, labK);
      this.outputLabel.material.opacity = labK;
      const capK = ease(phase(t, T.caption, 0.5));
      show(this.caption, capK);
      this.caption.material.opacity = capK;

      // ô cửa sổ méo
      const liftK = easeOut(phase(t, T.lift, 0.9));
      show(this.win, liftK);
      this.win.position.z = 0.004 + 0.15 * liftK;
      this.win.rotation.z = 0.04 * Math.sin(t * 0.8);
      this.win.rotation.x = -0.12 * liftK;
      this.winPlane.material.opacity = liftK;
      show(this.winGhost, liftK);
      const dotFlash = t > T.domToRest - 0.1 ? Math.max(0, 1 - (t - (T.domToRest - 0.1)) * 1.2) : 0;
      const dotPulse = 1 + 0.18 * Math.sin(t * 3.2) + 0.8 * dotFlash;
      this.dot.scale.setScalar(dotPulse);
      this.dotGlow.scale.setScalar(0.12 * dotPulse * (1 + dotFlash));
      this.beamMat.opacity = 0.35 * liftK * (0.7 + 0.3 * Math.sin(t * 5));
      this.beams.forEach((b) => {
        const [dx, dy] = b.userData.off;
        const top = this.win.position.z;
        b.visible = liftK > 0.02;
        b.position.set(-0.235 + dx, 0.035 + dy, top / 2);
        b.scale.set(1, Math.max(0.001, top), 1);
      });
      const wlK = ease(phase(t, T.windowLabel, 0.5));
      show(this.winLabel, wlK);
      this.winLabel.material.opacity = wlK;

      // Đốm
      const popK = phase(t, T.domPop, 0.6);
      show(this.dom, popK);
      this.domPosition(t, this.dom.position);
      // thu nhỏ lại khi đứng vào ô cửa, rồi lớn lại khi bay đi
      const shrink = ease(phase(t, T.domToWindow + 0.8, 0.4)) * (1 - ease(phase(t, T.domToRest, 0.4)));
      this.domBody.scale.setScalar(Math.max(0.001, backOut(popK) * (1 - 0.35 * shrink)));
      this.domBody.position.y = Math.sin(t * 2.4) * 0.008;
      this.domBody.rotation.z = Math.sin(t * 1.7) * 0.12;
      const blink = (t % 3.1) < 0.12 ? 0.15 : 1;
      this.eyes.forEach((e) => { e.scale.y = 1.35 * blink; });

      // bong bóng và thẻ
      const lightK = phase(t, T.domPop + 0.15, 0.25) * (1 - phase(t, T.domToNet + 0.3, 0.3));
      show(this.bubbleLight, lightK);
      this.bubbleLight.material.opacity = lightK;
      this.bubbleLight.scale.setScalar(0.8 + 0.2 * backOut(phase(t, T.domPop + 0.15, 0.3)));
      const sayK = ease(phase(t, T.say, 0.4));
      show(this.bubbleHome, sayK);
      this.bubbleHome.material.opacity = sayK;
      this.bubbleHome.scale.setScalar(0.85 + 0.15 * backOut(phase(t, T.say, 0.35)));
      const cardK = ease(phase(t, T.card, 0.6));
      show(this.card, cardK);
      this.card.material.opacity = cardK;
      this.card.position.y = -0.56 + 0.03 * cardK;
    },

    tick(time, dtMs) {
      if (!this.running) return;
      const dt = Math.min(0.1, (dtMs || 16) / 1000);
      this.t += dt;
      const t = this.t;

      // âm thanh theo mốc
      this.cue('scan', T.scan, () => Sound.play('scan'));
      [...this.netNodes.inputs, ...this.netNodes.hidden].forEach((_, i) => this.cue('node' + i, T.nodes + i * 0.07, () => Sound.play('node')));
      this.cue('lift', T.lift, () => Sound.play('lift'));
      this.cue('pop', T.domPop, () => {
        Sound.play('pop');
        for (let i = 0; i < 18; i++) this.emitSpark(this.domPath.popped, 0.5);
      });
      this.cue('net', T.domToWindow - 0.1, () => Sound.play('spark'));
      this.cue('dot', T.domToRest - 0.1, () => Sound.play('spark'));
      this.cue('say', T.say, () => Sound.play('warm'));

      this.apply(t);

      // xung tín hiệu
      const { inputs, hidden, output } = this.netNodes;
      const pulsesOn = t > T.pulses;
      const fast = t > T.domToWindow ? 1.8 : 1;
      const tmp = new THREE.Vector3();
      this.pulses.forEach((p) => {
        p.m.visible = pulsesOn;
        if (!pulsesOn) return;
        p.u += dt * p.speed * fast;
        if (p.u >= 1) {
          p.u -= 1;
          p.a = Math.floor(Math.random() * inputs.length);
          p.b = Math.floor(Math.random() * hidden.length);
        }
        const A = inputs[p.a].p, B = hidden[p.b].p, O = output.p;
        if (p.u < 0.5) tmp.lerpVectors(A, B, p.u * 2);
        else tmp.lerpVectors(B, O, (p.u - 0.5) * 2);
        p.m.position.copy(tmp);
      });

      // bụi sáng
      if (this.dom.visible && Math.random() < 0.6) {
        const at = this.dom.position.clone();
        at.x += (Math.random() - 0.5) * 0.04;
        at.y += (Math.random() - 0.5) * 0.04;
        this.emitSpark(at, 0.06);
      }
      const pos = this.sparks.geometry.attributes.position;
      const col = this.sparks.geometry.attributes.color;
      this.sparkData.forEach((s, i) => {
        if (s.life > 0) {
          s.life -= dt * 0.9;
          s.p.addScaledVector(s.v, dt);
          s.v.multiplyScalar(0.96);
        }
        const k = Math.max(0, s.life);
        pos.setXYZ(i, s.p.x, s.p.y, s.p.z);
        col.setXYZ(i, k, k * 0.85, k * 0.4);
      });
      pos.needsUpdate = true;
      col.needsUpdate = true;
    },
  });

  // điều khiển cho giao diện
  window.NepSang = {
    sound: Sound,
    component(id) {
      const el = document.getElementById(id);
      return el && el.components['nep-sang-effect'];
    },
  };
})();
