export function snow() {
  const n: number = 999; // количество снежинок
  const speed: number = 3; // скорость
  const wind: number = 500; // наклон снежинок
  const windVariance: number = 1.5; // отклонение снежинок
  const c: HTMLCanvasElement = document.getElementById(
    "bg-img",
  ) as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = c.getContext("2d")!;
  let cw: number = (c.width = c.offsetWidth);
  let ch: number = (c.height = 500);
  const img: HTMLImageElement = new Image();
  img.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAulBMVEVHcEz////+/v7////+/v79/f3////x8fH9/f3+/v7+/v7////+/v7////////////////////////////////////////////////+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+MnUWcAAAAPnRSTlMACQ4GBAoWAQMCDRMQJSIfOlQICxgdSkFyG09hXDcrKUeMLZKgsmmnPoIaL2aHWH4xbaw0d0S8wXu3m5cymMmy7QsAAAVDSURBVHgBzZd3g6JKEMQP99BbzoSYs5jFHDbq9/9ar6qb4aHLxr+uX7jYP6pqmKHn179VGa37sDLyO1/u/aW9f1C/tfAzYr4GYa+23sVLMF9h8OFhd6lkWZZt2/h/qSQMCvmEQNt/+ES0eg4qlUo5KcfxPMvib3+KwOPZz+5UNpv9GxZ+CggZnyDon+JtL4XudDpdDitNCBCwEmbxTgBID97xeHSXF41KQapSqTTKZTBSjk3E72SCAJCe5aXwdHbnc6by+UJlAR1AeEZFAgL9EOA57K8Ucrle1/cDlu/3cjkwFGFzSeTNeBsB+m3tz+d6fnA+dIqszuEc+D0gGjSS9ZAmjdz/yrwFiIEy+wN0z2a12ulUq81mxc6ZCBgBwrETfWS4BBYFNPK57hbtp361Wm028b/+qWYQDfrwiKCPWwATSC8KeH6nWOtXm67rrtdr1wWlbxANRqEiqOEWkKKAnn9gv+u22y2pdttVROAzChFhqYbMdQSOJNDbdmb9prtut5aTyW63myyXLUHMioeAPpCEEO6o4RYAB91z8VR112jf1etHVL2+A2LdrJ5mRfgAIa0EJhkH2BqBLwLay139+LTZzOfzzdNREC59HEJC1ivRxK0CRhAQsG5Ndsen+Wo1GAxWKzCIgIiIIEn+ZgoJgFpVBKB/MJQaAHGsT1prVwg5SdKhiY8Axw36X19Yr0RAhBLOXRAogSuRiS8jQ8znQgAEDIaXEWo6GhGhhCZy2NIEcyQgc/0elAshYCKAl9F0ut/vp9PRCwlw4Tb7M5pYpNVDBMhEAN8AVoPXEdrHqD0IryDsllgLlYClZIyxEO6wjgyhe5j1xcJqCAD6n5+fx2PVcKSJU/HQzf3v4Wo3Sop4kZrr5Q4WXgh4fnh4AGIPwuqpTgmzDj0o4P4a4EQhtHbH+eACAPofH4GAhldKQArigesQBzAEXcgcPTAEhDiajp/RTwJyEAni4cwQuJBXAB5pXMheIB4YwgssAIASCcPBhh6wDt1bAD2Q4PxNV3K+8YAQmEEEeAVg8iHgDhIQ41YlbFYxD2EIBpB7A5AvCyWUIwlPRkIsxbgCz7oGyLnopcxKtkMJJLA/buGcAIjtqHgKF32X0B+9CM0+VsEA9FWOr4SHU8VI4EKQAAQ2BB086asY9Pgi2SXZC/GiBLMQ3BDHDQmjKYvv8oYvUrXWCXKFchKAO6IUe59pAjviZYRiPx0wgo7PveDEt0L8aNQ9qVsKK8Fj5XK58FChgDUiQIaNhAz1ZVAPfBd0V/Ng4sk2YH892s4EwMEtQHc1Pw/YETShZ+t8hQqPxaY4YAQez0TT+OZ01uMdBDnecb4/PbE/dp6YvZjgwYOE6Hxv8wPD2u3YHwpIdhDf1QuYOHdq/Ma18JFCLVvSTwFcg6wNB8mTin5l9SMnX+l1u43mdnvNfp5nZismAbgpS3ZsUCCi6bKa8nXsBL08IqSDhAjMsWBzVCEhOBRnNc4aMmic5APNBLAGpUQBGiNnDRIwbPhnjEpm2MHAFIiBv3oWJANEg+V50by1PRw6HLg6ncPWlwFBBHwMgAtOnGUOjDLxbbfbANOaGZQcAmjhI4IOnUCAIaUD4yKacbgTk1PQsddCEBx7G2Tk0YyZlXMvB072y1ZOJpjB23IgAkbKjUajwlpczbz3H96b7nnzsGwgyDClk7stApjhBwhzfdD7gyk+nZP/Z/3GB0RQhm17nqPl2XZJp+XPAGY9yOAdSquEbrZzRPwKgCrkHkaMFrvjd5/PEfFrJJvNRfK7d1lzk9X6+ZWY19t/sP4DoePqp9agWnMAAAAASUVORK5CYII=";
  interface Particle {
    size: number;
    dur: number;
    alpha: number;
    x: number;
    y: number;
    progress: number;
    update: () => void;
    draw: () => void;
  }

  const particles: Particle[] = [];

  function createParticle(index: number): Particle {
    const size = rand(5, 10);
    const dur = (15 - size) / speed;
    const alpha = rand(0.25, 0.75);
    const x = rand(0, cw);
    let y = -size;
    let progress = 0;

    if (index < n / 100) {
      y = -rand(150, 200);
    } else if (index < n / 10) {
      y = -rand(19, 33);
    }

    return {
      size,
      dur,
      alpha,
      x,
      y,
      progress,
      update: function () {
        this.progress += 1 / (60 * this.dur); // 60 FPS
        if (this.progress > 1) {
          this.progress = 0;
          this.y = -this.size; // Сбросить позицию
          this.x = rand(0, cw);
        }
        this.y += (ch + this.size) / (60 * this.dur); // Обновить позицию
      },
      draw: function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(
          img,
          -this.size / 2,
          -this.size / 2,
          this.size,
          this.size,
        );
        ctx.restore();
      },
    };
  }

  function rand(min: number = 0, max: number = 1): number {
    return min + (max - min) * Math.random();
  }

  function createParticles() {
    for (let i = 0; i < n; i++) {
      particles.push(createParticle(i));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, cw, ch);
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", function () {
    cw = c.width = c.offsetWidth;
    ch = c.height = 500;
  });

  img.onload = function () {
    createParticles();
    animate();
  };
}
