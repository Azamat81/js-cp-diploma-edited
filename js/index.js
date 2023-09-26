let Request = "event=update";
document.addEventListener("DOMContentLoaded", () => {
  getRequest(Request, (response) => {
    let main = document.querySelector("main");

    const films = response.films.result;
    const halls = response.halls.result;
    const seances = response.seances.result;

    let Timer = new Date().getHours() + "" + new Date().getMinutes();
    console.log(Timer);

    function seancesDisabled(seanceTime, film, hall, seance) {
      let day = new Date(Today.getTime());
      let markTime = Math.trunc(day / 1000);
      if (Timer - seanceTime.replace(/[^+\d]/g, "") < 0) {
        return `<li class="movie-seances__time-block ">
        <a class="movie-seances__time" href="hall.html" data-film-name="${film.film_name}" data-film-id="${film.film_id}" data-hall-id="${hall.hall_id}" data-hall-name="${hall.hall_name}" data-price-vip="${hall.hall_price_vip}" data-price-standart="${hall.hall_price_standart}" data-seance-id="${seance.seance_id}"  data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}" data-seanceTimeStamp="${markTime}">
        ${seanceTime}
      </a>
      </li>`;
      } else {
        `<li class="movie-seances__time-block ">
      <a class="movie-seances__time acceptin-button-disabled" href="hall.html" data-film-name="${film.film_name}" data-film-id="${film.film_id}" data-hall-id="${hall.hall_id}" data-hall-name="${hall.hall_name}" data-price-vip="${hall.hall_price_vip}" data-price-standart="${hall.hall_price_standart}" data-seance-id="${seance.seance_id}"  data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}" data-seanceTimeStamp="${markTime}">
        ${seanceTime}
      </a>
      </li>`;
      }
    }
    for (let i = 0; i < films.length; i++) {
      let filmState = {};
      for (let k = 0; k < seances.length; k++) {
        //мы ищем совпадение сенса и фильма по id
        if (seances[k].seance_filmid === films[i].film_id) {
          halls.forEach((el) => {
            //когда совпадение находиться, мы ищем в каком зале проходит сеанс и исключаем закрытые залы
            if (el.hall_id === seances[k].seance_hallid && el.hall_open == 1) {
              //находим по ид залл чтобы взять оттуда название зала, потом закидываем
              // все в массив, чтобы потом вложить эти данные в HTML
              filmState[el.hall_name]
                ? filmState[el.hall_name].push(
                    seancesDisabled(
                      seances[k].seance_time,
                      films[i],
                      el,
                      seances[k]
                    )
                  )
                : (filmState[el.hall_name] = [
                    seancesDisabled(
                      seances[k].seance_time,
                      films[i],
                      el,
                      seances[k]
                    ),
                  ]);
            }
          });

          setTimeout(() => {
            let movieSeances = Array.from(
              document.querySelectorAll(".movie-seances__time")
            );

            console.log(movieSeances);

            movieSeances.forEach((movieSeance) =>
              movieSeance.addEventListener("click", (event) => {
                let selectedSeance = event.target.dataset;
                selectedSeance.hallConfig = halls.find(
                  (hall) => hall.hall_id == selectedSeance.hallId
                ).hall_config;
                console.log(selectedSeance);
                localStorage.setItem(
                  "selectedSeance",
                  JSON.stringify(selectedSeance)
                );
              })
            );
          }, 100);
        }
      }
      let hallSeances = "";
      // здесь мы иттерируем объект и проходимся циклом по вложенным в ключи объекта массивам, чтобы все данные срастить между собой и вложить внизу в тэг
      for (key in filmState) {
        let seance = "";
        for (let y = 0; y < key.length; y++) {
          seance += filmState[key][y];
        }
        hallSeances += `<div class="movie-seances__hall">
        <h3 class="movie-seances__hall-title">${key}</h3>
        <ul class="movie-seances__list">
            ${seance}
        </ul>
      </div>`;
      }

      main.innerHTML += `
  <section class="movie">
<div id='${films[i].film_id}' class="movie__info">
  <div class="movie__poster">
    <img
      class="movie__poster-image"
      alt="${films[i].film_name}"
      src="${films[i].film_poster}"
    />
  </div>
  <div class="movie__description">
    <h2 class="movie__title">
    ${films[i].film_name}
    </h2>
    <p class="movie__synopsis">
    ${films[i].film_description}
    </p>
    <p class="movie__data">
      <span class="movie__data-duration">продолжительность ${films[i].film_duration} минут</span>
    </p>
    <p class="movie__data">
      <span class="movie__data-origin">произвоство ${films[i].film_origin}</span>
    </p>
  </div>
</div>
${hallSeances}
</section> `;
    }
  });

  let DNum = document.querySelectorAll(".page-nav__day-number");

  let DWeek = document.querySelectorAll(".page-nav__day-week");

  const Week = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  let Today = new Date();

  Today.setHours(0, 0, 0);
  for (let i = 0; i < DNum.length; i++) {
    let day = new Date(Today.getTime() + i * 24 * 60 * 60 * 1000);
    let timeStamp = Math.trunc(day / 1000);

    DNum[i].innerHTML = `${day.getDate()},`;
    DWeek[i].innerHTML = `${Week[day.getDay()]}`;

    let dayOff = DNum[i].parentNode;
    dayOff.dataset.timeStamp = timeStamp;
    if (DWeek[i].innerHTML == "Вс" || DWeek[i].innerHTML == "Сб") {
      dayOff.classList.add("page-nav__day_weekend");
    }
  }

  let dayLinks = Array.from(document.querySelectorAll(".page-nav__day"));

  dayLinks.forEach((dayLink) =>
    dayLink.addEventListener("click", (event) => {
      event.preventDefault();
      document
        .querySelector(".page-nav__day_chosen")
        .classList.remove("page-nav__day_chosen");

      dayLink.classList.add("page-nav__day_chosen");

      let timeStampDay = Number(event.target.dataset.timeStamp);

      if (isNaN(timeStampDay)) {
        timeStampDay = Number(
          event.target.closest(".page-nav__day").dataset.timeStamp
        );
      }
    })
  );

  dayLinks[0].click();
});
