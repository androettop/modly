import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Section, Card, Row, PathRow } from '@shared/ui'

// ─── MoveFolderModal ──────────────────────────────────────────────────────────

function MoveFolderModal({ title, currentDir, items, itemLabel, moveLabel, moveDesc, deleteLabel, deleteDesc, status, onCancel, onMove, onDelete }: {
  title: string
  currentDir: string
  items: string[]
  itemLabel: string
  moveLabel: string
  moveDesc: string
  deleteLabel: string
  deleteDesc: string
  status: 'idle' | 'busy' | 'error'
  onCancel: () => void
  onMove: () => void
  onDelete: () => void
}): JSX.Element {
  const { t } = useTranslation()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[440px] rounded-2xl border border-zinc-700/60 bg-zinc-900 shadow-2xl overflow-hidden">

        <div className="px-6 pt-5 pb-4">
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          <p className="text-xs text-zinc-500 mt-1">
            {t('storage.alreadyAt', { count: items.length, label: itemLabel })}
          </p>
          <p className="mt-2.5 px-3 py-2 bg-zinc-800/70 rounded-lg text-[11px] font-mono text-zinc-400 truncate border border-zinc-700/50">
            {currentDir}
          </p>
          <p className="text-xs text-zinc-500 mt-3">{t('storage.whatHappen')}</p>
        </div>

        <div className="px-6 pb-5 flex flex-col gap-2">
          {status === 'error' && (
            <p className="text-[11px] text-red-400 mb-0.5">{t('storage.somethingWrong')}</p>
          )}

          <button
            onClick={onMove}
            disabled={status === 'busy'}
            className="w-full px-4 py-3 rounded-xl bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/50 text-left transition-all disabled:opacity-40"
          >
            <p className="text-xs font-semibold text-accent-light">{moveLabel}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{moveDesc}</p>
          </button>

          <button
            onClick={onDelete}
            disabled={status === 'busy'}
            className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 hover:bg-red-950/30 border border-zinc-700/50 hover:border-red-800/50 text-left transition-all disabled:opacity-40"
          >
            <p className="text-xs font-semibold text-red-400">{deleteLabel}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{deleteDesc}</p>
          </button>

          <button
            onClick={onCancel}
            disabled={status === 'busy'}
            className="w-full px-4 py-2.5 mt-0.5 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-colors disabled:opacity-40"
          >
            {status === 'busy' ? t('storage.pleaseWait') : t('storage.cancel')}
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── StorageSection ───────────────────────────────────────────────────────────

export function StorageSection(): JSX.Element {
  const { t } = useTranslation()
  const [modelsDir,     setModelsDir]     = useState('')
  const [workspaceDir,  setWorkspaceDir]  = useState('')
  const [workflowsDir,  setWorkflowsDir]  = useState('')
  const [cacheStatus, setCacheStatus]     = useState<'idle' | 'clearing' | 'done' | 'error'>('idle')

  const [pendingModelsDir,     setPendingModelsDir]     = useState<string | null>(null)
  const [existingModels,       setExistingModels]       = useState<string[]>([])
  const [modelsActionStatus,   setModelsActionStatus]   = useState<'idle' | 'busy' | 'error'>('idle')

  const [pendingWorkspaceDir,   setPendingWorkspaceDir]   = useState<string | null>(null)
  const [existingWorkspaces,    setExistingWorkspaces]    = useState<string[]>([])
  const [workspaceActionStatus, setWorkspaceActionStatus] = useState<'idle' | 'busy' | 'error'>('idle')

  const [pendingWorkflowsDir,   setPendingWorkflowsDir]   = useState<string | null>(null)
  const [existingWorkflows,     setExistingWorkflows]     = useState<string[]>([])
  const [workflowsActionStatus, setWorkflowsActionStatus] = useState<'idle' | 'busy' | 'error'>('idle')

  useEffect(() => {
    window.electron.settings.get().then((s) => {
      setModelsDir(s.modelsDir)
      setWorkspaceDir(s.workspaceDir)
      setWorkflowsDir(s.workflowsDir)
    })
  }, [])

  async function applyModelsDir(path: string) {
    setModelsDir(path)
    await window.electron.settings.set({ modelsDir: path })
    await window.electron.api.updatePaths({ modelsDir: path })
  }

  async function applyWorkspaceDir(path: string) {
    setWorkspaceDir(path)
    await window.electron.settings.set({ workspaceDir: path })
    await window.electron.api.updatePaths({ workspaceDir: path })
  }

  async function applyWorkflowsDir(path: string) {
    setWorkflowsDir(path)
    await window.electron.settings.set({ workflowsDir: path })
  }

  async function handleBrowseModels() {
    const newPath = await window.electron.fs.selectDirectory()
    if (!newPath || newPath === modelsDir) return

    const models = await window.electron.fs.listDir(modelsDir)
    if (models.length > 0) {
      setExistingModels(models)
      setPendingModelsDir(newPath)
      return
    }

    await applyModelsDir(newPath)
  }

  async function handleBrowseWorkspace() {
    const newPath = await window.electron.fs.selectDirectory()
    if (!newPath || newPath === workspaceDir) return

    const items = await window.electron.fs.listDir(workspaceDir)
    if (items.length > 0) {
      setExistingWorkspaces(items)
      setPendingWorkspaceDir(newPath)
      return
    }

    await applyWorkspaceDir(newPath)
  }

  async function handleBrowseWorkflows() {
    const newPath = await window.electron.fs.selectDirectory()
    if (!newPath || newPath === workflowsDir) return

    const items = await window.electron.fs.listDir(workflowsDir)
    if (items.length > 0) {
      setExistingWorkflows(items)
      setPendingWorkflowsDir(newPath)
      return
    }

    await applyWorkflowsDir(newPath)
  }

  async function handleMoveModels() {
    if (!pendingModelsDir) return
    setModelsActionStatus('busy')
    const result = await window.electron.fs.moveDirectory({ src: modelsDir, dest: pendingModelsDir })
    if (result.success) {
      await applyModelsDir(pendingModelsDir)
      closeModelsModal()
    } else {
      setModelsActionStatus('error')
    }
  }

  async function handleDeleteModels() {
    if (!pendingModelsDir) return
    setModelsActionStatus('busy')
    const result = await window.electron.fs.deleteDirectory(modelsDir)
    if (result.success) {
      await applyModelsDir(pendingModelsDir)
      closeModelsModal()
    } else {
      setModelsActionStatus('error')
    }
  }

  function closeModelsModal() {
    setPendingModelsDir(null)
    setExistingModels([])
    setModelsActionStatus('idle')
  }

  async function handleMoveWorkspace() {
    if (!pendingWorkspaceDir) return
    setWorkspaceActionStatus('busy')
    const result = await window.electron.fs.moveDirectory({ src: workspaceDir, dest: pendingWorkspaceDir })
    if (result.success) {
      await applyWorkspaceDir(pendingWorkspaceDir)
      closeWorkspaceModal()
    } else {
      setWorkspaceActionStatus('error')
    }
  }

  async function handleDeleteWorkspace() {
    if (!pendingWorkspaceDir) return
    setWorkspaceActionStatus('busy')
    const result = await window.electron.fs.deleteDirectory(workspaceDir)
    if (result.success) {
      await applyWorkspaceDir(pendingWorkspaceDir)
      closeWorkspaceModal()
    } else {
      setWorkspaceActionStatus('error')
    }
  }

  function closeWorkspaceModal() {
    setPendingWorkspaceDir(null)
    setExistingWorkspaces([])
    setWorkspaceActionStatus('idle')
  }

  async function handleMoveWorkflows() {
    if (!pendingWorkflowsDir) return
    setWorkflowsActionStatus('busy')
    const result = await window.electron.fs.moveDirectory({ src: workflowsDir, dest: pendingWorkflowsDir })
    if (result.success) {
      await applyWorkflowsDir(pendingWorkflowsDir)
      closeWorkflowsModal()
    } else {
      setWorkflowsActionStatus('error')
    }
  }

  async function handleDeleteWorkflows() {
    if (!pendingWorkflowsDir) return
    setWorkflowsActionStatus('busy')
    const result = await window.electron.fs.deleteDirectory(workflowsDir)
    if (result.success) {
      await applyWorkflowsDir(pendingWorkflowsDir)
      closeWorkflowsModal()
    } else {
      setWorkflowsActionStatus('error')
    }
  }

  function closeWorkflowsModal() {
    setPendingWorkflowsDir(null)
    setExistingWorkflows([])
    setWorkflowsActionStatus('idle')
  }

  async function handleClearCache() {
    setCacheStatus('clearing')
    const result = await window.electron.cache.clear()
    if (!result.success) console.error('[cache:clear] renderer:', result.error)
    setCacheStatus(result.success ? 'done' : 'error')
    setTimeout(() => setCacheStatus('idle'), 2500)
  }

  return (
    <Section title={t('storage.title')} subtitle={t('storage.subtitle')}>
      <div className="grid grid-cols-2 gap-4">

        <Card title={t('storage.directories')} description={t('storage.directoriesDescription')}>
          <PathRow
            label={t('storage.models')}
            description={t('storage.modelsDescription')}
            value={modelsDir}
            onBrowse={handleBrowseModels}
          />
          <PathRow
            label={t('storage.workspace')}
            description={t('storage.workspaceDescription')}
            value={workspaceDir}
            onBrowse={handleBrowseWorkspace}
          />
          <PathRow
            label={t('storage.workflows')}
            description={t('storage.workflowsDescription')}
            value={workflowsDir}
            onBrowse={handleBrowseWorkflows}
          />
        </Card>

        <Card title={t('storage.cache')} description={t('storage.cacheDescription')}>
          <Row label={t('storage.tempFiles')} description={t('storage.tempFilesDescription')}>
            <button
              onClick={handleClearCache}
              disabled={cacheStatus === 'clearing'}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                cacheStatus === 'done'  ? 'bg-green-500/15 text-green-400' :
                cacheStatus === 'error' ? 'bg-red-500/15 text-red-400' :
                'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {cacheStatus === 'clearing' ? t('storage.clearing') :
               cacheStatus === 'done'     ? t('storage.cleared') :
               cacheStatus === 'error'    ? t('storage.clearFailed')  :
               t('storage.clearCache')}
            </button>
          </Row>
        </Card>

      </div>

      {pendingModelsDir && (
        <MoveFolderModal
          title={t('storage.changeModelsFolder')}
          currentDir={modelsDir}
          items={existingModels}
          itemLabel={t('storage.model')}
          moveLabel={t('storage.moveToNewFolder')}
          moveDesc={t('storage.moveModelsDesc')}
          deleteLabel={t('storage.deleteModels')}
          deleteDesc={t('storage.deleteModelsDesc')}
          status={modelsActionStatus}
          onCancel={closeModelsModal}
          onMove={handleMoveModels}
          onDelete={handleDeleteModels}
        />
      )}

      {pendingWorkspaceDir && (
        <MoveFolderModal
          title={t('storage.changeWorkspaceFolder')}
          currentDir={workspaceDir}
          items={existingWorkspaces}
          itemLabel={t('storage.item')}
          moveLabel={t('storage.moveToNewFolder')}
          moveDesc={t('storage.moveItemsDesc')}
          deleteLabel={t('storage.deleteItems')}
          deleteDesc={t('storage.deleteItemsDesc')}
          status={workspaceActionStatus}
          onCancel={closeWorkspaceModal}
          onMove={handleMoveWorkspace}
          onDelete={handleDeleteWorkspace}
        />
      )}

      {pendingWorkflowsDir && (
        <MoveFolderModal
          title={t('storage.changeWorkflowsFolder')}
          currentDir={workflowsDir}
          items={existingWorkflows}
          itemLabel={t('storage.workflow')}
          moveLabel={t('storage.moveToNewFolder')}
          moveDesc={t('storage.moveWorkflowsDesc')}
          deleteLabel={t('storage.deleteWorkflows')}
          deleteDesc={t('storage.deleteWorkflowsDesc')}
          status={workflowsActionStatus}
          onCancel={closeWorkflowsModal}
          onMove={handleMoveWorkflows}
          onDelete={handleDeleteWorkflows}
        />
      )}
    </Section>
  )
}
