import React from 'react'
import notResult from '../../assets/images/people-search.svg'
import styles from '../../styles/modules/error-page.module.css'

const NotFound = () => {
  return (
    <section className={`${styles.error}`}>
      <img className={styles.errorImg} src={notResult} alt="Not result" />
      <h2 className={styles.errorTitle}>결과가 없습니다.</h2>
      <p className={styles.errorDesc}>서버 오류 또는 업무 정보가 없습니다.</p>
    </section>
  )
}

export default React.memo(NotFound)
