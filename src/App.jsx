import React, { useEffect, useState } from 'react'
import Router from './routers/router'
import { useHistory } from 'react-router-dom'

import SideNavigation from './components/side-navigation'
import NotLogin from './components/errors/not-login'
import Overlay from './components/common/overlay'
import AuthPopup from './components/common/auth-popup'

import './styles/main.css'

const App = ({ FileInput, authService, dropDown, cardRepository }) => {
  const history = useHistory()
  const historyState = history?.location?.state
  const [userId, setUserId] = useState(historyState && historyState.id)
  const [home, setHome] = useState(false)
  const [search, setSerch] = useState(false)
  const [cards, setCards] = useState({})
  const [userCard, setUserCard] = useState({})
  const [isCard, setIsCard] = useState(false)
  const [loding, setLoding] = useState(false)
  const [overlay, setOverlay] = useState(false)

  useEffect(() => {
    const stopSync = cardRepository.syncCards((cards) => {
      setCards(cards)
    })
    return () => {
      stopSync()
    }
  }, [cardRepository, userId])

  useEffect(() => {
    if (!userId) {
      return
    }
    const stopSync = cardRepository.userCard(userId, (card) => {
      if (card) {
        Object.keys(card).map((item) => {
          setIsCard(true)
          return setUserCard(card[item])
        })
      } else {
        setIsCard(false)
        return setUserCard({})
      }
    })
    return () => stopSync()
  }, [cardRepository, userId])

  useEffect(() => {
    setLoding(true)
    authService.onAuthChange((user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        setUserId('')
        history.push('/')
      }
      setLoding(false)
    })
  }, [authService, history])

  const ToggleOverlay = () => {
    setOverlay(!overlay)
  }

  const onSetHome = () => {
    setSerch(false)
    setHome(true)
  }

  const onSetSearch = () => {
    setHome(false)
    setSerch(true)
  }

  const createOrUpdateCard = (card) => {
    setCards((cards) => {
      const updated = { ...cards }
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
    setUserCard({})
    setIsCard(true)
    cardRepository.removeCard(userId)
    history.push('/')
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <SideNavigation
            ToggleOverlay={ToggleOverlay}
            authService={authService}
            userId={userId}
            userCard={userCard}
            loding={loding}
            isCard={isCard}
            home={home}
            search={search}
          ></SideNavigation>
          {!userId ? (
            <NotLogin loding={loding} />
          ) : (
            <Router
              FileInput={FileInput}
              cards={cards}
              dropDown={dropDown}
              userCard={userCard}
              isCard={isCard}
              onSetHome={onSetHome}
              onSetSearch={onSetSearch}
              createCard={createOrUpdateCard}
              updateCard={createOrUpdateCard}
              deleteCard={deleteCard}
            ></Router>
          )}
        </div>
      </div>
      <AuthPopup
        overlay={overlay}
        ToggleOverlay={ToggleOverlay}
        authService={authService}
      ></AuthPopup>
      <Overlay overlay={overlay} ToggleOverlay={ToggleOverlay}></Overlay>
    </>
  )
}

export default App
