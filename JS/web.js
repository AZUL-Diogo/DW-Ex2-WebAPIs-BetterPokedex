/*
const fetchPokemonAPI = () => {

    GenerationStart = 1;
    GenerationEnd = 150;

    for( let i = GenerationStart; i <= GenerationEnd; i++ ){

    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;

    fetch(url)

        .then( res => {
            return res.json();
        } )

        .then( data => {


            console.log(data);


            const pokemon = {
                name: data.name,
                id: data.id,
                image: data.sprites['front_default'],
                type: data.types.map( type => type.type.name).join(", "),
            };


                pokemon['name'] = data.name;
                pokemon[ 'id' ] = data.id;
                pokemon[ 'image' ] = data.sprites['front_default'];
            
                    pokemon['type'] = "";
                    data.types.forEach( type => {
                        pokemon['type'] = pokemon['type'] + ", " + type.type.name;
                    } );
            
                pokemon['type'] = data.types
                .map( type => type.type.name)
                .join(", ");

           
            console.log(pokemon);

        });
    }
}
*/

const pokedex = document.getElementById("pokedex");

const fetchPokemonAPI = () => {

    const generationSelect = document.getElementById("generations");
    const typeSelect = document.getElementById("types");
    const skinSelect = document.getElementById("skin");

    let GenerationStart, GenerationEnd;
    switch (generationSelect.value) {
        case "gen1":
            GenerationStart = 1;
            GenerationEnd = 151;
            break;

        case "gen2":
            GenerationStart = 152;
            GenerationEnd = 251;
            break;
        
        case "gen3":
            GenerationStart = 252;
            GenerationEnd = 386;
            break;

        case "gen4":
            GenerationStart = 387;
            GenerationEnd = 493;
            break;

        case "gen5":
            GenerationStart = 494;
            GenerationEnd = 649;
            break;

        case "gen6":
            GenerationStart = 650;
            GenerationEnd = 722;
            break;

        case "gen7":
            GenerationStart = 722;
            GenerationEnd = 809;
            break;

        case "gen8":
            GenerationStart = 810;
            GenerationEnd = 905;
            break;

        case "gen9":
            GenerationStart = 906;
            GenerationEnd = 1025;
            break;
            
        default:
            GenerationStart = 1;
            GenerationEnd = 151;
    }

    /*
    Gen 1 = 0001/0151
    Gen 2 = 0152/0251
    Gen 3 = 0252/0386
    Gen 4 = 0387/0495
    Gen 5 = 0494/0649
    Gen 6 = 0650/0721
    Gen 7 = 0722/0809
    Gen 8 = 0810/0905
    Gen 9 = 0906/1025
    */ 

    const promises = [];

    for( let i = GenerationStart; i <= GenerationEnd; i++ ){

        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));

    };

    Promise.all(promises).then( (results) => {

        const pokemon = results.map( (data) => ({

            name: data.name,
            id: data.id,

            image: skinSelect.value === "shiny" ? data.sprites['front_shiny'] : data.sprites['front_default'],
            type: data.types.map((type) => type.type.name).join(", ")

        }));

        // Filter by type if a type is selected
        const selectedType = typeSelect.value;
        const filteredPokemon = selectedType !== "noFilter" ? pokemon.filter(p => p.type.includes(selectedType)) : pokemon;

                
        displayPokemons(filteredPokemon);   

    });
 
};

const displayPokemons = (pokemon) => {
    console.log(pokemon);

    const pokemonHTMLString = pokemon.map( singlePokemon =>`
    <li class="card">
        <img class="card-img" src="${singlePokemon.image}"/>
        <h2 class="card-title"> ${singlePokemon.id}. ${singlePokemon.name} </h2>
        <p class="card-subTitle"> Type: ${singlePokemon.type} </p>
    </li>
    `)
    
    .join('');

    pokedex.innerHTML = pokemonHTMLString;
}

function searchPokemon() {
    var input, filter, ol, li, a, i, txtValue;
    input = document.getElementById("pokemonInput");
    filter = input.value.toUpperCase();
    ol = document.getElementById("pokedex");
    li = ol.getElementsByTagName("li");

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("h2")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

(async () => {
    await fetchPokemonAPI();
    searchPokemon();
})();

document.getElementById("generations").addEventListener("change", fetchPokemonAPI);
document.getElementById("types").addEventListener("change", fetchPokemonAPI);
document.getElementById("skin").addEventListener("change", fetchPokemonAPI);