import type { ReactNode } from 'react';
import { env } from '@/config/env';
import { useServices, useSettings } from '@/shared/di/hooks';
import { Button } from '@/shared/ui/Button';
import { PageHeader } from '@/shared/ui/PageHeader';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';
import styles from './SettingsPage.module.css';

const CASES = [
  { value: 'both', label: 'Aa' },
  { value: 'upper', label: 'A' },
  { value: 'lower', label: 'a' },
] as const;

const Z_OPTIONS = [
  { value: 'distincion', label: 'Lengua entre dientes' },
  { value: 'seseo', label: 'Como la s' },
] as const;

const SPEECH = [
  { value: 'on', label: 'Con voz' },
  { value: 'off', label: 'Sin voz' },
] as const;

export function SettingsPage() {
  const [settings, repo] = useSettings();
  const { speech, progress } = useServices();

  return (
    <div>
      <PageHeader title="Ajustes" subtitle="Configuración para la terapeuta o la familia." />

      <div className={styles.list}>
        <Row
          title="Voz"
          description={
            speech.supported
              ? 'Lee en voz alta letras, sílabas y palabras.'
              : 'Este navegador no tiene voz disponible.'
          }
        >
          <SegmentedControl
            label="Voz"
            options={SPEECH}
            value={settings.speechEnabled ? 'on' : 'off'}
            onChange={(v) => repo.set('speechEnabled', v === 'on')}
          />
        </Row>

        <Row title="Velocidad de la voz" description={`${Math.round(settings.speechRate * 100)} %`}>
          <input
            type="range"
            min={0.5}
            max={1.2}
            step={0.05}
            value={settings.speechRate}
            onChange={(e) => repo.set('speechRate', Number(e.target.value))}
            aria-label="Velocidad de la voz"
            className={styles.range}
          />
          <Button
            variant="secondary"
            icon="🔊"
            onClick={() =>
              void speech.speak('Hola, vamos a aprender', { rate: settings.speechRate })
            }
          >
            Probar
          </Button>
        </Row>

        <Row
          title="Velocidad de la boquita"
          description={`${settings.mouthStepMs} ms por sonido (más alto = más lento)`}
        >
          <input
            type="range"
            min={200}
            max={900}
            step={20}
            value={settings.mouthStepMs}
            onChange={(e) => repo.set('mouthStepMs', Number(e.target.value))}
            aria-label="Velocidad de la boquita"
            className={styles.range}
          />
        </Row>

        <Row title="Letras" description="Cómo se muestran las letras en las tarjetas.">
          <SegmentedControl
            label="Mayúsculas y minúsculas"
            options={CASES}
            value={settings.letterCase}
            onChange={(v) => repo.set('letterCase', v)}
          />
        </Row>

        <Row
          title="Pronunciación de z / ce / ci"
          description="Según la variante que se trabaje en terapia."
        >
          <SegmentedControl
            label="Pronunciación de la z"
            options={Z_OPTIONS}
            value={settings.zPronunciation}
            onChange={(v) => repo.set('zPronunciation', v)}
          />
        </Row>

        <Row
          title="Progreso"
          description="Borra las estrellas y estadísticas guardadas en este dispositivo."
        >
          <Button
            variant="ghost"
            onClick={() => {
              if (window.confirm('¿Borrar todo el progreso guardado?')) progress.reset();
            }}
          >
            Borrar progreso
          </Button>
        </Row>
      </div>

      <p className={styles.version}>
        {env.appName} v{env.version} · {env.appEnv}
      </p>
    </div>
  );
}

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.row}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.control}>{children}</div>
    </section>
  );
}
