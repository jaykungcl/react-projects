import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore'
import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase/config'

export const useCollection = (c, _q, _order) => {
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)

    const q = useRef(_q).current
    const order = useRef(_order).current

    useEffect(() => {
        let ref = collection(db, c)

        if(q) {
            ref = query(ref, where(...q))
        }
        if(order) {
            ref = query(ref, orderBy(...order))
        }
        
        const unsub = onSnapshot(ref, (snapshot) => {
            let results = [];
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
            });
            // update states
            setDocuments(results);
            setError(null);
        }, (err) => {
            console.log(err);
            setError(err.message);
        })

        // clean up
        return () => unsub();
    }, [c, q, order])

    return { documents, error }
}