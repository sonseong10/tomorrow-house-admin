import React, {
  useCallback,
  useEffect,
  useState,
  type MemoExoticComponent,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import GlobalHeader from './components/common/global-header'
import MainContent from './components/main-content'

import GlobalFooter from './components/common/global-footer'
import Overlay from './components/common/overlay'
import AuthPopup from './components/common/popup/auth-popup'
import MsgPopup from './components/common/popup/msg-popup'
import MobileSideBar from './components/common/mobile-sidebar'

import './styles/main.css'
import type WorkRepository from 'service/work-repository'
import type CardRepository from 'service/card_repository'
import type DropDown from 'utils/dropdown'
import type AuthService from 'service/auth_service'
import type { User } from 'firebase/auth'
import type ImageUploader from 'service/image-uploader'

interface IAppProps {
  FileInput: MemoExoticComponent<
    (props: {
      imageUploader?: ImageUploader
      name: string
      onFileChange?: (obj: { name?: string; url?: string }) => void
    }) => React.JSX.Element
  >
  dropDown: DropDown
  authService: AuthService
  cardRepository: CardRepository
  workRepository: WorkRepository
}

const App = ({
  FileInput,
  dropDown,
  authService,
  cardRepository,
  workRepository,
}: IAppProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const historyState = location?.state

  const [userId, setUserId] = useState(historyState && historyState.id)

  const [cards, setCards] = useState<
    | {
        [key: string]: {
          email: string
          fileName: string
          fileURL: string
          login: boolean
          msg: string
          name: string
          phone: string
          rank: string
          team: string
          telephone: string
          theme: string
        }
      }
    | undefined
  >(undefined)
  const [works, setWorks] = useState<
    | {
        [key: string]: {
          contents: string
          time: number
          title: string
        }
      }
    | undefined
  >(undefined)

  const [userCard, setUserCard] = useState<
    | {
        email: string
        fileName: string
        fileURL: string
        login: boolean
        msg: string
        name: string
        phone: string
        rank: string
        team: string
        telephone: string
        theme: string
      }
    | undefined
  >(undefined)
  const [popupMsg, setpopupMsg] = useState({ title: '', desc: '' })

  const [menuActive, setMenuActive] = useState<'search' | 'work' | 'home'>(
    'home'
  )
  const [loding, setLoding] = useState(false)
  const [authPopup, setAuthPopup] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [magPopup, setMagPopup] = useState(false)
  const [dark, setDark] = useState(localStorage.getItem('darkMode') === 'true')

  useEffect(() => {
    setLoding(true)
    authService.onAuthChange((user: User) => {
      if (user) {
        setUserId(user.uid)
      } else {
        setUserId('')
        navigate('/')
      }
      setLoding(false)
    })
  }, [authService, navigate])

  const onLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    authService.login(event.currentTarget!.value, setMsg).then(
      (data) =>
        data &&
        cards![data.user.uid] &&
        cardRepository.saveCard(data.user.uid, {
          ...cards![data.user.uid],
          login: true,
        })
    )
    setWorks({})
    setUserCard(undefined)
    navigate('/')
  }

  const onLogout = () => {
    userCard &&
      Object.keys(userCard!).length &&
      cardRepository.saveCard(userId, {
        ...(
          cards as {
            [key: string]: {
              email: string
              fileName: string
              fileURL: string
              login: boolean
              msg: string
              name: string
              phone: string
              rank: string
              team: string
              telephone: string
              theme: string
            }
          }
        )[userId],
        login: false,
      })
    setUserCard(undefined)
    navigate('/')
    authService.logout()
  }

  const deleteAccount = () => {
    deleteCard()
    setWorks({})
    setUserCard(undefined)
    setMagPopup(true)
    workRepository.removeWorkAll(userId)
    authService.delete(setMsg)
  }

  const setMsg = (title: string, desc: string) => {
    setpopupMsg({
      title: '',
      desc: '',
    })
    setpopupMsg({
      title: title,
      desc: desc,
    })
    setMagPopup(true)
  }

  useEffect(() => {
    cardRepository.syncCards(
      (cards: {
        [key: string]: {
          email: string
          fileName: string
          fileURL: string
          login: boolean
          msg: string
          name: string
          phone: string
          rank: string
          team: string
          telephone: string
          theme: string
        }
      }) => {
        setCards(cards)
      }
    )
    return () => {}
  }, [cardRepository, userId])

  useEffect(() => {
    if (!userId) {
      return
    }

    if (cards && Object.keys(cards).find((item) => item === userId)) {
      setUserCard({ ...cards![userId] })
    } else {
      setUserCard(undefined)
    }
  }, [cards, userId])

  const createOrUpdateCard = (card: {
    email: string
    fileName: string
    fileURL: string
    login: boolean
    msg: string
    name: string
    phone: string
    rank: string
    team: string
    telephone: string
    theme: string
  }) => {
    setCards((cards) => {
      const updated: {
        [key: string]: {
          email: string
          fileName: string
          fileURL: string
          login: boolean
          msg: string
          name: string
          phone: string
          rank: string
          team: string
          telephone: string
          theme: string
        }
      } = { ...cards }
      updated[userId] = card
      return updated
    })
    cardRepository.saveCard(userId, card)
  }

  const deleteCard = () => {
    setCards((cards) => {
      const updated = { ...cards }
      delete updated[userId]
      return updated
    })
    cardRepository.removeCard(userId)
  }

  useEffect(() => {
    if (!userId) {
      return
    }
    const stopSync = workRepository.syncWorks(
      userId,
      (works: {
        [key: string]: {
          contents: string
          time: number
          title: string
        }
      }) => {
        setWorks(works)
      }
    )
    return () => {
      stopSync()
    }
  }, [userId, workRepository])

  const createOrUpdateWork = (work: {
    contents: string
    time: number
    title: string
  }) => {
    setWorks((works) => {
      const updated: {
        [key: string]: {
          contents: string
          time: number
          title: string
        }
      } = { ...works }
      updated[userId] = work
      return updated
    })
    workRepository.saveWork(userId, work)
  }

  const deleteWork = (work: {
    contents: string
    time: number
    title: string
  }) => {
    setWorks((works) => {
      const updated: {
        [key: string]: {
          contents: string
          time: number
          title: string
        }
      } = { ...works }
      delete updated[work.time]
      return updated
    })
    workRepository.removeWork(userId, work)
  }

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(dark))
  }, [dark])

  const handleModeChange = useCallback(() => {
    document.body.classList.toggle('isDark')
    setDark(!dark)
  }, [dark])

  const toggleOverlay = useCallback(() => {
    setAuthPopup(!authPopup)
  }, [authPopup])

  const toggleOpenSideBar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const toggleMsgPopup = useCallback(() => {
    setMagPopup(!magPopup)
  }, [magPopup])

  const onMenuChange = useCallback((value: 'search' | 'work' | 'home') => {
    setMenuActive(value)
  }, [])

  return (
    <div className={`app ${dark && 'isDark'}`}>
      <GlobalHeader
        userId={userId}
        userCard={userCard}
        toggleOverlay={toggleOverlay}
        toggleOpenSideBar={toggleOpenSideBar}
        dark={dark}
      ></GlobalHeader>

      <MainContent
        FileInput={FileInput}
        dropDown={dropDown}
        userId={userId}
        onLogout={onLogout}
        deleteAccount={deleteAccount}
        cards={cards}
        works={works}
        userCard={userCard}
        createOrUpdateCard={createOrUpdateCard}
        createOrUpdateWork={createOrUpdateWork}
        deleteWork={deleteWork}
        loding={loding}
        onMenuChange={onMenuChange}
        ToggleOverlay={toggleOverlay}
        menuActive={menuActive}
        handleModeChange={handleModeChange}
        dark={dark}
      ></MainContent>

      <MobileSideBar
        onLogout={onLogout}
        isCard={userCard !== undefined ? Object.keys(userCard).length : 0}
        sidebarOpen={sidebarOpen}
        toggleOpenSideBar={toggleOpenSideBar}
        handleModeChange={handleModeChange}
        dark={dark}
      ></MobileSideBar>

      <AuthPopup
        authPopup={authPopup}
        ToggleOverlay={toggleOverlay}
        authService={authService}
        onLogin={onLogin}
      ></AuthPopup>

      {!userId ? (
        <Overlay overlay={authPopup} ToggleOverlay={toggleOverlay}></Overlay>
      ) : (
        <div className="sm-only">
          <Overlay
            overlay={sidebarOpen}
            ToggleOverlay={toggleOpenSideBar}
          ></Overlay>
        </div>
      )}

      {magPopup && (
        <>
          <MsgPopup
            popupMsg={popupMsg}
            magPopup={magPopup}
            toggleMsgPopup={toggleMsgPopup}
          ></MsgPopup>
          <Overlay overlay={magPopup} ToggleOverlay={toggleMsgPopup}></Overlay>
        </>
      )}

      <GlobalFooter
        userId={userId}
        menuActive={menuActive}
        dark={dark}
      ></GlobalFooter>
    </div>
  )
}

export default App