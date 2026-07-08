import { Howl } from 'howler';

let correctSound: Howl | null = null;
let wrongSound: Howl | null = null;
let clickSound: Howl | null = null;

if (typeof window !== 'undefined') {
  try {
    correctSound = new Howl({
      src: ['/sounds/correct.mp3'],
      html5: true,
      onloaderror: () => console.warn('[Sound Engine] correct.mp3 not found, continuing silently.'),
      onplayerror: () => console.warn('[Sound Engine] Failed to play correct.mp3')
    });

    wrongSound = new Howl({
      src: ['/sounds/wrong.mp3'],
      html5: true,
      onloaderror: () => console.warn('[Sound Engine] wrong.mp3 not found, continuing silently.'),
      onplayerror: () => console.warn('[Sound Engine] Failed to play wrong.mp3')
    });

    clickSound = new Howl({
      src: ['/sounds/click.mp3'],
      html5: true,
      onloaderror: () => console.warn('[Sound Engine] click.mp3 not found, continuing silently.'),
      onplayerror: () => console.warn('[Sound Engine] Failed to play click.mp3')
    });
  } catch (e) {
    console.warn('[Sound Engine] Failed to initialize Howler:', e);
  }
}

export function playSound(type: 'correct' | 'wrong' | 'click') {
  console.log(`[Sound Engine] Trigger playSound('${type}')`);
  if (typeof window === 'undefined') return;

  try {
    if (type === 'correct' && correctSound) {
      correctSound.play();
    } else if (type === 'wrong' && wrongSound) {
      wrongSound.play();
    } else if (type === 'click' && clickSound) {
      clickSound.play();
    }
  } catch (err) {
    console.warn(`[Sound Engine] Error trying to play '${type}' sound:`, err);
  }
}
