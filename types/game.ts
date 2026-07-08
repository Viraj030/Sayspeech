export type ScreenType =
  | 'welcome'
  | 'story'
  | 'story-items'
  | 'drag'
  | 'quiz'
  | 'vocabulary'
  | 'sentence'
  | 'object-function'
  | 'sequence'
  | 'completion'
  | 'receptive-scene';

export interface BaseScreen {
  id: string;
  type: ScreenType;
  slideNumber: number;
}

export interface WelcomeScreen extends BaseScreen {
  type: 'welcome';
  title: string;
  description: string;
}

export interface DialogueBubble {
  id: string;
  speaker: 'mom' | 'kid' | 'instruction';
  text: string;
  position: {
    top: number;
    left: number;
  };
  tailDirection: 'left' | 'right' | 'up' | 'down' | 'down-left' | 'down-right' | 'up-left' | 'up-right';
  showAfterSolve?: boolean;
}

// ── Story screen (narrative, no interaction) ──────────────────────────────────
export interface OverlayImage {
  src: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface StoryScreenData extends BaseScreen {
  type: 'story';
  image: string;
  dialogues?: DialogueBubble[];
  leftPanelImage?: string;
  initialOverlays?: OverlayImage[];
  bottomItems?: { id: string; image: string; label: string }[];
  showBottomLabels?: boolean;
}


// ── Story-Items screen (story + static ingredient labels at bottom) ────────────
export interface StoryItem {
  id: string;
  label: string;
  image: string;
}

export interface StoryItemsScreenData extends BaseScreen {
  type: 'story-items';
  image: string;
  dialogues?: DialogueBubble[];
  items: StoryItem[];
}

// ── Drag screen (single interaction) ─────────────────────────────────────────
export interface DragOption {
  id: string;
  label: string;
  image: string;
}

export interface DragTarget {
  id: string;
  label: string;
  image: string;
}

export interface DragScreenData extends BaseScreen {
  type: 'drag';
  instruction: string;
  backgroundImage: string;
  /** Current state overlays already on the tawa (previous steps) */
  initialOverlays?: { src: string; top: number; left: number; width: number; height: number }[];
  /** All draggable options shown in the bottom tray */
  options: DragOption[];
  correctOptionId: string;
  targetArea: DragTarget;
  /** Where the dropped item lands on the tawa (% of the background image) */
  dropTargetPos?: { top: number; left: number; width: number; height: number };
  dialogues?: DialogueBubble[];
  leftPanelImage?: string;
  successTransitionImage?: string;
  nextOverlays?: OverlayImage[];
  nextBackgroundImage?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizScreenData extends BaseScreen {
  type: 'quiz';
  question: string;
  options: QuizOption[];
  explanation?: string;
}

export interface VocabularyOption {
  id: string;
  label: string;
  image: string;
}

export interface VocabularyScreenData extends BaseScreen {
  type: 'vocabulary';
  instruction: string;
  correctOptionId: string;
  options: VocabularyOption[];
}

export interface SentenceScreenData extends BaseScreen {
  type: 'sentence';
  instruction: string;
  words: string[];
  correctOrder: string[];
}

export interface ObjectFunctionQuestion {
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
}

export interface ObjectFunctionScreenData extends BaseScreen {
  type: 'object-function';
  image: string;
  objectName: string;
  questions: ObjectFunctionQuestion[];
  customImageHeight?: string;
  imageClassName?: string;
}

export interface SequenceItem {
  id: string;
  image: string;
  label: string;
  order: number;
}

export interface SequenceScreenData extends BaseScreen {
  type: 'sequence';
  instruction: string;
  items: SequenceItem[];
}

export interface CompletionScreenData extends BaseScreen {
  type: 'completion';
  title: string;
  subtitle: string;
}

export interface Hotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ReceptiveSceneScreenData extends BaseScreen {
  type: 'receptive-scene';
  backgroundImage: string;
  instruction: string;
  correctHotspotId: string;
  hotspots: Hotspot[];
}

export type GameScreen =
  | WelcomeScreen
  | StoryScreenData
  | StoryItemsScreenData
  | DragScreenData
  | QuizScreenData
  | VocabularyScreenData
  | SentenceScreenData
  | ObjectFunctionScreenData
  | SequenceScreenData
  | CompletionScreenData
  | ReceptiveSceneScreenData;
