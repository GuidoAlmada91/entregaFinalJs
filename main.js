const cargarApiCountries = () => {
    fetch('https://restcountries.com/v3.1/all')
        .then(respuesta => respuesta.json())
        .then(data => {
            console.log(data);
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
        const nombrePais = pais.name.common || '';
        const cumpleFiltroBusqueda = nombrePais.toLowerCase().includes(filtro.toLowerCase());

        return cumpleFiltroContinente && cumpleFiltroBusqueda;
    });

    paisesFiltrados.forEach(pais => {
        const paisElement = getPais(pais);
        container.appendChild(paisElement);
    });
}

const mostrarDetalles = (nombre, poblacion, region, capital, languages) => {
    const languagesArray = Object.values(languages).join(', ');
    Swal.fire(`Detalles de ${nombre}:\n\nPoblación: ${poblacion}\nRegión: ${region}\nCapital: ${capital}\nLenguaje: ${languagesArray}`);
}

const agregarAFavoritos = (pais) => {
    // Obtener la lista de favoritos del almacenamiento local
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    // Verificar si el país ya está en la lista de favoritos
    if (!favoritos.some(fav => fav.name.common === pais.name.common)) {
        // Agregar el país a la lista de favoritos
        favoritos.push(pais);

        // Guardar la lista actualizada en el almacenamiento local
        localStorage.setItem('favoritos', JSON.stringify(favoritos));

        // Actualizar la interfaz de usuario o realizar otras acciones si es necesario
        console.log('País agregado a favoritos:', pais.name.common);
        mostrarFavoritos();
    } else {
        console.log('El país ya está en la lista de favoritos.');
    }
};

const mostrarFavoritos = () => {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const container = document.getElementById('favoritos');
    container.innerHTML = '';

    favoritos.forEach(fav => {
        // Crear un elemento div para el nombre del país favorito
        const favoritoNombreElement = document.createElement('div');
        favoritoNombreElement.className = 'favorito-nombre';
        favoritoNombreElement.textContent = fav.name.common;
        favoritoNombreElement.addEventListener('click', () => {
            mostrarDetalles(fav.name.common, fav.population, fav.region, fav.capital, fav.languages);
        });

        // Crear un botón de remover para cada país favorito
        const removerButton = document.createElement('button');
        removerButton.textContent = 'x';
        removerButton.classList.add('botonRemover');
        removerButton.addEventListener('click', () => {
            removerDeFavoritos(fav.name.common);
        });

        // Crear un elemento div para contener el nombre y el botón
        const favoritoElement = document.createElement('div');
        favoritoElement.className = 'favorito';
        favoritoElement.appendChild(favoritoNombreElement);
        favoritoElement.appendChild(removerButton);

        // Agregar el elemento favorito al contenedor principal
        container.appendChild(favoritoElement);
    });
};

const removerDeFavoritos = (nombrePais) => {
    // Obtener la lista de favoritos del almacenamiento local
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    // Filtrar la lista para excluir el país a remover
    favoritos = favoritos.filter(fav => fav.name.common !== nombrePais);

    // Guardar la lista actualizada en el almacenamiento local
    localStorage.setItem('favoritos', JSON.stringify(favoritos));

    // Mostrar la lista de favoritos actualizada
    mostrarFavoritos();
};

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

    const favoritosButton = document.createElement('button');
    favoritosButton.textContent = 'Agregar a Favoritos';
    favoritosButton.addEventListener('click', () => {
        agregarAFavoritos(pais);
    });

    container.appendChild(h2);
    container.appendChild(img);
    container.appendChild(button);
    container.appendChild(favoritosButton);

    return container;
}

const filtroContinente = document.getElementById('filtroContinente');
filtroContinente.addEventListener('change', () => {
    cargarApiCountries();
});

// Mostrar favoritos al cargar la página
mostrarFavoritos();

cargarApiCountries();