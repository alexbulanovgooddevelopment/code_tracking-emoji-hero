document.addEventListener("DOMContentLoaded", () => {
  // Без анимаций страница остаётся обычным статичным потоком
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const EMOJI_MAX_DISPLACEMENT = 50;
  const FACE_MAX_DISPLACEMENT = 75;

  const hero = document.querySelector(".hero");
  const events = document.querySelector(".events");
  const tracker = document.querySelector(".tracker");
  const emoji = document.querySelector(".emoji");
  const emojiFace = document.querySelector(".emoji-face");

  if (!hero || !events || !tracker || !emoji || !emojiFace) return;

  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  gsap.to(hero, {
    y: 250,
    scale: 0.75,
    rotation: -15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: () => `+=${window.innerHeight + events.offsetHeight * 0.25}`,
      scrub: 1,
      pin: true,
      pinSpacing: false,
    },
  });

  gsap.fromTo(
    events,
    { x: -100, scale: 0.3, rotation: 15 },
    {
      x: 0,
      scale: 1,
      rotation: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: events,
        start: "top 200%",
        end: "top 50%",
        scrub: 1,
      },
    },
  );

  const quickToConfig = { duration: 0.35, ease: "power3.out" };
  const emojiX = gsap.quickTo(emoji, "x", quickToConfig);
  const emojiY = gsap.quickTo(emoji, "y", quickToConfig);
  const faceX = gsap.quickTo(emojiFace, "x", quickToConfig);
  const faceY = gsap.quickTo(emojiFace, "y", quickToConfig);

  function moveEmoji(normX, normY) {
    emojiX(normX * EMOJI_MAX_DISPLACEMENT);
    emojiY(normY * EMOJI_MAX_DISPLACEMENT);
    faceX(normX * FACE_MAX_DISPLACEMENT);
    faceY(normY * FACE_MAX_DISPLACEMENT);
  }

  hero.addEventListener("pointermove", ({ clientX, clientY }) => {
    const rect = tracker.getBoundingClientRect();

    moveEmoji(
      (clientX - (rect.left + rect.width / 2)) / rect.width,
      (clientY - (rect.top + rect.height / 2)) / rect.height,
    );
  });

  // Те же quickTo, что и при движении: отдельный твин спорил бы с ними
  hero.addEventListener("pointerleave", () => moveEmoji(0, 0));
});
