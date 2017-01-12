import {render} from 'react-dom';
import React, {Component} from 'react';
import fetch from 'isomorphic-fetch';


//The Pokemon component will show an individual Pokemon monster
// It shows an image of the Pokemon and
// shows the name of it as well.
class Pokemon extends Component{
  render(){
    const {pokemon,id} = this.props;
    const fillLeadingZeros = (number)=> {
      return (number < 10) ? ("00" + number) : (number < 100) ? ("0" + number) : number;
    }
    return <div className="pokemon--species">
            <div className="pokemon--species--container">
              <div className="pokemon--species--sprite">
                <img src={`/public/sprites/${id}.png`} />
              </div>
              <div className="pokemon--species--name"> #{fillLeadingZeros(id)} {pokemon.name} </div>
            </div>
          </div>;
    }
}


//The PokemonList component shows nothing when it mounts for the first time. 
//But right before it mounts on to the DOM, it makes an 
//API call to fetch the first 151 Pokemon from the API and 
//then displays them using the Pokemon Component

class PokemonList extends Component{
  constructor(props){
    super(props);
    this.state = {
      species : [],
      fetched : false,
      loading : false,
    };
  }
  componentWillMount () {
    this.setState({
      loading : true
    });
    fetch('http://pokeapi.co/api/v2/pokemon?limit=151').then(res=>res.json())
    .then(response=>{
      this.setState({
        species : response.results,
        loading : true,
        fetched : true
      });
    });
  }

  render(){
    const {fetched, loading, species} = this.state;
    let content ;
    if(fetched){
      content = <div className="pokemon--species--list">{species.map((pokemon,index)=><Pokemon key={pokemon.name} id={index+1} pokemon={pokemon}/>)}</div>;
    }else if(loading && !fetched){
        content = <p> Loading ...</p>;
    }
    else{
      content = <div/>;
    }
    return  <div>
      {content}
    </div>;
  }
}


//This is the root component
class PokeApp extends Component{
  render(){
    return <div className="pokeapp">
      <h1> The Kanto PokeDex! </h1>
      <PokemonList/>
    </div>;
  }
}

render(<PokeApp/>,document.getElementById('app'))