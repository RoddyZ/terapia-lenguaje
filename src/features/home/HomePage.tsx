import { Link } from 'react-router';
import { ALPHABET, VOWELS, WORDS } from '@/content/es';
import type { Tone } from '@/content/types';
import { VISEMES, type VisemeId } from '@/domain/phonetics';
import { masteredCount, type ActivityId } from '@/services/progress/progress';
import { useProgress } from '@/shared/di/hooks';
import { Mouth } from '@/shared/mouth/Mouth';
import { Stars } from '@/shared/ui/Stars';
import { toneStyle } from '@/shared/ui/tone';
import styles from './HomePage.module.css';

interface Activity {
  id: ActivityId;
  to: string;
  title: string;
  description: string;
  tone: Tone;
  viseme: VisemeId;
  total: number;
}

const ACTIVITIES: Activity[] = [
  {
    id: 'vowels',
    to: '/vocales',
    title: 'Vocales',
    description: 'a · e · i · o · u',
    tone: 'pink',
    viseme: 'a',
    total: VOWELS.length,
  },
  {
    id: 'alphabet',
    to: '/abecedario',
    title: 'Abecedario',
    description: 'Todas las letras',
    tone: 'blue',
    viseme: 'i',
    total: ALPHABET.length,
  },
  {
    id: 'syllables',
    to: '/silabas',
    title: 'Sílabas',
    description: 'Une letras: ma, pe, si…',
    tone: 'green',
    viseme: 'o',
    total: 25,
  },
  {
    id: 'words',
    to: '/palabras',
    title: 'Palabras',
    description: 'Ordena las sílabas',
    tone: 'yellow',
    viseme: 'u',
    total: WORDS.length,
  },
];

export function HomePage() {
  const [progress] = useProgress();

  return (
    <div>
      <section className={styles.hero}>
        <h1>¡Hola! ¿Qué aprendemos hoy?</h1>
        <p>Mira la boquita, escucha y repite.</p>
      </section>

      <ul className={styles.grid}>
        {ACTIVITIES.map((a, i) => (
          <li key={a.id} className={styles.item} style={{ animationDelay: `${i * 60}ms` }}>
            <Link to={a.to} className={styles.card} style={toneStyle(a.tone)}>
              <span className={styles.mouth}>
                <Mouth shape={VISEMES[a.viseme]} label="" />
              </span>
              <span className={styles.text}>
                <span className={styles.title}>{a.title}</span>
                <span className={styles.description}>{a.description}</span>
                <Stars value={masteredCount(progress, a.id)} max={a.total} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
