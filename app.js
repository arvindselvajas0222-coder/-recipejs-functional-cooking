/************************************************
  PART 1 DATA (Your existing recipes array)
************************************************/

const recipes = [
  {
    id: 1,
    title: "Spaghetti Bolognese",
    difficulty: "easy",
    time: 25,
    category: "pasta"
  },
  {
    id: 2,
    title: "Chicken Curry",
    difficulty: "medium",
    time: 45,
    category: "curry"
  },
  {
    id: 3,
    title: "Beef Wellington",
    difficulty: "hard",
    time: 90,
    category: "meat"
  },
  {
    id: 4,
    title: "Grilled Cheese Sandwich",
    difficulty: "easy",
    time: 10,
    category: "snack"
  },
  {
    id: 5,
    title: "Vegetable Stir Fry",
    difficulty: "medium",
    time: 20,
    category: "vegetarian"
  },
  {
    id: 6,
    title: "Pancakes",
    difficulty: "easy",
    time: 15,
    category: "breakfast"
  },
  {
    id: 7,
    title: "Lasagna",
    difficulty: "hard",
    time: 60,
    category: "pasta"
  },
  {
    id: 8,
    title: "Caesar Salad",
    difficulty: "easy",
    time: 15,
    category: "salad"
  }
];


/************************************************
  STATE MANAGEMENT
************************************************/

let currentFilter = "all";
let currentSort = "none";


/************************************************
  DOM REFERENCES
************************************************/

const recipeContainer = document.getElementById("recipe-container");
const filterButtons = document.querySelectorAll("[data-filter]");
const sortButtons = document.querySelectorAll("[data-sort]");


/************************************************
  RENDER FUNCTION (from Part 1)
************************************************/

const createRecipeCard = (recipe) => {
  return `
    <div class="recipe-card">
      <h3>${recipe.title}</h3>
      <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
      <p><strong>Time:</strong> ${recipe.time} mins</p>
      <p><strong>Category:</strong> ${recipe.category}</p>
    </div>
  `;
};

const renderRecipes = (recipesArray) => {
  recipeContainer.innerHTML = recipesArray
    .map(recipe => createRecipeCard(recipe))
    .join("");
};


/************************************************
  FILTER FUNCTIONS (PURE)
************************************************/

const filterByDifficulty = (recipes, difficulty) => {
  return recipes.filter(recipe => recipe.difficulty === difficulty);
};

const filterByTime = (recipes, maxTime) => {
  return recipes.filter(recipe => recipe.time <= maxTime);
};

const applyFilter = (recipes, filterType) => {
  switch (filterType) {
    case "easy":
    case "medium":
    case "hard":
      return filterByDifficulty(recipes, filterType);
    case "quick":
      return filterByTime(recipes, 30);
    case "all":
    default:
      return recipes;
  }
};


/************************************************
  SORT FUNCTIONS (PURE)
************************************************/

const sortByName = (recipes) => {
  return [...recipes].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
};

const sortByTime = (recipes) => {
  return [...recipes].sort((a, b) =>
    a.time - b.time
  );
};

const applySort = (recipes, sortType) => {
  switch (sortType) {
    case "name":
      return sortByName(recipes);
    case "time":
      return sortByTime(recipes);
    case "none":
    default:
      return recipes;
  }
};


/************************************************
  UPDATE DISPLAY (MAIN CONTROLLER)
************************************************/

const updateDisplay = () => {
  let recipesToDisplay = recipes;

  recipesToDisplay = applyFilter(recipesToDisplay, currentFilter);
  recipesToDisplay = applySort(recipesToDisplay, currentSort);

  renderRecipes(recipesToDisplay);

  console.log(
    `Displaying ${recipesToDisplay.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`
  );
};


/************************************************
  UPDATE ACTIVE BUTTONS
************************************************/

const updateActiveButtons = () => {

  filterButtons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add("active");
    }
  });

  sortButtons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.sort === currentSort) {
      btn.classList.add("active");
    }
  });

};


/************************************************
  EVENT HANDLERS
************************************************/

const handleFilterClick = (event) => {
  currentFilter = event.target.dataset.filter;
  updateActiveButtons();
  updateDisplay();
};

const handleSortClick = (event) => {
  currentSort = event.target.dataset.sort;
  updateActiveButtons();
  updateDisplay();
};


/************************************************
  SETUP EVENT LISTENERS
************************************************/

const setupEventListeners = () => {

  filterButtons.forEach(button =>
    button.addEventListener("click", handleFilterClick)
  );

  sortButtons.forEach(button =>
    button.addEventListener("click", handleSortClick)
  );

};


/************************************************
  INITIALIZATION
************************************************/

setupEventListeners();
updateDisplay();
