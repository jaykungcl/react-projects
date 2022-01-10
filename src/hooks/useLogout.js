import { signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth, db } from '../firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)

    const { dispatch, user } = useAuthContext()

    const logout = async () => {
        setError(null)
        setIsPending(true)

        try {
            // change online status in user's doc
            const { uid } = user;
            await updateDoc(doc(db, 'users', uid), {
                online: false
            })

            await signOut(auth)
            
            // dispatch logout action
            dispatch({ type: 'LOGOUT' })

            // not update states after component unmount
            if(!isCancelled) {
                setError(null)
                setIsPending(false) 
            }
            
        } catch(err) {
            // not update states after component unmount
            if(!isCancelled) {
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }  
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { error, isPending, logout }
}