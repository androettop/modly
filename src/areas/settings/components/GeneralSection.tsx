import { useTranslation } from 'react-i18next'
import { useAppStore } from '@shared/stores/appStore'
import { Section, Card, Row } from '@shared/ui'

export function GeneralSection(): JSX.Element {
  const { t } = useTranslation()
  const { language, setLanguage } = useAppStore()

  return (
    <Section title={t('general.title')} subtitle={t('general.subtitle')}>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <Row label={t('general.languageLabel')} description={t('general.languageDescription')}>
            <div className="flex gap-1.5">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  language === 'en'
                    ? 'bg-accent text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {t('general.english')}
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  language === 'es'
                    ? 'bg-accent text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {t('general.spanish')}
              </button>
            </div>
          </Row>
        </Card>
      </div>
    </Section>
  )
}
