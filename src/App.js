import React from 'react';
import './App.css';

class App extends React.Component {

    state = {
        filmPreview: null,
        films: [],
        filmsCopy: [],
        isLoading: false,
        search: '',
        criteria: 'title'
    };

    getFilms() {
        return fetch('https://reactjs-cdp.herokuapp.com/movies')
            .then(function (response) {
                return response.json();
            })
    }

    constructor(props) {
        super(props);

        this.state.isLoading = true;
        this.getFilms()
            .then(response => {
                this.setState({films: response.data, isLoading: false, filmsCopy: response.data.slice(0)});
            })
    }

    sort(sortBy) {
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

    showPreview(film) {
        this.setState({filmPreview: film});
    }


    renderFilms() {
        let films = [];
        this.state.films.forEach((film, index) => {
            films.push(
                <div onClick={this.showPreview.bind(this, film)} className="film" key={index}>
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

    onChangeHandler(ev) {
        this.searchFilms(this.state.criteria, ev.target.value);
    }
    searchFilms(criteria, search) {
        const films = this.state.filmsCopy;
        let filteredFilms;
        if (criteria === 'title') {
            filteredFilms = films.filter(film => {
                if (film.title.toLowerCase().includes(search.toLowerCase())) {
                    return true;
                }
                return false;
            });
        } else {
            filteredFilms = films.filter(film => {
                let searchedGenre = film.genres.find(genre => {
                    if (genre.toLowerCase().includes(search.toLowerCase())) {
                        return true;
                    }
                    return false;
                });
                if (searchedGenre) {
                    return true;
                }
                return false;
            });

        }
        this.setState({films: filteredFilms, search: search})
    };

    setCriteria(criteria) {
        this.setState({criteria: criteria});
        this.searchFilms(criteria, this.state.search);
    }

    clickHandler (ev) {
        ev.persist();

        let target = ev.target;
        let searchedDOMElement = document.querySelector('.film-preview-wrapper');
        if (target === searchedDOMElement) {
            this.setState({filmPreview: null})
        }
    }

    renderPreview () {
        const film = this.state.filmPreview;
        console.log(film)
        return (
            <div className="film-preview-wrapper" onClick={this.clickHandler.bind(this)}>
                <div className="film-preview">
                    <img className="film-preview__image" src={film.poster_path} alt="sdcsd"/>
                    <div className="film-preview__body">
                        <div className="film-preview__title">
                            {film.title}
                        </div>
                        <div className="film-preview__genres">
                            {film.genres.join(', ')}
                        </div>
                        <div className="film-preview__description">
                            {film.overview}
                        </div>
                        <div className="film-preview__vote_count">
                            Popularity: {film.vote_count}
                        </div>
                        <div className="film-preview__budget">
                            Budget: ${film.budget}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const isLoading = this.state.isLoading;
        const search = this.state.search;
        const films = this.state.films;
        const criteria = this.state.criteria;
        const filmPreview = this.state.filmPreview;

        function criteriaClass(type) {
            let className = 'search__by-item';
            if (criteria === type) {
                className = className + ' search__by-item_red'
            }
            return className;

        }

        return (
            <div className="container">
                <div className="search">
                    <div className="netflixRoulette">
                        netflixroulette
                    </div>
                    <div className="FindText">
                        Find your movie
                    </div>
                    <input value={search} type="text" className="search__input"
                           onChange={this.onChangeHandler.bind(this)}/>
                    <div className="search__footer">
                        <div className="search__by">
                            Search By:
                            <button className={criteriaClass('title')}
                                    onClick={this.setCriteria.bind(this, 'title')}
                            >
                                title
                            </button>
                            <button className={criteriaClass('genre')}
                                    onClick={this.setCriteria.bind(this, 'genre')}
                            >
                                genre
                            </button>
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
                {isLoading ? 'loading' : this.renderFilms()}
                {filmPreview ? this.renderPreview() : null}
            </div>
        );
    }
}

export default App;
