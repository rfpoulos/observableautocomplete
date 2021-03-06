const { 
    fromEvent,
    from,
} = rxjs;
const { 
    map, 
    switchMap, 
    debounceTime, 
    distinctUntilChanged,
    filter,
} = rxjs.operators;

let searchBox = document.getElementById('search');
let results = document.getElementById('results');

let searchGithub = (term) =>
    fetch(`https://api.github.com/search/users?q=${term}`)
    .then(data => data.json());

let input$ = fromEvent(searchBox, 'input')
    .pipe(
        debounceTime(350),
        map(e => e.target.value),
        filter(query => query.length >= 2 || 
            query.length === 0), 
        distinctUntilChanged(), 
        switchMap(value => value ?
            from(searchGithub(value)) : 
            from(Promise.resolve({items: []}))
        )
    );
    
input$.subscribe(data =>  {
        while (results.firstChild) {
            results.removeChild(results.firstChild);
        }
        data.items.map(element => {
            let newResult = document.createElement('li');
            newResult.textContent = element.login;
            results.appendChild(newResult);
        })
    })