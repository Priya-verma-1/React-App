import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDogs = () => {
    setLoading(true);
    fetch("https://dog.ceo/api/breeds/image/random/12")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dog images");
        return res.json();
      })
      .then((data) => {
        const dogData = data.message.map((url) => {
          const parts = url.split("/");
          const breed = parts[parts.indexOf("breeds") + 1].replace("-", " ");
          return { url, breed };
        });
        setDogs(dogData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const toggleFavorite = (dog) => {
    if (favorites.find((fav) => fav.url === dog.url)) {
      setFavorites(favorites.filter((fav) => fav.url !== dog.url));
    } else {
      setFavorites([...favorites, dog]);
    }
  };

  if (loading) return <p className="loading">Loading cute dogs...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <h1 className="title">🐶 Dog Gallery</h1>
      <button className="refresh-btn" onClick={fetchDogs}>
        Refresh Gallery
      </button>

      <div className="grid">
        {dogs.map((dog, index) => (
          <div key={index} className="card">
            <img src={dog.url} alt={dog.breed} className="dog-img" />
            <p className="breed-name">{dog.breed.toUpperCase()}</p>
            <button
              className={`fav-btn ${
                favorites.find((fav) => fav.url === dog.url) ? "active" : ""
              }`}
              onClick={() => toggleFavorite(dog)}
            >
              {favorites.find((fav) => fav.url === dog.url)
                ? "★ Favorited"
                : "☆ Add to Favorites"}
            </button>
          </div>
        ))}
      </div>

      {favorites.length > 0 && (
        <div className="favorites">
          <h2>Your Favorites</h2>
          <div className="grid">
            {favorites.map((dog, index) => (
              <div key={index} className="card">
                <img src={dog.url} alt={dog.breed} className="dog-img" />
                <p className="breed-name">{dog.breed.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;