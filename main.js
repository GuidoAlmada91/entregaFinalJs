const cargarApiCountries = () => {
    fetch('https://restcountries.com/v3.1/all')
        .then(respuesta => respuesta.json())
        .then(data => {
            console.log(data)
            mostrarPaises(data);

            const buscador = document.getElementById('buscador');
            
            buscador.addEventListener('input', () => {
                const buscarpais = buscador.value;
                mostrarPaises(data, buscarpais);
            });
        })
        .catch(error => {
            console.error('Error al obtener datos de la API:', error);
        });
        
}

const mostrarPaises = (paises, filtro = '') => {
    const container = document.getElementById('paises');
    container.innerHTML = '';

    const filtroContinente = document.getElementById('filtroContinente');
    const continenteSeleccionado = filtroContinente.value;

    const paisesFiltrados = paises.filter(pais => {
        const cumpleFiltroContinente = (continenteSeleccionado === 'todos') || (pais.region === continenteSeleccionado);
        const nombrePais = pais.name.common || '';  // Manejar casos en los que el nombre del país es undefined
        const cumpleFiltroBusqueda = nombrePais.toLowerCase().includes(filtro.toLowerCase());

        return cumpleFiltroContinente && cumpleFiltroBusqueda;
    });

    paisesFiltrados.forEach(pais => {
        const paisElement = getPais(pais);
        container.appendChild(paisElement);
    });
}
const buscador = document.getElementById('buscador');
buscador.addEventListener('input', () => {
    const buscarpais = buscador.value;
    mostrarPaises(data, buscarpais);
});


const mostrarDetalles = (nombre, poblacion, region, capital, languages) => {
    const languagesArray = Object.values(languages).join(', ');
    Swal.fire(`Detalles de ${nombre}:\n\nPoblación: ${poblacion}\nRegión: ${region}\nCapital: ${capital}\nLenguaje: ${languagesArray}`);
}

const getPais = (pais) => {

    const bandera = pais.flags && pais.flags.png ? pais.flags.png : 'ruta_por_defecto.png';

    const container = document.createElement('div');
    container.className = 'contenedorPaises';

    const img = document.createElement('img');
    img.src = bandera;
    img.alt = `Bandera de ${pais.name.common}`;

    const h2 = document.createElement('h2');
    h2.textContent = pais.name.common;

    const button = document.createElement('button');
    button.textContent = 'Ver Detalles';
    button.addEventListener('click', () => {
        mostrarDetalles(pais.name.common, pais.population, pais.region, pais.capital, pais.languages);
    });
    container.appendChild(h2);
    container.appendChild(img);
    container.appendChild(button);

    return container

}

const filtroContinente = document.getElementById('filtroContinente');
filtroContinente.addEventListener('change', () => {
    cargarApiCountries();
});

cargarApiCountries()
