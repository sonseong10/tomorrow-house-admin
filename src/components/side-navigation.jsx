import React, { memo } from 'react'

import Logo from '../logo.svg'

import { BiHomeAlt, BiSearch, BiMenu } from 'react-icons/bi'
import buttonStyles from '../styles/modules/buttons.module.css'
import styles from '../styles/modules/global_header.module.css'
import { Link } from 'react-router-dom'
import MyMenu from './common/my-menu'

const SideNavigation = memo(
  ({ naveState, handleOpenPopup, authService, loginState, userCard }) => {
    return (
      <div className="col-sm-4 col-md-3">
        <div className="wrapper">
          <header className={styles.globalHeader}>
            <div className={styles.snbLeft}>
              <button
                className={`${styles.snbIconButton} is-open sm-only`}
                type="button"
                aria-label="메뉴 열기 버튼"
              >
                <BiMenu />
              </button>
              <strong className={styles.logo}>
                <Link to="/">
                  <img className="logo-img" src={Logo} alt="WhoMember" />
                </Link>
              </strong>
            </div>
            <div className={`${styles.snbRight} sm-hidden`}>
              <nav className="snb">
                <h2 className="visually-hidden">Side Navigation Bar</h2>
                <ul className="snb-list">
                  <li className="snb-item">
                    <Link
                      to={loginState ? '/' : '#'}
                      className={`${styles.snbItemButton} ${
                        naveState === 'home' && styles.isActive
                      }`}
                      type="button"
                    >
                      <BiHomeAlt className={styles.snbButtonIcon} />
                      Home
                    </Link>
                  </li>
                  <li className="snb-item">
                    <Link
                      to={loginState ? '/search' : '#'}
                      className={`${styles.snbItemButton} 
                    ${naveState === 'search' && styles.isActive}`}
                      type="button"
                    >
                      <BiSearch className={styles.snbButtonIcon} />
                      Search
                    </Link>
                  </li>
                </ul>
              </nav>
              {loginState ? (
                <MyMenu authService={authService} userCard={userCard}></MyMenu>
              ) : (
                <button
                  className={`${styles.loginBtn} ${buttonStyles.primaryBtn} ${buttonStyles.baseBtn} `}
                  onClick={handleOpenPopup}
                  type="button"
                >
                  Login &#38; Signup
                </button>
              )}
            </div>
          </header>
        </div>
      </div>
    )
  }
)

export default SideNavigation
