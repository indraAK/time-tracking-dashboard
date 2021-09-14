const dashboard = document.querySelector(".dashboard");
const navLinks = document.querySelectorAll(".nav-link");

let data = [];

navLinks.forEach((navLink) => {
  navLink.addEventListener("click", (e) => {
    e.preventDefault();
    const currentActive = document.querySelector(".nav-link.active") || null;
    currentActive.classList.remove("active");
    navLink.classList.add("active");
    const timeFrame = navLink.dataset.timeframe;
    if (data.length === 0) return;
    updateCard(timeFrame);
  });
});

function updateCard(timeFrame) {
  const cards = document.querySelectorAll(".dashboard .card:not(:first-child)");

  data.forEach((taskData, idx) => {
    const currentTimeFrame = taskData.timeframes[timeFrame];
    const card = cards[idx];
    const current = card.querySelector("#current");
    const previous = card.querySelector("#previous");
    current.textContent = `${currentTimeFrame.current}hrs`;
    previous.textContent = `Last Week - ${currentTimeFrame.previous}hrs`;
  });
}

async function fetchData() {
  try {
    const res = await fetch("/assets/data.json");
    data = await res.json();
    renderData(data);
  } catch (err) {
    console.log(err.message);
  }
}

function renderData(tasksData) {
  tasksData.forEach((task) => {
    dashboard.appendChild(createCard(task));
  });
}

function createCard(task) {
  const { weekly } = task.timeframes;
  const classTitle = task.title.toLowerCase().split(" ").join("-");

  const card = document.createElement("div");
  card.className = `card card-${classTitle}`;
  card.innerHTML = `
   <div class="card-header"></div>
   <div class="card-content">
      <div class="card-content-1">
         <h3 class="card-title">${task.title}</h3>
         <button class="more">
            <svg width="21" height="5" xmlns="http://www.w3.org/2000/svg">
               <path
               d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
               fill="#BBC0FF"
               fill-rule="evenodd"
               />
            </svg>
         </button>
      </div>
      <div class="card-content-2">
         <p class="current" id="current">${weekly.current}hrs</p>
         <p class="text-muted" id="previous">Last Week - ${weekly.previous}hrs</p>
      </div>
   </div>
   `;

  return card;
}

fetchData();
