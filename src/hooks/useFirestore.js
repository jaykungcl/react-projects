import { useState, useEffect, useReducer } from 'react'
import { db } from '../firebase/config'
import { 
    addDoc, 
    collection, 
    deleteDoc,
    updateDoc,
    doc, 
    Timestamp 
} from 'firebase/firestore'

let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: false
}

const firestoreReducer = (state, action) => {
    switch(action.type) {
        case 'IS_PENDING':
            return { 
                isPending: true,
                document: null,
                success: false,
                error: null
            }
        case 'ADD_DOC':
            return { 
                isPending: false,
                document: action.payload,
                success: true,
                error: null
            }
        case 'DELETE_DOC':
            return {
                isPending: false,
                document: null,
                success: true,
                error: null
            }
        case 'UPDATE_DOC':
            return {
                isPending: false,
                document: action.payload,
                success: true,
                error: null
            }
        case 'ERROR':
            return { 
                isPending: false,
                document: null,
                success: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const useFirestore = (c) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    // collection ref
    const ref = collection(db, c)

    // only dispatch if not cancelled
    const dispatchIfNotCancelled = (action) => {
        if(!isCancelled) {
            dispatch(action)
        }
    }

    // add a document
    const addDocument = async (doc) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            const createdAt = Timestamp.fromDate(new Date())
            const newDoc = await addDoc(ref, { 
                ...doc, 
                createdAt 
            });

            dispatchIfNotCancelled({ type: 'ADD_DOC', payload: newDoc })
        } catch(err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
        }
    }

    // delete a document
    const deleteDocument = async (id) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            await deleteDoc(doc(ref, id));

            dispatchIfNotCancelled({ type: 'DELETE_DOC' })
        } catch(err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: 'Cound not delete' })
        }

    }

    // update document
    const updateDocument = async (id, updates) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            const updatedDoc = await updateDoc(doc(ref, id), updates)

            dispatchIfNotCancelled({ type: 'UPDATE_DOC', payload: updatedDoc })
            return updatedDoc
        } catch(err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
            return null
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { addDocument, deleteDocument, updateDocument, response }
}