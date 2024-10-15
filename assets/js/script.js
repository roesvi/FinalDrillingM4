// Función generadora para controlar el conteo de eventos
function* contarEventos(n) {
    const limit = n === 1 ? 5 : 6;
    for (let count = 0; count < limit; count++) {
        yield count;
    }
}

// Crear generadores para cada data-index
const generadores = {
    1: contarEventos(1),
    6: contarEventos(6),
    12: contarEventos(12),
};

async function fetchStarWarsDatos(index) {
    const url = `https://swapi.dev/api/people/${index}/`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        createCard({
            name: data.name,
            height: data.height,
            mass: data.mass,
            index
        }, getColor(index));
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Obtener el color basado en el índice
function getColor(index) {
    if (index >= 1 && index <= 5) return "rgb(204, 65, 65)";
    if (index >= 6 && index <= 10) return "rgb(78, 156, 78)";
    if (index >= 12 && index <= 16) return "rgb(46, 168, 177)";
}

// Función para crear y mostrar una card
function createCard(character, color) {
    const cardsContainer = document.getElementById(`cards${Math.floor((character.index - 1) / 5) + 1}`);
    const tarjeta = document.createElement("div");
    
    tarjeta.className = "card";
    tarjeta.innerHTML = `
        <div class="circleCard" style="background-color: ${color};"></div>
        <div class="text">
            <h3 class="nombre">${character.name}</h3>
            <p class="detalles">Estatura: ${character.height} cm - Peso: ${character.mass} kg</p>
        </div>
    `;
    
    cardsContainer.style.display = "flex";
    cardsContainer.style.flexWrap = "wrap";
    cardsContainer.appendChild(tarjeta);
    
    adjustCirclePositions();
}

const adjustedSections = new Set();

function adjustCirclePositions() {
    const sections = [1, 6, 12];
    sections.forEach(startIndex => {
        const cardsContainer = document.getElementById(`cards${Math.floor((startIndex - 1) / 5) + 1}`);
        const cards = cardsContainer.getElementsByClassName('card');

        if (cards.length === 4 && !adjustedSections.has(startIndex)) {
            const totalHeight = cards.length * 100;
            adjustPosition(startIndex, totalHeight);
            adjustedSections.add(startIndex);
        }
    });
}

// Ajustar posición de los círculos y texto
function adjustPosition(startIndex, totalHeight) {
    const currentCircleLine = document.querySelector(`.circleLine[data-index="${startIndex}"]`);
    const currentTextLeft = document.querySelector(`.text-left[data-index="${startIndex}"]`);

    if (currentCircleLine) {
        const newTop = getNewTop(startIndex, totalHeight);
        currentCircleLine.style.top = `${newTop}%`;
        if (currentTextLeft) {
            currentTextLeft.style.top = `${newTop}%`;
        }
        
        if (startIndex === 1 || startIndex === 6) {
            const nextStartIndex = startIndex === 1 ? 6 : 12;
            adjustNextPosition(nextStartIndex, totalHeight);
        }
    }
}

function adjustNextPosition(nextStartIndex, totalHeight) {
    const nextCircleLine = document.querySelector(`.circleLine[data-index="${nextStartIndex}"]`);
    const nextTextLeft = document.querySelector(`.text-left[data-index="${nextStartIndex}"]`);

    if (nextCircleLine) {
        const newNextTop = 50 + (totalHeight / window.innerHeight) * 15;
        nextCircleLine.style.top = `${newNextTop}%`;
        if (nextTextLeft) {
            nextTextLeft.style.top = `${newNextTop}%`;
        }
    }
}

function getNewTop(startIndex, totalHeight) {
    return (startIndex === 1 ? 20 : startIndex === 6 ? 50 : 80) + (totalHeight / window.innerHeight) * 15;
}

// Agregar el evento mouseover a cada elemento
document.querySelectorAll(".text-left").forEach(element => {
    element.addEventListener("mouseleave", () => {
        const dataIndex = element.getAttribute("data-index");
        const generador = generadores[dataIndex];
        const resultado = generador.next();

        if (!resultado.done) {
            fetchStarWarsDatos(parseInt(dataIndex) + resultado.value);
            console.log(`Llamando a la API con el índice: ${parseInt(dataIndex) + resultado.value}`);
        }
    });
});
