const { from, fromEvent } = rxjs;
const { map, filter, switchMap, debounceTime, distinctUntilChanged, startWith } = rxjs.operators;

let searchBox = document.getElementById('search');
let results = document.getElementById('results');

let searchGithub = (term) =>
    fetch(`https://api.github.com/search/users?q=${term}`)
    .then(data => data.json());

let input$ = fromEvent(searchBox, 'input')
    .pipe(
        debounceTime(250),
        map(e => e.target.value),
        distinctUntilChanged(),
        switchMap(value => value ? searchGithub(value) : Promise.resolve({items: []}))
    )
    
input$.subscribe(data =>  {
        results.innerHTML = '';
        data.items.map(element => {
            let newResult = document.createElement('li');
            newResult.textContent = element.login;
            results.appendChild(newResult);
        })
    })