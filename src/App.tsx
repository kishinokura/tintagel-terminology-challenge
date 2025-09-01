import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function App() {
  const [lang, setLang] = useState<'en' | 'ja'>(() => (localStorage.getItem('ttc.lang') as 'en' | 'ja') || 'en')
  const [muted, setMuted] = useState(() => localStorage.getItem('ttc.muted') === '1')

  useEffect(() => {
    // Allow ?lang=en|ja to preselect language (for Discord / links)
    const params = new URLSearchParams(location.search)
    const qLang = params.get('lang')
    if (qLang === 'ja' || qLang === 'en') {
      setLang(qLang)
      localStorage.setItem('ttc.lang', qLang)
    }
  }, [])

  useEffect(() => localStorage.setItem('ttc.lang', lang), [lang])
  useEffect(() => localStorage.setItem('ttc.muted', muted ? '1' : '0'), [muted])

  const DATA = useMemo(() => [
    t('Vor', 'Taking the initiative so the foe must react.', '先手を取り主導権を握る。相手を反応に追い込む。', 'Timing & Initiative'),
    t('Indes', 'Acting in-the-instant; keep/regain initiative in the bind.', '瞬間に行動し、バインド中の主導権を保つ/取り返す。', 'Timing & Initiative'),
    t('Nach', 'Acting after; being in a reactive role.', '相手の後で動く反応的な立場。', 'Timing & Initiative'),
    t('Fühlen', 'Awareness in the fight (pressure, distance, stance, balance, grip, breath).', '戦いの全体状況の感覚（剣圧・距離・姿勢・重心・握り・呼吸）。', 'Awareness & Leverage'),
    t('Stark', 'Strong bind: contact nearer your hilt.', '強いバインド：接触点が柄に近い。', 'Awareness & Leverage'),
    t('Schwach', 'Weak bind: contact nearer your point.', '弱いバインド：接触点が剣先に近い。', 'Awareness & Leverage'),
    t('Vier Blößen', 'The four openings.', '四つの開口部。', 'Targets & Measure'),
    t('Länge', 'Distance / reach.', '間合い・リーチ。', 'Targets & Measure'),
    t('Maße', 'Proper measure / proportion (time & space).', '正しい計測（間と時）。', 'Targets & Measure'),
    t('Zufechten', 'Onset: closing in & first attack.', '攻撃開始の接近段階と最初の攻撃。', 'Phases'),
    t('Krieg', 'War: middle phase where blades bind & techniques flow.', '主戦局面：バインド内で技が競り合う段階。', 'Phases'),
    t('Abzug', 'Withdrawal: safe exit & disengage.', '離脱：攻防後に安全に下がる。', 'Phases'),
    t('Vom Tag', 'High roof guard; strike down.', '上段構え。斬り下ろす。', 'Vier Leger'),
    t('Ochs', 'High thrusting guard with point forward.', '高い突き構え（剣先を相手へ）。', 'Vier Leger'),
    t('Pflug', 'Low thrusting guard with point forward.', '低い突き構え（剣先を相手へ）。', 'Vier Leger'),
    t('Alber', "Low 'fool' guard; invitation.", '低い誘いの構え。', 'Vier Leger'),
    t('Zornhau', 'Wrath-cut: break basic strikes while threatening to hit or thrust.', '怒りの斬り：相手の基本打を破りつつ打突を脅かす。', 'Meisterhäue'),
    t('Krumphau', 'Crooked-cut; breaks Ochs.', '曲線の斬り。オックスを破る。', 'Meisterhäue'),
    t('Zwerchhau', 'Thwart-cut; breaks Vom Tag.', '横の斬り。フォムタークを破る。', 'Meisterhäue'),
    t('Schielhau', 'Squinting-cut; breaks Pflug.', '目くらましの斬り。フルークを破る。', 'Meisterhäue'),
    t('Scheitelhau', 'Parting-cut downward on the crown; breaks Alber.', '頭頂へ割り込む斬り。アルバーを破る。', 'Meisterhäue'),
    t('Abschneiden', 'Slicing off at the hands/arms.', '手や腕を切り落とす。', 'Tactics'),
    t('Absetzen', 'Setting-aside thrust.', '攻撃を逸らしながら突く。', 'Tactics'),
    t('Durchlaufen', 'Running through; body displacement.', '駆け抜ける（体さばき）。', 'Tactics'),
    t('Durchwechseln', 'Change-through under the blade.', '剣線下の切り替え。', 'Tactics'),
    t('Hände Drücken', 'Pressing the hands in close play.', '至近距離で相手の手を押し込む。', 'Tactics'),
    t('Hängen', 'Hanging guard/hold.', '吊り構え。', 'Tactics'),
    t('Nachreisen', 'Travel-after pursuing strike.', '追い討ち・追撃。', 'Tactics'),
    t('Schnappen', "Snapping: return attack using opponent's power.", '相手の力を利用して返す打ち。', 'Tactics'),
    t('Überlaufen', 'Over-running above the blade to out-reach.', '上から制圧して射程を超える。', 'Tactics'),
    t('Versetzen', 'Displacing: shift the blade off-line.', '剣線をずらす。', 'Tactics'),
    t('Winden', 'Eight windings into Ochs/Pflug; leverage in the bind.', '8種の巻き（高位オックス4・低位フルーク4）。', 'Tactics'),
    t('Zucken', 'Twitching; sudden pull-snap.', '引き抜き。素早いスナップ。', 'Tactics'),
  ], [])

  const [idx, setIdx] = useState(0)
  const [shuffled, setShuffled] = useState(() => shuffle([...DATA]))
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(() => parseInt(localStorage.getItem('ttc.bestStreak') || '0', 10))
  const [lives, setLives] = useState(3)
  const [answered, setAnswered] = useState<null | { correct: boolean; choice: string; timeMs: number }>(null)
  const [startMs, setStartMs] = useState<number>(Date.now())
  const [progress, setProgress] = useState<{ seen: string[]; wrong: string[] }>(() => {
    try { return JSON.parse(localStorage.getItem('ttc.progress') || '') } catch { return { seen: [], wrong: [] } }
  })

  useEffect(() => localStorage.setItem('ttc.progress', JSON.stringify(progress)), [progress])
  useEffect(() => localStorage.setItem('ttc.bestStreak', String(bestStreak)), [bestStreak])

  const DURATION_MS = 16000
  const [timeLeft, setTimeLeft] = useState(DURATION_MS)
  useEffect(() => {
    setTimeLeft(DURATION_MS)
    const int = setInterval(() => setTimeLeft(t => Math.max(0, t - 100)), 100)
    return () => clearInterval(int)
  }, [idx])

  useEffect(() => {
    if (timeLeft === 0 && !answered) handleAnswer('__timeout__')
  }, [timeLeft, answered])

  const q = shuffled[idx]
  const options = useMemo(() => makeChoices(q, shuffled), [q, shuffled])

  const sndOk = useSound(420, 0.04)
  const sndBad = useSound(160, 0.06)
  const sndNext = useSound(620, 0.03)

  function handleAnswer(choice: string) {
    if (answered) return
    const timeMs = Math.max(1, DURATION_MS - timeLeft)
    const correct = choice === q.term
    if (!muted) { (choice === '__timeout__') ? sndBad() : (correct ? sndOk() : sndBad()) }
    const speedScore = Math.ceil((DURATION_MS - timeMs) / 250)
    const delta = correct ? 10 + speedScore + streak * 2 : 0
    setAnswered({ correct, choice, timeMs })
    setScore(s => s + delta)
    setStreak(st => (correct ? st + 1 : 0))
    setBestStreak(b => (correct ? Math.max(b, streak + 1) : b))
    setLives(L => (correct ? L : Math.max(0, L - 1)))
    setProgress(p => ({ seen: [...new Set([...p.seen, q.term])], wrong: correct ? p.wrong : [...new Set([...p.wrong, q.term])] }))
  }

  function nextQuestion() {
    setAnswered(null)
    if (idx + 1 >= shuffled.length || lives === 0) {
      setShuffled(shuffle([...DATA])); setIdx(0); setLives(3); setScore(0); setStreak(0); setStartMs(Date.now()); if (!muted) sndNext(); return
    }
    setIdx(i => i + 1); setStartMs(Date.now()); if (!muted) sndNext()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') setLang(l => (l === 'en' ? 'ja' : 'en'))
      if (e.key === 'm' || e.key === 'M') setMuted(m => !m)
      if (e.key === ' ' && answered) nextQuestion()
      if (!answered && ['1','2','3','4'].includes(e.key)) handleAnswer(options[parseInt(e.key, 10) - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answered, options])

  const elapsed = Math.round((Date.now() - startMs) / 1000)

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl flex flex-col md:flex-row md:items-end md:justify-between gap-3 mt-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tintagel Terminology Challenge</h1>
          <p className="text-sm text-neutral-600">Keyboard: [1–4]=answer • [Space]=next • [T]=toggle language • [M]=mute</p>
        </div>
        <div className="flex items-center gap-2">
          <Toggle label="日本語 / EN" on={lang === 'ja'} setOn={(v) => setLang(v ? 'ja' : 'en')} />
          <Toggle label={muted ? 'Muted' : 'Sound'} on={!muted} setOn={(v) => setMuted(!v)} />
        </div>
      </header>

      <main className="w-full max-w-4xl mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <Stat label={lang === 'ja' ? 'スコア' : 'Score'} value={score} />
          <Stat label={lang === 'ja' ? '連続正解' : 'Streak'} value={`${streak} (best ${bestStreak})`} />
          <Stat label={lang === 'ja' ? '残りライフ' : 'Lives'} value={lives} />
          <Stat label={lang === 'ja' ? '経過時間' : 'Elapsed'} value={`${elapsed}s`} />
        </div>

        {lives === 0 ? (
          <GameOverPanel lang={lang} onRestart={nextQuestion} progress={progress} DATA={DATA} />
        ) : (
          <QuestionCard
            q={q}
            lang={lang}
            options={options}
            timeLeft={timeLeft}
            duration={DURATION_MS}
            answered={answered}
            onAnswer={handleAnswer}
            onNext={nextQuestion}
          />
        )}

        <ProgressStrip seen={progress.seen.length} total={DATA.length} wrong={progress.wrong.length} lang={lang} />
      </main>

      <footer className="mt-10 mb-6 text-xs text-neutral-500 text-center max-w-3xl">
        <p>{lang === 'ja'
            ? '学習モード：短い問題、即時フィードバック、進捗の可視化。誤答は自動的に復習対象になります。'
            : 'Learning mode: short questions, instant feedback, progress visualization. Missed items are automatically queued for review.'}
        </p>
      </footer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  )
}

function Toggle({ label, on, setOn }: { label: string; on: boolean; setOn: (v: boolean) => void }) {
  return (
    <button onClick={() => setOn(!on)} className={`px-3 py-2 rounded-2xl shadow text-sm border ${on ? 'bg-emerald-100 border-emerald-300' : 'bg-white border-neutral-300'}`}>
      {label}
    </button>
  )
}

type Answered = null | { correct: boolean; choice: string; timeMs: number }

function QuestionCard({ q, lang, options, timeLeft, duration, answered, onAnswer, onNext } : {
  q: Term; lang: 'en' | 'ja'; options: string[]; timeLeft: number; duration: number; answered: Answered; onAnswer: (c: string)=>void; onNext: ()=>void
}) {
  const pct = Math.max(0, Math.min(100, Math.round((timeLeft / duration) * 100)))
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
      <div className="mb-2 text-sm text-neutral-500">{lang === 'ja' ? q.categoryJa : q.category}</div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{q.term}</h2>
        <div className="w-full md:w-72 h-3 bg-neutral-200 rounded-full overflow-hidden" aria-label="timer">
          <div className={`h-full ${pct > 40 ? 'bg-emerald-400' : pct > 20 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <p className="mt-4 text-neutral-700 text-base md:text-lg">{lang === 'ja' ? q.ja : q.en}</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const isChosen = answered?.choice === opt
          const isCorrect = answered ? opt === q.term : false
          const base = 'w-full text-left p-4 rounded-2xl border shadow focus:outline-none'
          const style = !answered ? 'bg-white hover:bg-neutral-50 border-neutral-300'
            : isCorrect ? 'bg-emerald-50 border-emerald-400'
            : isChosen ? 'bg-rose-50 border-rose-400'
            : 'bg-white border-neutral-200 opacity-60'
          return (
            <button key={opt} onClick={() => onAnswer(opt)} className={`${base} ${style}`}>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-800 text-white text-sm font-semibold">{i + 1}</span>
                <span className="text-lg font-semibold">{opt}</span>
              </div>
            </button>
          )
        })}
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
        {answered ? (
          <div>
            {answered.correct ? (<span>{lang === 'ja' ? '正解！スペースで次へ' : 'Correct! Press Space for next.'}</span>)
              : (<span>{lang === 'ja' ? '不正解：' : 'Incorrect:'} {answered.choice} → {lang === 'ja' ? '正解は' : 'Answer:'} {q.term}</span>)}
          </div>
        ) : (<span>{lang === 'ja' ? '1〜4で選択' : 'Choose with 1–4'}</span>)}
        <button onClick={onNext} className='px-3 py-2 rounded-2xl border border-neutral-300 bg-white shadow'>{lang === 'ja' ? '次へ' : 'Next'}</button>
      </div>
    </div>
  )
}

function GameOverPanel({ lang, onRestart, progress, DATA }: any) {
  const missed = DATA.filter((d: Term) => progress.wrong.includes(d.term))
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{lang === 'ja' ? 'ゲーム終了' : 'Game Over'}</h2>
      <p className="text-neutral-700">{lang === 'ja' ? '間違えた用語を復習しましょう。' : 'Review the items you missed, then restart for another short run.'}</p>
      {missed.length > 0 ? (
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {missed.map((m: Term) => (
            <li key={m.term} className='p-3 border rounded-xl bg-amber-50 border-amber-300'>
              <div className='font-semibold'>{m.term}</div>
              <div className='text-sm text-neutral-700'>{lang === 'ja' ? m.ja : m.en}</div>
            </li>
          ))}
        </ul>
      ) : (<p className='mt-4 text-neutral-700'>{lang === 'ja' ? '素晴らしい！全問正解に近いです。' : 'Excellent—nearly perfect!'}</p>)}
      <div className='mt-6'><button onClick={onRestart} className='px-4 py-2 rounded-2xl border border-neutral-300 bg-white shadow'>{lang === 'ja' ? 'もう一度' : 'Play Again'}</button></div>
    </div>
  )
}

function ProgressStrip({ seen, total, wrong, lang } : { seen: number; total: number; wrong: number; lang: 'en' | 'ja' }) {
  const pct = Math.round((seen / total) * 100)
  return (
    <div className='mt-6'>
      <div className='text-sm text-neutral-600 mb-1'>
        {lang === 'ja' ? '学習進捗' : 'Learning Progress'} — {seen}/{total} ({pct}%), {lang === 'ja' ? '要復習' : 'Review'}: {wrong}
      </div>
      <div className='h-2 w-full bg-neutral-200 rounded-full overflow-hidden'>
        <div className='h-full bg-neutral-800' style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function t(term: string, en: string, ja: string, category: string): Term {
  return { term, en, ja, category, categoryJa: CATEGORY_JA[category] || category }
}

const CATEGORY_JA: Record<string, string> = {
  'Timing & Initiative': 'タイミングと主導権',
  'Awareness & Leverage': '感覚とテコの原理',
  'Targets & Measure': '的と間合い・計測',
  'Phases': '戦闘の段階',
  'Vier Leger': '四つの構え',
  'Meisterhäue': '名手の斬撃',
  'Tactics': '戦術と基礎技術',
}

function makeChoices(q: Term, pool: Term[], n = 4) {
  const others = pool.filter(x => x.term !== q.term)
  const picks = shuffle(others).slice(0, n - 1).map(x => x.term)
  return shuffle([q.term, ...picks])
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function useSound(freq: number, dur: number) {
  const ctxRef = useRef<AudioContext | null>(null)
  useEffect(() => {
    if (typeof window !== 'undefined' && !ctxRef.current) {
      const Ctx: typeof AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext
      if (Ctx) ctxRef.current = new Ctx()
    }
  }, [])
  return () => {
    if (!ctxRef.current) return
    const ctx = ctxRef.current
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'square'; o.frequency.value = freq; g.gain.value = 0.04
    o.connect(g); g.connect(ctx.destination)
    o.start(); o.stop(ctx.currentTime + dur)
  }
}

type Term = {
  term: string
  en: string
  ja: string
  category: string
  categoryJa: string
}
