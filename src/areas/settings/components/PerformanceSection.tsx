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
    <Section title={t('settings.performance', 'Performance')} subtitle={t('performance.subtitle', 'Configure GPU usage and memory limits.')}>
      <div className="grid grid-cols-2 gap-4">

        <Card title={t('performance.device', 'Device')} description={t('performance.deviceDescription', 'Select which compute device to use for AI inference.')}>
          <Row label={t('performance.gpuDevice', 'GPU device')} description={t('performance.gpuDeviceDescription', 'Device used for model inference.')}>
            <Select value={gpu} onChange={setGpu} options={[
              { value: 'auto',  label: t('performance.autoDetect', 'Auto-detect') },
              { value: 'cuda0', label: 'CUDA GPU 0' },
              { value: 'cuda1', label: 'CUDA GPU 1' },
              { value: 'cpu',   label: t('performance.cpu', 'CPU (slow)') },
            ]} />
          </Row>
          <Row label={t('performance.fp16', 'FP16 precision')} description={t('performance.fp16Description', 'Half-precision for faster inference.')}>
            <Toggle value={fp16} onChange={setFp16} />
          </Row>
        </Card>

        <Card title={t('performance.memory', 'Memory')} description={t('performance.memoryDescription', 'Control memory allocation per generation job.')}>
          <Row label={t('performance.vramLimit', 'VRAM limit')} description={t('performance.vramDescription', 'Max GPU memory per generation.')}>
            <Select value={vram} onChange={setVram} options={[
              { value: '4',  label: '4 GB' },
              { value: '6',  label: '6 GB' },
              { value: '8',  label: '8 GB' },
              { value: '12', label: '12 GB' },
              { value: '0',  label: t('performance.noLimit', 'No limit') },
            ]} />
          </Row>
          <Row label={t('performance.parallelWorkers', 'Parallel workers')} description={t('performance.workersDescription', 'Concurrent generation jobs.')}>
            <Select value={workers} onChange={setWorkers} options={[
              { value: '1', label: t('performance.default', '1 (default)') },
              { value: '2', label: '2' },
              { value: '4', label: '4' },
            ]} />
          </Row>
        </Card>

      </div>
    </Section>
  )
}
