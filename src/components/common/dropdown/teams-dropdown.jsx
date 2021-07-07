import React, { useState } from 'react'
import { BiChevronUp } from 'react-icons/bi'

import DropDown from './dropdown'

import buttonStyles from '../../../styles/modules/buttons.module.css'
import styles from '../../../styles/modules/dropdown.module.css'

const TeamsDropdown = ({ dropDown, teamRef, userCard, updateCard }) => {
  const items = [...dropDown.getTeams()]
  const [teamsType, setTeamsType] = useState(
    userCard ? userCard.team : items[0].value
  )
  const [teamsIsOpen, setTeamsIsOpen] = useState(false)

  const handleTeamsValue = (value) => {
    userCard ? update(value) : add(value)
    onTeamsOpen()
  }

  const add = (value) => {
    setTeamsType(value)
  }

  const update = (value) => {
    setTeamsType(value)
    updateCard({
      ...userCard,
      [`team`]: value,
    })
  }

  const onTeamsOpen = () => {
    setTeamsIsOpen(!teamsIsOpen)
  }

  return (
    <div className={`${styles.teams} ${teamsIsOpen && styles.isActive}`}>
      <p className={styles.formLabel}>부서명</p>
      <button
        className={`${styles.formInput} ${buttonStyles.baseBtn}`}
        onClick={onTeamsOpen}
        type="button"
        ref={teamRef}
      >
        {teamsType} <BiChevronUp className={styles.dropdownIcon} />
      </button>
      <div className={styles.teamsList}>
        <DropDown listItems={items} handleEvent={handleTeamsValue} />
      </div>
    </div>
  )
}

export default TeamsDropdown
