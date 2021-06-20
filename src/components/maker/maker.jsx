import React, { useRef } from 'react'
import { FiCamera } from 'react-icons/fi'

import buttonStyles from '../../styles/modules/buttons.module.css'
import styles from '../../styles/modules/maker.module.css'
import TeamsDropdown from '../common/dropdown/teams-dropdown'
import RanksDropdown from '../common/dropdown/ranks-dropdown'
import ThemesDropdown from '../common/dropdown/themes-dropdown'

const Maker = ({ onSubmit, dropDown }) => {
  const nameRef = useRef()
  const emailRef = useRef()
  const phoneRef = useRef()
  const telephoneRef = useRef()
  const msgRef = useRef()
  const themeRef = useRef()
  const teamRef = useRef()
  const rankRef = useRef()
  const fileRef = useRef()
  const formRef = useRef()

  const submitForm = (e) => {
    e.preventDefault()
    const card = {
      uid: Date.now(),
      name: nameRef.current.value,
      msg: msgRef.current.value,
      telephone: telephoneRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      theme: themeRef.current.innerText,
      team: teamRef.current.innerText,
      rank: rankRef.current.innerText,
      imgURL: '',
    }
    formRef.current.reset()
    onSubmit(card)
  }

  return (
    <div className="col-sm-4 col-md-9">
      <div className="wrapper">
        <form className={styles.authForm} ref={formRef} onSubmit={submitForm}>
          <label
            className={`${buttonStyles.baseBtn} ${buttonStyles.ghostBtn} ${styles.profileBtn}`}
            htmlFor="profile"
          >
            <FiCamera /> Add to profile
          </label>
          <input
            ref={fileRef}
            type="file"
            id="profile"
            accept="image/png, image/jpeg"
          />

          <p className={styles.formLabel}>이름</p>
          <input
            className={styles.authFormInput}
            type="text"
            id="name"
            ref={nameRef}
            placeholder="Name"
          />

          <p className={styles.formLabel}>이메일</p>
          <input
            className={styles.authFormInput}
            type="email"
            id="email"
            ref={emailRef}
            placeholder="Email"
          />

          <p className={styles.formLabel}>휴대전화</p>
          <input
            className={styles.authFormInput}
            type="text"
            id="phone"
            ref={phoneRef}
            placeholder="Phone"
          />

          <p className={styles.formLabel}>유선전화</p>
          <input
            className={styles.authFormInput}
            type="text"
            id="telephone"
            ref={telephoneRef}
            placeholder="TelePhone"
          />

          <p className={styles.formLabel}>남긴말</p>
          <textarea
            className={styles.authFormInput}
            id="msg"
            ref={msgRef}
            cols="30"
            rows="3"
            maxLength="100"
            placeholder="Msg"
          ></textarea>

          <div className={styles.typeBtnList}>
            <ThemesDropdown
              dropDown={dropDown}
              themeRef={themeRef}
            ></ThemesDropdown>

            <TeamsDropdown
              dropDown={dropDown}
              teamRef={teamRef}
            ></TeamsDropdown>

            <RanksDropdown
              dropDown={dropDown}
              rankRef={rankRef}
            ></RanksDropdown>
          </div>
          <button
            className={`${buttonStyles.baseBtn} ${buttonStyles.primaryBtn} ${styles.submitBtn}`}
            type="submit"
          >
            Ok
          </button>
        </form>
      </div>
    </div>
  )
}

export default Maker
