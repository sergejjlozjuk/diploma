import React from 'react';
import './App.css';

class App extends React.Component {
  state = {
    films: [],
    filmsCopy: [],
    isLoading: false,
    search: ''
  };

  static getFilms () {
    return fetch('https://reactjs-cdp.herokuapp.com/movies')
        .then(function(response) {
          return response.json();
        })
  }

  constructor(props) {
    super(props);
    this.state.isLoading = true;
    App.getFilms()
        .then(response => {
          this.setState({films: response.data, isLoading: false, filmsCopy: response.data.slice(0)});
        })
  }

  sort (sortBy) {
    let films = this.state.films;
    if (sortBy === 'rating') {
      films.sort((film1, film2) => {
        return film1.vote_average - film2.vote_average;
      });
    }
    if (sortBy === 'date') {
      films.sort((film1, film2) => {
        return (new Date(film1.release_date)).getFullYear() - (new Date(film2.release_date)).getFullYear()
      });
    }
    this.setState({films: films});
  }

  renderFilms () {
    let films = [];
    this.state.films.forEach((film, index) => {
      films.push(
          <div className="film" key={index}>
            <div className="film__image">
              <img src={film.poster_path} alt={'asdasd'}/>
            </div>
            <div className="film__footer">
              <div className="film__footer-item">
                <div className="film__name" title={film.title}>{film.title}</div>
                <div className="film__genre" title={film.genres.join(', ')}>
                  {film.genres.join(', ')}
                </div>
              </div>
              <div className="film__footer-item">
                <div className="film__year">
                  {(new Date(film.release_date)).getFullYear()}
                </div>
              </div>
            </div>

          </div>
      )
    });
    return <div className="films-wrapper">{films}</div>;
  }

  onChangeHandler (ev) {
    // TODO add criteria
    this.searchFilms(null, 'title', ev.target.value)
  }

  searchFilms (ev, criteria, search) {
    const films = this.state.filmsCopy;
    const filteredFilms = films.filter(film => film[criteria].toLowerCase().includes(search.toLowerCase()));
    this.setState({films: filteredFilms, search: search})
  };

  render () {
    const isLoading = this.state.isLoading;
    const search = this.state.search;
    const films = this.state.films;

    return (
        <div className="container">
          <div className="search">
            <input value={search} type="text" className="search__input" onChange={this.onChangeHandler.bind(this)}/>
            <div className="search__footer">
              <div className="search__by">
                Search By:
                <div className="search__by-item search__by-item_red">title</div>
                <div className="search__by-item">genre</div>
              </div>
            </div>
          </div>
          <div className="sort">
              <div className="sort__matches">
                {films.length} movies found
              </div>
              <div className="sort__variants">
                Sort By:
                <div className="sort__variant" onClick={this.sort.bind(this, 'date')}>release date</div>
                <div className="sort__variant" onClick={this.sort.bind(this, 'rating')}>rating</div>
              </div>
          </div>
          {isLoading  ? 'loading' : this.renderFilms()}
        </div>
    );
  }
}

export default App;
