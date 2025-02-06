import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchUserPlaces, updateUserPlaces } from "./http.js";
import Error from "./components/Error.jsx";
import { useFetch } from "./hooks/useFetch.js";

function App() {
  const selectedPlace = useRef();

  // const [userPlaces, setUserPlaces] = useState([]);
  // const [isFetching, setIsFetching] = useState(false);
  // const [error, setError] = useState();

  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // useEffect(() => {
  //   async function fetchPlaces() {
  //     setIsFetching(true);
  //     try {
  //       const places = await fetchUserPlaces();
  //       setUserPlaces(places);
  //     } catch (error) {
  //       setError({ message: error.message || 'Failed to fetch user places.' });
  //     }

  //     setIsFetching(false);
  //   }

  //   fetchPlaces();
  // }, []);

  // use-Effect code was replaced by the custom hook (defined in hooks -> useFetch.js):
  const {
    isFetching,
    error,
    fetchedData: userPlaces,
  } = useFetch(fetchUserPlaces, []);
  // we pass the specific fetch-function to the custom-hook-call
  // as a result of calling useFetch, we will get the state snapshots which we are returning in useFetch-hook
  // if the state gets updated in the custom hook, the component in which the custom hook is exported also gets executed again
  // [] - passing as a 2nd argument-> this will become 'initialValue' in useFetch.js:
  // const [fetchedData, setFetchedData] = useState(initialValue);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  // async function handleSelectPlace(selectedPlace) {
  //   // await updateUserPlaces([selectedPlace, ...userPlaces]);

  //   setUserPlaces((prevPickedPlaces) => {
  //     if (!prevPickedPlaces) {
  //       prevPickedPlaces = [];
  //     }
  //     if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
  //       return prevPickedPlaces;
  //     }
  //     return [selectedPlace, ...prevPickedPlaces];
  //   });

  //   try {
  //     await updateUserPlaces([selectedPlace, ...userPlaces]);
  //   } catch (error) {
  //     setUserPlaces(userPlaces);
  //     setErrorUpdatingPlaces({
  //       message: error.message || "Failed to update places.",
  //     });
  //   }
  // }

  // const handleRemovePlace = useCallback(
  //   async function handleRemovePlace() {
  //     setUserPlaces((prevPickedPlaces) =>
  //       prevPickedPlaces.filter(
  //         (place) => place.id !== selectedPlace.current.id
  //       )
  //     );

  //     try {
  //       await updateUserPlaces(
  //         userPlaces.filter((place) => place.id !== selectedPlace.current.id)
  //       );
  //     } catch (error) {
  //       setUserPlaces(userPlaces);
  //       setErrorUpdatingPlaces({
  //         message: error.message || "Failed to delete place.",
  //       });
  //     }

  //     setModalIsOpen(false);
  //   },
  //   [userPlaces]
  // );

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occurred!"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          // onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occurred!" message={error.message} />}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText="Fetching your places..."
            places={userPlaces}
            // places={fetchedData}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces
        // onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
