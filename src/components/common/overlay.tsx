import React, { memo } from 'react'
import styles from '../../styles/modules/common.module.css'

interface IOverlayProps {
  overlay: boolean
  ToggleOverlay: () => void
}
const Overlay = memo(({ overlay, ToggleOverlay }: IOverlayProps) => {
  return (
    <div
      className={`${styles.overlay} ${overlay && styles.isActive}`}
      onClick={ToggleOverlay}
      onBlur={ToggleOverlay}
      aria-hidden
    ></div>
  )
})

export default Overlay