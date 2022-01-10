import { useEffect, useState } from 'react'

import { auth } from '../firebase/config'
import { 
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth'

// components and hooks
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)

    const { dispatch } = useAuthContext()

    const signup = async (email, password, displayName) => {
        setError(null)
        setIsPending(true)

        try {
            // signup user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            if(!res) {
                throw new Error('Could not complete signup')
            }

            // add display name to user
            await updateProfile(res.user, {
                displayName: displayName
            })

            // dispath login action
            dispatch({ type: 'LOGIN', payload: res.user });

            if(!isCancelled) {
                setIsPending(false)
                setError(null)
            }
            

        } catch(err) {
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

    return { error, isPending, signup }
}