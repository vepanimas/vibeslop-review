import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { Card } from '../../components/Card/Card'
import { Button } from '../../components/Button/Button'
import { useToast } from '../../components/Toast/Toast'
import { useStore } from '../../store/ReviewStore'
import type { Settings as SettingsShape } from '../../store/types'
import styles from './Settings.module.css'

type ToggleKey = 'notifications' | 'detectMoreSlop' | 'autoApprove' | 'darkMode'

const toggles: { key: ToggleKey; label: string; description: string }[] = [
  { key: 'notifications', label: 'Recieve notifications', description: 'Get pinged every time a bot opens a PR. So, constantly.' },
  { key: 'detectMoreSlop', label: 'Detect more slop', description: 'Increases slop detected by 0%. It is already detecting all of it.' },
  { key: 'autoApprove', label: 'Auto-approve after 5 minutes', description: 'Saves time. Costs everything else.' },
  { key: 'darkMode', label: 'Dark mode', description: 'Coming soon™. The toggle works, the feature does not.' },
]

export function Settings() {
  const { state, updateSettings, resetAll } = useStore()
  const { toast } = useToast()
  const [form, setForm] = useState<Pick<SettingsShape, 'displayName' | 'email' | 'catchphrase'>>({
    displayName: state.settings.displayName,
    email: state.settings.email,
    catchphrase: state.settings.catchphrase,
  })

  const dirty =
    form.displayName !== state.settings.displayName ||
    form.email !== state.settings.email ||
    form.catchphrase !== state.settings.catchphrase

  const save = () => {
    updateSettings(form)
    toast('Settings saved. Probably.', 'success')
  }

  const reset = () => {
    resetAll()
    setForm({ displayName: 'Senior Slop Inspector', email: 'inspector@vibeslop.dev', catchphrase: 'Looks good to me (it does not)' })
    toast('All slop deleted. It will be back by morning.', 'danger')
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Toggles that mostly do nothing, honestly labelled." />

      <div className={styles.layout}>
        <Card title="Profile">
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Display name</label>
              <input
                className={styles.input}
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input
                className={styles.input}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                placeholder="Reveiwer catchphrase"
                value={form.catchphrase}
                onChange={(e) => setForm({ ...form, catchphrase: e.target.value })}
              />
              <span className={styles.help}>Shown under your name when you approve something you shouldn't.</span>
            </div>
            <div className={styles.formActions}>
              <button className={styles.save} onClick={save} disabled={!dirty}>
                Save changes
              </button>
            </div>
          </div>
        </Card>

        <div className={styles.column}>
          <Card title="Review preferences" padded={false}>
            <ul className={styles.toggleList}>
              {toggles.map((t) => (
                <li key={t.key} className={styles.toggleRow}>
                  <div>
                    <div className={styles.toggleLabel}>{t.label}</div>
                    <div className={styles.toggleDesc}>{t.description}</div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={state.settings[t.key]}
                    aria-label={t.label}
                    className={`${styles.switch} ${state.settings[t.key] ? styles.switchOn : ''}`}
                    onClick={() => updateSettings({ [t.key]: !state.settings[t.key] })}
                  >
                    <span className={styles.knob} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Danger zone" className={styles.danger}>
            <p className={styles.dangerText}>
              Deletes every status and comment you have ever written. The slop itself is immortal.
            </p>
            <Button variant="danger" onClick={reset}>
              Delete all slop
            </Button>
          </Card>
        </div>
      </div>
    </>
  )
}
