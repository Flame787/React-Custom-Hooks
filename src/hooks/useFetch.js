import { useEffect, useState } from "react";

export function useFetch(fetchFn, initialValue) {
  // recognized as a (custom) hook, and we can use other hooks inside of this function

  // to make the custom hook functional, we have to manage some state in there
  // (every component that later uses this hook should also get the state managed by the hook):
  const [isFetching, setIsFetching] = useState();
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);

  useEffect(() => {
    // async function fetchPlaces() {
    async function fetchData() {   // replaceing with a more generic, reusable function-name
      setIsFetching(true);
      try {
        // const places = await fetchUserPlaces();
        const data = await fetchFn();
        // generic fetch-function, can be replaced by all types of fetch-functions
        // we can replace specific 'places' with more generic 'data', to make this code more reusable
        // setFetchedData(places);
        setFetchedData(data);
      } catch (error) {
        setError({ message: error.message || "Failed to fetch data." });
      }

      setIsFetching(false);
    }

    // fetchPlaces();
    fetchData();
  }, [fetchFn]);  // we add fetchFn as dependancy because it's external data

  return {   // we can return objects or arrays - here we want to return states, formed as object keys
    isFetching,
    fetchedData,
    setFetchedData,
    error
  }
}
