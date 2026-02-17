/* Part 1/2/3 combined: RecipeJS with IIFE, recursion, and event delegation */

const RecipeApp = (function() {
  // ----- Private Data -----
  const recipes = [
    {
      id: 1,
      title: "Spaghetti Bolognese",
      difficulty: "easy",
      time: 25,
      category: "pasta",
      ingredients: ["200g spaghetti", "200g minced beef", "1 onion", "2 cloves garlic", "400g canned tomatoes", "Olive oil", "Salt", "Pepper"],
      steps: [
        "Boil water and cook spaghetti according to package",
        "Sauté onion and garlic in olive oil",
        {
          text: "Make the sauce",
          substeps: [
            "Add minced beef and brown",
            "Pour in tomatoes and simmer 10 minutes",
            {
              text: "Season the sauce",
              substeps: ["Add salt", "Add pepper", "Add a pinch of sugar if too acidic"]
            }
          ]
        },
        "Combine pasta with sauce and serve"
      ]
    },
    {
      id: 2,
      title: "Chicken Curry",
      difficulty: "medium",
      time: 45,
      category: "curry",
      ingredients: ["500g chicken pieces", "2 onions", "2 tomatoes", "2 cloves garlic", "1 tbsp curry powder", "200ml coconut milk", "Salt", "Oil"],
      steps: [
        "Chop onions, garlic and tomatoes",
        "Sear chicken pieces until browned",
        {
          text: "Build the curry base",
          substeps: ["Sauté onions and garlic","Add curry powder and toast briefly","Add tomatoes and cook until soft"]
        },
        "Add chicken back, pour coconut milk and simmer until cooked",
        "Adjust seasoning and serve with rice"
      ]
    },
    {
      id: 3,
      title: "Beef Wellington",
      difficulty: "hard",
      time: 90,
      category: "meat",
      ingredients: ["1kg beef fillet","250g mushrooms","Parma ham","Puff pastry","1 egg","Salt","Pepper"],
      steps: [
        "Season and sear the beef, then cool",
        {
          text: "Prepare duxelles",
          substeps: ["Finely chop mushrooms","Cook until moisture evaporates","Cool mixture"]
        },
        "Wrap beef with ham and duxelles in pastry",
        "Brush with egg wash and bake until golden",
        "Rest 10 minutes then slice to serve"
      ]
    },
    {
      id: 4,
      title: "Grilled Cheese Sandwich",
      difficulty: "easy",
      time: 10,
      category: "snack",
      ingredients: ["2 slices bread","2 slices cheddar","Butter"],
      steps: ["Butter bread","Place cheese between slices","Grill in pan until golden and cheese melts","Slice and serve"]
    },
    {
      id: 5,
      title: "Vegetable Stir Fry",
      difficulty: "medium",
      time: 20,
      category: "vegetarian",
      ingredients: ["Mixed vegetables","2 tbsp soy sauce","1 tbsp sesame oil","1 clove garlic","Ginger","Salt"],
      steps: ["Prepare and chop vegetables","Heat wok with oil","Stir-fry garlic and ginger","Add vegetables and toss with soy sauce until tender","Serve immediately"]
    },
    {
      id: 6,
      title: "Pancakes",
      difficulty: "easy",
      time: 15,
      category: "breakfast",
      ingredients: ["1 cup flour","1 cup milk","1 egg","1 tbsp sugar","Butter for frying"],
      steps: ["Mix flour, milk and egg into a smooth batter","Heat pan and melt a little butter","Pour batter and cook until bubbles form","Flip and cook other side until golden","Serve with syrup or butter"]
    },
    {
      id: 7,
      title: "Lasagna",
      difficulty: "hard",
      time: 60,
      category: "pasta",
      ingredients: ["Lasagna sheets","500g minced beef","400g tomato sauce","Bechamel sauce","Mozzarella","Parmesan","Salt","Pepper"],
      steps: [
        "Prepare the meat ragu and bechamel sauce",
        {
          text: "Assemble lasagna layers",
          substeps: [
            "Spread a layer of ragu",
            "Place lasagna sheets",
            "Add bechamel and cheese",
            {
              text: "Repeat layers",
              substeps: ["End with bechamel and cheese on top"]
            }
          ]
        },
        "Bake until bubbling and golden",
        "Rest 10 minutes before serving"
      ]
    },
    {
      id: 8,
      title: "Caesar Salad",
      difficulty: "easy",
      time: 15,
      category: "salad",
      ingredients: ["Romaine lettuce","Croutons","Parmesan","Caesar dressing","Chicken (optional)"],
      steps: ["Chop lettuce","Toss with dressing","Add croutons and parmesan","Top with sliced chicken if using","Serve chilled"]
    }
  ];

  // ----- State -----
  let currentFilter = 'all';
  let currentSort = 'none';

  // DOM refs (populated on init)
  let recipeContainer;
  let filterButtons;
  let sortButtons;

  // ----- Pure Helpers -----
  const filterByDifficulty = (list, difficulty) => list.filter(r => r.difficulty === difficulty);
  const filterByTime = (list, maxTime) => list.filter(r => r.time <= maxTime);
  const applyFilter = (list, filterType) => {
    switch (filterType) {
      case 'easy': case 'medium': case 'hard': return filterByDifficulty(list, filterType);
      case 'quick': return filterByTime(list, 30);
      case 'all': default: return list;
    }
  };

  const sortByName = (list) => [...list].sort((a,b) => a.title.localeCompare(b.title));
  const sortByTime = (list) => [...list].sort((a,b) => a.time - b.time);
  const applySort = (list, sortType) => {
    switch (sortType) {
      case 'name': return sortByName(list);
      case 'time': return sortByTime(list);
      case 'none': default: return list;
    }
  };

  // ----- Recursive steps renderer -----
  const renderSteps = (steps, level = 0) => {
    if (!steps || steps.length === 0) return '';
    let html = `<ol class="steps level-${level}">`;
    steps.forEach(step => {
      if (typeof step === 'string') {
        html += `<li>${step}</li>`;
      } else if (step && typeof step === 'object' && step.text) {
        html += `<li>${step.text}${renderSteps(step.substeps || [], level + 1)}</li>`;
      }
    });
    html += '</ol>';
    return html;
  };

  // ----- Card template -----
  const createRecipeCard = (r) => {
    return `
      <div class="recipe-card" data-recipe-id="${r.id}">
        <h3>${r.title}</h3>
        <div class="recipe-meta">
          <span class="difficulty ${r.difficulty}">${r.difficulty}</span>
          <span>${r.time} mins</span>
          <span>${r.category}</span>
        </div>
        <div class="card-controls" style="margin-top:.6rem;">
          <button class="toggle-btn" data-toggle="ingredients" data-recipe-id="${r.id}">Show Ingredients</button>
          <button class="toggle-btn" data-toggle="steps" data-recipe-id="${r.id}">Show Steps</button>
        </div>
        <div class="ingredients-container" data-recipe-id="${r.id}">
          <ul>
            ${r.ingredients.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>
        <div class="steps-container" data-recipe-id="${r.id}">
          ${renderSteps(r.steps)}
        </div>
      </div>
    `;
  };

  // ----- Render / Display -----
  const renderRecipes = (list) => {
    recipeContainer.innerHTML = list.map(createRecipeCard).join('');
  };

  const updateActiveButtons = () => {
    if (!filterButtons || !sortButtons) return;
    filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === currentFilter));
    sortButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.sort === currentSort));
  };

  const updateDisplay = () => {
    let list = recipes;
    list = applyFilter(list, currentFilter);
    list = applySort(list, currentSort);
    renderRecipes(list);
    updateActiveButtons();
    console.log(`Displaying ${list.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`);
  };

  // ----- Event Handlers -----
  const handleFilterClick = (e) => {
    const f = e.target.dataset.filter;
    if (!f) return;
    currentFilter = f;
    updateDisplay();
  };

  const handleSortClick = (e) => {
    const s = e.target.dataset.sort;
    if (!s) return;
    currentSort = s;
    updateDisplay();
  };

  // Event delegation for toggle buttons inside recipe container
  const handleToggleClick = (e) => {
    const btn = e.target.closest('.toggle-btn');
    if (!btn) return;
    const recipeId = btn.dataset.recipeId;
    const toggleType = btn.dataset.toggle; // 'steps' or 'ingredients'
    const container = document.querySelector(`.${toggleType}-container[data-recipe-id="${recipeId}"]`);
    if (!container) return;
    container.classList.toggle('visible');
    btn.textContent = container.classList.contains('visible') ? `Hide ${toggleType.charAt(0).toUpperCase()+toggleType.slice(1)}` : `Show ${toggleType.charAt(0).toUpperCase()+toggleType.slice(1)}`;
  };

  // ----- Setup Listeners -----
  const setupEventListeners = () => {
    filterButtons = document.querySelectorAll('[data-filter]');
    sortButtons = document.querySelectorAll('[data-sort]');
    filterButtons.forEach(b => b.addEventListener('click', handleFilterClick));
    sortButtons.forEach(b => b.addEventListener('click', handleSortClick));

    // Delegated listener for toggle buttons
    recipeContainer.addEventListener('click', handleToggleClick);
  };

  // ----- Public API -----
  return {
    init: function() {
      console.log('RecipeApp initializing...');
      recipeContainer = document.getElementById('recipe-container');
      if (!recipeContainer) {
        console.error('No #recipe-container element found.');
        return;
      }
      setupEventListeners();
      updateDisplay();
      console.log('RecipeApp ready!');
    },
    updateDisplay: updateDisplay
  };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', RecipeApp.init);
