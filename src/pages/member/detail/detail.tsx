import React from 'react'
import styles from 'styles/modules/detail.module.css'
import { useInitMemberDetail } from './store/detailHook'
import Button from 'components/ui/Button'
import DEFAULT_USER from 'assets/images/img-user-default.png'
import { useNavigate } from 'react-router-dom'
import { ElementGroup, Title } from 'styles/components'
import { useSelectorEq } from 'commons/store/common'
import type { IState } from 'store/modules'

const Detail = () => {
  const card = useInitMemberDetail()
  const nav = useNavigate()
  const { userCode } = useSelectorEq((state: IState) => ({
    userCode: state.auth.user?.uid,
  }))

  return (
    <>
      <ElementGroup.Row flexContent="between">
        <Title size="md" weight="medium">
          {card?.name ? card?.name : '이름없음'}님 정보
        </Title>

        <ElementGroup.Row>
          <Button text="목록" onClick={() => nav('/admin/member/manage')} thin btnSize="xsm" btnType="border" />
          {userCode === location.href.split('/').pop() ? (
            <Button text="정보수정" onClick={() => nav(`/admin/member/register/${userCode}`)} thin btnSize="xsm" />
          ) : (
            <></>
          )}
        </ElementGroup.Row>
      </ElementGroup.Row>
      <div>
        <div className={styles.infoGroup}>
          <figure className={styles.imgWrapper}>
            <img src={card?.fileURL || DEFAULT_USER} alt="" />
            <figcaption className="visually-hidden">profile</figcaption>
          </figure>

          <dl className={styles.userInfoList}>
            <div className={styles.userInfoItem}>
              <dt>이름</dt>
              <dd>{card?.name}</dd>
            </div>
            <div className={styles.userInfoItem}>
              <dt>이메일</dt>
              <dd>
                <a href={`mailto:${card?.email}`}>{card?.email}</a>
              </dd>
            </div>
            <div className={styles.userInfoItem}>
              <dt>부서</dt>
              <dd>{card?.team}팀</dd>
            </div>
            <div className={styles.userInfoItem}>
              <dt>직급</dt>
              <dd>{card?.rank}</dd>
            </div>
            <div className={styles.userInfoItem}>
              <dt>휴대전화</dt>
              <dd>
                <a href={`tel:+${card?.phone}`}>{card?.phone}</a>
              </dd>
            </div>
          </dl>
        </div>
        <div className={styles.contentsGroup}>
          <dl className={styles.infoContents}>
            <div className={`${styles.userInfoItem} ${styles.msg}`}>
              <dt>남긴말</dt>
              <dd className={styles.msgBox}>{card?.msg ? card.msg : '내용없음'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}

export default Detail
