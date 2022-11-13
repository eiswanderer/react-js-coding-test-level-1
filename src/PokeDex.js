import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";
import { CChart } from '@coreui/react-chartjs'

function PokeDex() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHover, setIsHover] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [ordered, setOrdered] = useState("A-Z")
  const [endpoint, setEndpoint] = useState("")
  const [baseName, setBaseName] = useState("")
  const [baseStats, setBaseStats] = useState("")

  useEffect(() => {
    setIsLoading(true)
    axios.get('https://pokeapi.co/api/v2/pokemon').then((res) => {
      setTimeout(() => {
        setPokemons(res.data.results)
        // setEndpoint(res.data.results)
        setIsLoading(false)
      }, 1500)
    })
    
  }, [])

  console.log(pokemonDetail);

  useEffect(() => {
    if (pokemonDetail != null) {
      axios.get(pokemonDetail).then((res) => {
        setEndpoint(res.data)
        
      })
    }
  }, [pokemonDetail])

  useEffect(() => {
    setBaseName(endpoint && endpoint.stats.map((x) => x.stat.name))
  }, [endpoint])

  useEffect(() => {
    setBaseStats(endpoint && endpoint.stats.map((x) => x.base_stat))
  }, [endpoint])

  console.log(endpoint);
  console.log(baseName);
  console.log(baseStats)
  
  // const mouseEnter = () => {
  //   setIsHover(true)
  // }
  // const mouseLeave = () => {
  //   setIsHover(false)
  // }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "black",
      color: "white",
      width: "30rem",
    },
    overlay: { backgroundColor: "grey" },
  };

  if (!isLoading && pokemons.length === 0) {
    return (
      <div>
        <header className="App-header">
          <h1>Welcome to pokedex !</h1>
          <h2>Requirement:</h2>
          <ul>
            <li>
              Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex, and show a list of pokemon name.
            </li>
            <li>Implement React Loading and show it during API call</li>
            <li>when hover on the list item , change the item color to yellow.</li>
            <li>when clicked the list item, show the modal below</li>
            <li>
              Add a search bar on top of the bar for searching, search will run
              on keyup event
            </li>
            <li>Implement sorting and pagingation</li>
            <li>Commit your codes after done</li>
            <li>If you do more than expected (E.g redesign the page / create a chat feature at the bottom right). it would be good.</li>
          </ul>
        </header>
      </div>
    );
  }

  return (
    <div>
      <header className="App-header">
        {isLoading ? (
          <>
            <div className="App">
              <header className="App-header">
              <ReactLoading />
              </header>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to pokedex !</h1>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pokemon here"
              // onKeyUp=
            />
            <div className="order-az">
            <p>Alphabet Order</p>
            <select
              value={ordered}
              onChange={(e) => setOrdered(e.target.value)}
            >
              <option>A-Z</option>
              <option>Z-A</option>
            </select>
            </div>
            {pokemons
              .filter((val) => {
                if (searchTerm == "") {
                  return val;
                } else if (
                  val.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
                ) {
                  return val
                }
              })
              .filter((x) => {
                if (ordered == "A-Z") {
                  return pokemons.sort((a, b) => a.name > b.name ? 1 : -1)
                } else if (ordered == "Z-A") {
                  return pokemons.sort((b, a) => a.name > b.name ? 1 : -1)
                }
              })
              .map((x, index) => {
              return (
                <div key={index} 
                  className="mapped-item"
                  onClick={() => setPokemonDetail(x.url)}
                >
                  {x.name}
                </div>
              )
            })}
          </>
        )}
      </header>
      {pokemonDetail && (
        <Modal
          isOpen={pokemonDetail }
          contentLabel={pokemonDetail?.name || ""}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}
        >
          <div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <img src={endpoint && endpoint.sprites.front_default} style={{width: '200px'}} />
            </div>
            <div>
              <table style={{borderSpacing: '1px'}}>
                <thead style={{display: 'flex'}}>
                  <tr style={{paddingRight: '5rem'}}><b>Base</b></tr>
                  <tr style={{transform: 'translateX(30px)'}}><b>Stats</b></tr>
                </thead>
                <tbody>
                  {endpoint && endpoint.stats.map((x, index) => {
                    return (
                      <tr>
                        <td>{x.stat.name}</td>
                        <td>{x.base_stat}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <CChart 
                type="bar"
                data={{
                  labels: [...baseName],
                  datasets: [
                    {
                      label: 'stats',
                      backgroundColor: '#f87979',
                      data: [...baseStats],
                    },
                  ],
                }}
              />
            </div>
            {/* Requirement: */}
            {/* <ul>
              <li>show the sprites front_default as the pokemon image</li>
              <li>
                Show the stats details - only stat.name and base_stat is
                required in tabular format
              </li>
              <li>Create a bar chart based on the stats above</li>
              <li>Create a  buttton to download the information generated in this modal as pdf. (images and chart must be included)</li>
            </ul> */}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PokeDex;
