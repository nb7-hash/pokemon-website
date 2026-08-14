const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
let go_button = document.getElementById("Go");
let inputValue = document.getElementById("input_value");
let res = document.getElementById("result");
let parMsg = document.getElementById("err-msg");
let loading = document.getElementById("spinning");
let result_container = document.getElementById("result");

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hero-bg-video").forEach((video) => {
    video.muted = true;
    video.play().catch(() => {});
  });
});

const specialCards = document.querySelectorAll(".box1");

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("card-show");
      } else {
        entry.target.classList.remove("card-show");
      }
    });
  },
  {
    threshold: 0.5,
  },
);

specialCards.forEach((card) => {
  cardObserver.observe(card);
});

// Display Pokémon details
function setit(result) {
  const typeColors = {
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    steel: "#B8B8D0",
    normal: "#A8A878",
  };
  let image_container = document.createElement("div");
  let name_container = document.createElement("div");
  let type = document.createElement("p");
  let image_pok=document.createElement("img");
  image_pok.src="https://i.pinimg.com/736x/05/b5/f8/05b5f811d19e98684c60712428065446.jpg";
  image_pok.classList.add("ims-desktops");
  const types = result.types[0].type.name;
  const colors = typeColors[types.toLowerCase()];
  type.textContent = "Type: " + types;
  type.style.textAlign = "left";
  let image = document.createElement("img");
  image.classList.add("pokemon-photo", "pokemon-photo-desktop");
  image.src = result.sprites.front_default;
  image_container.appendChild(image);
  const rowLine = document.createElement("hr");
  rowLine.style.borderColor = "blue";
  let ids = document.createElement("p");
  ids.textContent = "ID: " + result.id;
  ids.style.textAlign = "left";
  let name = document.createElement("p");
  name.textContent = "Name: " + result.name.toUpperCase();
  name.style.textAlign = "left";
  let weight = document.createElement("p");
  weight.textContent = "Weight: " + result.weight;
  name_container.appendChild(image_pok);
  name_container.appendChild(ids);
  name_container.appendChild(name);
  name_container.appendChild(type);
  name_container.appendChild(weight);
  name_container.classList.add("info_containers");
  result_container.appendChild(image_container);
  result_container.appendChild(name_container);
  result_container.style.backgroundColor = colors;
  parMsg.textContent = "";
}

// Search Pokémon
async function searchPokemon() {
  const searchName = inputValue.value.toLowerCase().trim();
  if (searchName === "") {
    loading.classList.add("app-hidden");
    parMsg.textContent = "Please enter a Pokémon name.";
    return;
  }
  const url = `https://pokeapi.co/api/v2/pokemon/${searchName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Pokemon not found");
    }
    const data = await response.json();
    res.innerHTML = "";
    setit(data);
    inputValue.value = "";
  } catch (error) {
    loading.classList.add("app-hidden");
    res.innerHTML = "";
    parMsg.textContent = "Pokémon not found!";
  }
}

// Button Click
go_button.addEventListener("click", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  searchPokemon();
});

// Press Enter to Search
inputValue.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    searchPokemon();
  }
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("hamburger-open");
  navLinks.classList.toggle("nav-menu-open");
});

// Close menu when a link is clicked (nice for mobile UX)
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("hamburger-open");
    navLinks.classList.remove("nav-menu-open");
  });
});

const carousel = document.getElementById("carouselContainer");
const indicators = document.getElementById("indicators");

async function getPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=15");
  const data = await response.json();

  for (const [index, pokemon] of data.results.entries()) {
    const detailResponse = await fetch(pokemon.url);
    const pokemonData = await detailResponse.json();

    const active = index === 0 ? "active" : "";

    const hp = pokemonData.stats.find(
      (stat) => stat.stat.name === "hp",
    ).base_stat;

    // Create Indicator
    indicators.innerHTML += `
            <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="${index}"
                class="${active}"
                ${index === 0 ? 'aria-current="true"' : ""}
                aria-label="Slide ${index + 1}">
            </button>
        `;

    // Create Card
    carousel.innerHTML += `
        <div class="carousel-item ${active}">

            <div class="d-flex justify-content-center align-items-center vh-100">

                <div class="cards-container">

                    <img src="${pokemonData.sprites.other["official-artwork"].front_default}"
                        class="pokemon-card-img"
                        alt="${pokemonData.name}">

                    <h1 class="text-white">${pokemonData.name.toUpperCase()}</h1>

                    <div class="cards-body">

                        <div class="d-flex align-items-start mb-2">

                            <div class="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-3"
                                style="width:40px;height:40px;">
                                <i class="fa-solid fa-weight-scale" style="color: rgb(149, 121, 121);"></i>
                            </div>

                            <div class="flex-grow-1">
                                <h6 class="mb-0 fw-bold text-white">
                                    Weight
                                </h6>

                                <h6 class="text-light">
                                    ${pokemonData.weight} kg
                                </h6>
                            </div>

                            <span class="badge bg-warning text-dark fs-6 fw-bold">
                                HP ${hp}
                            </span>

                        </div>

                        <div class="progress"
                            style="height:12px;background:yellow;">

                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                                role="progressbar"
                                style="width:${hp}%"
                                aria-valuenow="${hp}"
                                aria-valuemin="0"
                                aria-valuemax="100">
                            </div>

                        </div>
                      
                    </div>
                       <div class="cards-body">

                        <div class="d-flex align-items-start mb-2">

                            <div class="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-3"
                                style="width:40px;height:40px;">
<i class="fa-solid fa-ruler-vertical" style="color: rgb(149, 121, 121);"></i>                            </div>

                            <div class="flex-grow-1">
                                <h6 class="mb-0 fw-bold text-white">
                                   Height
                                </h6>

                                <h6 class="text-light">
                                   ${pokemonData.height} mtr
                                </h6>
                            </div>

                            <span class="badge bg-warning text-dark fs-6 fw-bold">
                              ${pokemonData.types
                                .map((type) => type.type.name)
                                .join(", ")}

                            </span>

                        </div>

                        
                    </div>

                </div>

            </div>

        </div>
        `;
  }
}

getPokemon();
