import { useState } from 'react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOptions, setSelectedOptions] = useState([])
  const [showType, setShowType] = useState("movie")
  const [runtime, setRuntime] = useState("120")
  const [genres, setGenres] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const address = "https://mk-backend-one.vercel.app/"  
  
  const submitSearch = async () => {
    const searchData = {  
      country: "gb",
      catalogs: selectedOptions,
      showType: showType,
      genres: genres,
      runtime: runtime,
      orderBy: "popularity_1year",
      title: searchTerm
    }
    try {
      setLoading(true)
      const response = await fetch(`${address}search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchData)
      });
      const data = await response.json();
      setResults(data|| []);
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false)
    }
    //console.log(searchData);
  }
  return (
    <>
    <div className="flex flex-col gap-4 mx-auto border-black border-2 w-3/4 md:w-1/2 p-4"> 
      <input
        type="text"
        placeholder="Search by title"
        className="search-input w-3/4 mx-auto border-2 border-blue-500 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex gap-2 items-center mx-auto">
        <input type="checkbox" className="checkbox" value="disney" checked={selectedOptions.includes("disney")} onChange={(e) => {
          if (e.target.checked) {
            setSelectedOptions([...selectedOptions, "disney"])
          } else {
            setSelectedOptions(selectedOptions.filter(option => option !== "disney"))
          }
        }} />
        <label className="checkbox-label">Disney+</label>
      </div>
      <div className="flex gap-2 items-center mx-auto">
        <input type="checkbox" className="checkbox" value="netflix" checked={selectedOptions.includes("netflix")} onChange={(e) => {
          if (e.target.checked) {
            setSelectedOptions([...selectedOptions, "netflix"])
          } else {
            setSelectedOptions(selectedOptions.filter(option => option !== "netflix"))
          }
        }} />
        <label className="checkbox-label">Netflix</label>
      </div>

      <div className="flex gap-2 items-center mx-auto">
        <label className="checkbox-label">Show Type:</label>
        <select value={showType} onChange={(e) => setShowType(e.target.value)} className="border-2 border-blue-500 rounded px-2 py-1">
          <option value="movie">Movie</option>
          <option value="tv">TV</option>
        </select>
      </div>

      <div className="flex gap-2 items-center mx-auto">
        <label className="checkbox-label">Runtime (minutes):</label>
        <input type="number" value={runtime} onChange={(e) => setRuntime(e.target.value)} className="border-2 border-blue-500 rounded px-2 py-1 w-20" />
      </div>

      <div className="flex gap-2 items-center mx-auto">
        <input type="checkbox" className="checkbox" value="action" checked={genres.includes("action")} onChange={(e) => {
          if (e.target.checked) {
            setGenres([...genres, "action"])
          } else {
            setGenres(genres.filter(genre => genre !== "action"))
          }
        }} />
        <label className="checkbox-label">Action</label>
      </div>

      <div className="flex gap-2 items-center mx-auto">
        <input type="checkbox" className="checkbox" value="comedy" checked={genres.includes("comedy")} onChange={(e) => {
          if (e.target.checked) {
            setGenres([...genres, "comedy"])
          } else {
            setGenres(genres.filter(genre => genre !== "comedy"))
          }
        }} />
        <label className="checkbox-label">Comedy</label>
      </div>

      <div className="flex gap-2 items-center mx-auto">
        <input type="checkbox" className="checkbox" value="drama" checked={genres.includes("drama")} onChange={(e) => {
          if (e.target.checked) {
            setGenres([...genres, "drama"])
          } else {
            setGenres(genres.filter(genre => genre !== "drama"))
          }
        }} />
        <label className="checkbox-label">Drama</label>
      </div>

      <button className="search-button w-1/4 mx-auto bg-blue-500 text-white rounded py-2" onClick={submitSearch}>Search</button>
    </div>
    
    {loading && <div className="text-center mt-4">Loading...</div>}
    
    {results.length > 0 && (
      <div className="mt-8 mx-auto w-3/4 md:w-1/2 space-y-4">
        {results.map((show, index) => (
          <div key={index} className="border-2 border-gray-300 rounded p-4 bg-gray-50">
            <h2 className="text-xl font-bold mb-2">{show.title}</h2>
            {show.description && (
              <p className="text-gray-700 mb-3">{show.description}</p>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {show.type && <div><strong>Type:</strong> {show.type}</div>}
              {show.imdbRating && <div><strong>IMDB Rating:</strong> {show.imdbRating}</div>}
              {show.releaseYear && <div><strong>Year:</strong> {show.releaseYear}</div>}
              {show.runtime && <div><strong>Runtime:</strong> {show.runtime} min</div>}
              {show.image && <div><img src={show.image} alt={show.title} className="w-24 h-auto" /></div>}
            </div>
            {show.genreNames && show.genreNames.length > 0 && (
              <div className="mt-2 text-sm">
                <strong>Genres:</strong> {show.genreNames.join(", ")}
              </div>
            )}
              {show.streamingOptions && show.streamingOptions.gb && (
                <div className="mt-2 text-sm">
                  <strong>Streaming Options (GB):</strong> {show.streamingOptions.gb.map(option => option.service.name).join(", ")}
                </div>
              )}

          </div>
        ))}
      </div>
    )}
    </>
  )
}

export default App
