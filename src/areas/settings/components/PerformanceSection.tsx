import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Section, Card, Row, Select, Toggle } from '@shared/ui'

export function PerformanceSection(): JSX.Element {
  const { t } = useTranslation()
  const [gpu,     setGpu]     = useState('auto')
  const [vram,    setVram]    = useState('8')
  const [workers, setWorkers] = useState('1')
  const [fp16,    setFp16]    = useState(true)

  return (
    <Section title={t('settings.performance')} subtitle={t('performance.subtitle')}>
      <div className="grid grid-cols-2 gap-4">

        <Card title={t('performance.device')} description={t('performance.deviceDescription')}>
          <Row label={t('performance.gpuDevice')} description={t('performance.gpuDeviceDescription')}>
            <Select value={gpu} onChange={setGpu} options={[
              { value: 'auto',  label: t('performance.autoDetect') },
              { value: 'cuda0', label: 'CUDA GPU 0' },
              { value: 'cuda1', label: 'CUDA GPU 1' },
              { value: 'cpu',   label: t('performance.cpu') },
            ]} />
          </Row>
          <Row label={t('performance.fp16')} description={t('performance.fp16Description')}>
            <Toggle value={fp16} onChange={setFp16} />
          </Row>
        </Card>

        <Card title={t('performance.memory')} description={t('performance.memoryDescription')}>
          <Row label={t('performance.vramLimit')} description={t('performance.vramDescription')}>
            <Select value={vram} onChange={setVram} options={[
              { value: '4',  label: '4 GB' },
              { value: '6',  label: '6 GB' },
              { value: '8',  label: '8 GB' },
              { value: '12', label: '12 GB' },
              { value: '0',  label: t('performance.noLimit') },
            ]} />
          </Row>
          <Row label={t('performance.parallelWorkers')} description={t('performance.workersDescription')}>
            <Select value={workers} onChange={setWorkers} options={[
              { value: '1', label: t('performance.default') },
              { value: '2', label: '2' },
              { value: '4', label: '4' },
            ]} />
          </Row>
        </Card>

      </div>
    </Section>
  )
}
