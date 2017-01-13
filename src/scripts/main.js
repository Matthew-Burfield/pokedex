import {render} from 'react-dom';
import React, {Component} from 'react';
import fetch from 'isomorphic-fetch';
import style from '../styles/main.scss';


class PokemonInfo extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: [],
      fetched: false,
      loading: false
    }
  }

  componentWillMount () {
    this.setState ({
      loading: true
    });

    fetch(this.props.url).then(res=>res.json())
      .then(response=>{
        this.setState({
          data : response,
          loading : false,
          fetched : true
        });
      });
  }
  render () {
    const {data, loading, fetched} = this.state;
      // display the pokemon data
      if (fetched) {
        return <div className="pokemon--species--name">
          <div> Name: {data.name} </div>
          <div> Weight: {data.weight} </div>
          <div> Height: {data.height} </div>
        </div>;
      } else {
        return <div className="pokemon--species--name"> POKEMON INFO LOADING... </div>
      }
  }
}


//The Pokemon component will show an individual Pokemon monster
// It shows an image of the Pokemon and
// shows the name of it as well.
class Pokemon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classList: "pokemon--species",
      pokemonSelected: false
    }
    this.handleSelectedPokemon = this.handleSelectedPokemon.bind(this);
  }
  handleSelectedPokemon(e) {
    if (this.state.classList === "pokemon--species") {
      this.setState({
        classList: "pokemon--species pokemon--species--selected",
        pokemonSelected: true
      });
    } else {
      this.setState({
        classList: "pokemon--species",
        pokemonSelected: false
      })
    }
  }
  render() {
    const {pokemon,id} = this.props;
    const fillLeadingZeros = (number)=> {
      return (number < 10) ? ("00" + number) : (number < 100) ? ("0" + number) : number;
    }
    return <div className={this.state.classList} onClick={this.handleSelectedPokemon}>
            <div className="pokemon--species--container">
              <div className="pokemon--species--sprite">
                <img src={`/public/sprites/${id}.png`} />
              </div>
              {!this.state.pokemonSelected && <div className="pokemon--species--name"> #{fillLeadingZeros(id)} {pokemon.name} </div>}
              {this.state.pokemonSelected && <PokemonInfo id={this.props.id} url={this.props.pokemon.url} />}
            </div>
          </div>;
    }
}


//The PokemonList component shows nothing when it mounts for the first time. 
//But right before it mounts on to the DOM, it makes an 
//API call to fetch the first 151 Pokemon from the API and 
//then displays them using the Pokemon Component

class PokemonList extends Component{
  constructor (props) {
    super(props);
    this.state = {
      species : [],
      fetched : false,
      loading : false,
    };
  }

  componentWillMount () {
    if (!this.state.fetched) {
      this.setState({
        loading : true
      });
      fetch('http://pokeapi.co/api/v2/pokemon?limit=151').then(res=>res.json())
      .then(response=>{
        this.setState({
          species : response.results,
          loading : false,
          fetched : true
        });
      });
    }
  }

  render () {
    const {fetched, loading, species} = this.state;
    let content ;
    if (fetched) {
      content = <div className="pokemon--species--list">{species.map((pokemon,index)=><Pokemon key={pokemon.name} id={index+1} pokemon={pokemon}/>)}</div>;
    } else if (loading && !fetched) {
      content = <p> Loading ...</p>;
    }
    else {
      content = <div/>;
    }
    return <div>
      {content}
    </div>;
  }
}


//This is the root component
class PokeApp extends Component{
  render () {
    return <div className="pokeapp">
      <h1> The Kanto PokeDex! </h1>
      <PokemonList />
    </div>;
  }
}

render(<PokeApp />,document.getElementById('app'))


