
let searchBox = document.getElementById('search');
let results = document.getElementById('results');

var searchGithub = (term) =>
    fetch(`https://api.github.com/search/users?q=${term}`)
    .then(data => data.json());

let keyup = Rx.Observable.fromEvent(searchBox, 'keyup')
    .debounce(500)
    .map(e => e.target.value)
    .filter(value => value.length > 2)
    .distinctUntilChanged()
    .flatMap(value => Rx.Observable.fromPromise(searchGithub(value)))
    .subscribe(data =>  {
        results.innerHTML = '';
        data.items.map(element => {
            let newResult = document.createElement('li');
            newResult.textContent = element.login;
            results.appendChild(newResult);
        })
    })