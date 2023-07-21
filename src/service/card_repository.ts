import { firebaseDatabase } from './firebase'
import { ref, onValue, off, set, remove } from 'firebase/database'

class CardRepository {
  syncCards(
    onUpdate: (value: {
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
    }) => void
  ) {
    const query = ref(firebaseDatabase, `cards`)
    onValue(query, (snapshot) => {
      const value = snapshot.val()
      value && onUpdate(value)
    })
    return () => off(query)
  }

  saveCard(userId: string, card: object) {
    set(ref(firebaseDatabase, `cards/${userId}`), card)
  }

  removeCard(userId: string) {
    remove(ref(firebaseDatabase, `cards/${userId}`))
  }
}

export default CardRepository
