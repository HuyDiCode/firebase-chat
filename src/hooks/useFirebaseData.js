import { useState, useEffect } from "react";
import { database, ref, onValue } from "../firebase";

/**
 * Custom hook to fetch and listen to a specific path in Firebase Realtime Database
 * @param {string} path - The database path to listen to
 * @returns {[any, boolean, string|null]} - [data, loading, error]
 */
export const useFirebaseData = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const dbRef = ref(database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]);

  return [data, loading, error];
};
