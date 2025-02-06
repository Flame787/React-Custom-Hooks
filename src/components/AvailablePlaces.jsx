// import { useState, useEffect } from "react";

import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
// importing custom hook also here:
import { useFetch } from "../hooks/useFetch.js";

async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();

  // return new Promise((resolve, reject) => {    // reject-feature is now not needed, just resolve is needed.
  return new Promise((resolve) => {
    // promise-constructor = we are wraping teh code into promise
    // moved navigator-code here:
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );
      // setAvailablePlaces(sortedPlaces);
      // setIsFetching(false);

      resolve(sortedPlaces); // calling 'resolve' and passing 'sortedPlaces' to this function.
    }); // sortedPlaces is a value that will be returned by the overall JS-promise.
  }); // standard JS-procedure for converting a non-promise feature and API into a promise feature.
}

export default function AvailablePlaces({ onSelectPlace }) {
  // const [isFetching, setIsFetching] = useState(false);
  // const [availablePlaces, setAvailablePlaces] = useState([]);
  // const [error, setError] = useState();

  // calling custom hook and passing functions and initial value to it:
  const {
    isFetching,
    error,
    fetchedData: availablePlaces,
    // setFetchedData: setAvailablePlaces,

// } = useFetch(fetchAvailablePlaces, []);
  } = useFetch(fetchSortedPlaces, []); // changed to fetchSortedPlaces (data-fetching function)
  // destructuring object

  // removing useEffect -> replaced by custom hook:

  // useEffect(() => {
  //   async function fetchPlaces() {
  //     setIsFetching(true);

  //     try {
  //       const places = await fetchAvailablePlaces();

  //       // navigator.geolocation.getCurrentPosition((position) => {
  //       //   const sortedPlaces = sortPlacesByDistance(
  //       //     places,
  //       //     position.coords.latitude,
  //       //     position.coords.longitude
  //       //   );
  //       //   setAvailablePlaces(sortedPlaces);
  //       //   setIsFetching(false);
  //       // });
  //     } catch (error) {
  //       setError({
  //         message:
  //           error.message || 'Could not fetch places, please try again later.',
  //       });
  //       setIsFetching(false);
  //     }
  //   }

  //   fetchPlaces();
  // }, []);

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
