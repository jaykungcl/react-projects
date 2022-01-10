import { useEffect, useState } from 'react'
import { auth, db } from '../firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)

    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setError(null)
        setIsPending(true)

        try {
            const res = await signInWithEmailAndPassword(auth, email, password)
            
            // dispatch login action
            dispatch({ type: 'LOGIN', payload: res.user })

            // change online status in user's doc
            await updateDoc(doc(db, 'users', res.user.uid), {
                online: true
            })

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

    return { error, isPending, login }
}