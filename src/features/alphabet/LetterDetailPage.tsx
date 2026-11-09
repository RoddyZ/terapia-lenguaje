import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ALPHABET, findLetter } from '@/content/es';
import { useProgress } from '@/shared/di/hooks';
import { Mouth } from '@/shared/mouth/Mouth';
import { useTalkingMouth } from '@/shared/mouth/useTalkingMouth';
import { Button } from '@/shared/ui/Button';
import { LetterGlyph } from '@/shared/ui/LetterGlyph';
import { PageHeader } from '@/shared/ui/PageHeader';
import { toneStyle } from '@/shared/ui/tone';
import styles from './LetterDetailPage.module.css';

export function LetterDetailPage() {
  const { letterId = '' } = useParams();
  const letter = findLetter(letterId);
  const { shape, say, playing } = useTalkingMouth(letter?.viseme);
  const [, progress] = useProgress();

  // Al llegar a la letra, la boca hace su movimiento una vez.
  useEffect(() => {
    if (letter) void say(letter.name, { visemes: ['rest', letter.viseme], endAtRest: false });
  }, [letter, say]);

  if (!letter) {
    return (
      <div>
        <PageHeader title="Letra no encontrada" backTo="/abecedario" />
        <Link to="/abecedario">Ver todas las letras</Link>
      </div>
    );
  }

  const index = ALPHABET.indexOf(letter);
  const prev = ALPHABET[index - 1];
  const next = ALPHABET[index + 1];

  const sayLetter = () => {
    void say(letter.name, { visemes: ['rest', letter.viseme], endAtRest: false });
    progress.record('alphabet', letter.id, true);
  };

  return (
    <div style={toneStyle(letter.tone)}>
      <PageHeader
        title={`Letra ${letter.upper}`}
        subtitle={`Se llama «${letter.name}»`}
        backTo="/abecedario"
      />

      <section className={styles.stage}>
        <div className={styles.mouthWrap} data-playing={playing}>
          <Mouth shape={shape} label={`Boca para la letra ${letter.name}`} />
        </div>
        <div className={styles.info}>
          <p className={styles.glyph}>
            <LetterGlyph letter={letter} />
          </p>
          <p className={styles.tip}>{letter.tip}</p>
          <Button size="lg" icon="🔊" onClick={sayLetter}>
            Escuchar
          </Button>
        </div>
      </section>

      <h2 className={styles.examplesTitle}>Palabras con {letter.lower}</h2>
      <ul className={styles.examples}>
        {letter.examples.map((ex) => (
          <li key={ex.word}>
            <button type="button" className={styles.example} onClick={() => void say(ex.word)}>
              <span className={styles.emoji} aria-hidden="true">
                {ex.emoji}
              </span>
              <span>{ex.word}</span>
            </button>
          </li>
        ))}
      </ul>

      <nav className={styles.pager} aria-label="Otras letras">
        {prev ? (
          <Link to={`/abecedario/${prev.id}`} className={styles.pagerLink}>
            ← {prev.upper}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/abecedario/${next.id}`} className={styles.pagerLink}>
            {next.upper} →
          </Link>
        )}
      </nav>
    </div>
  );
}
