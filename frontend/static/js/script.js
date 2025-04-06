fetch("http://127.0.0.1:8000/api/recipes")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("recipe-list");
    data.forEach(recipe => {
      const li = document.createElement("li");
      li.textContent = recipe.title;
      list.appendChild(li);
    });
  })
  .catch(err => console.error("Error fetching recipes:", err));
