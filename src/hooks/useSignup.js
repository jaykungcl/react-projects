import { useEffect, useState } from 'react'

import { auth, storage, db } from '../firebase/config'
import { 
    doc,
    setDoc
} from 'firebase/firestore'
import { 
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth'
import { 
    ref,
    uploadBytes,
    getDownloadURL
} from 'firebase/storage'

// components and hooks
import { useAuthContext } from './useAuthContext'


export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)

    const { dispatch } = useAuthContext()

    const signup = async (email, password, displayName, thumbnail) => {
        setError(null)
        setIsPending(true)

        try {
            // signup user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            if(!res) {
                throw new Error('Could not complete signup')
            }

            // upload user thubmnail
            const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
            const imgRef = ref(storage, uploadPath)

            await uploadBytes(imgRef, thumbnail)
            const imgURL = await getDownloadURL(imgRef)

            // add display name and photo to user
            await updateProfile(res.user, {
                displayName, photoURL: imgURL
            })

            // create user document
            await setDoc(doc(db, 'users', res.user.uid), {
                online: true,
                displayName,
                photoURL: imgURL
            })

            // dispath login action
            dispatch({ type: 'LOGIN', payload: res.user });
            console.log('dispatched')

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