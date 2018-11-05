class PhoneBook {
  constructor() {
    this.drawing();
    this.addEvent();
    this.sort();
  }

  getDataFromStorage() {
    const data = localStorage.getItem("phoneBook");
    return data ? JSON.parse(data) : [];
  }
  setDataToStorage(data) {
    localStorage.setItem("phoneBook", JSON.stringify(data));
  }
  makeHtml(data) {
    return `<tr>
              <td>${data.name}</td>
              <td>${data.number}</td>
            </tr>`;
  }
  drawing() {
    const data = this.getDataFromStorage();
    let parrent = document.querySelector("tbody");
    parrent.innerHTML = "";
    data.forEach(item => {
      parrent.innerHTML += this.makeHtml(item);
    });
  }
  addEvent() {
    let form = document.querySelector("#phone-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      let name = document.querySelector("#full-name").value;
      let number = document.querySelector("#phone-number").value;
      if (name.length > 0 && number.length > 0) {
        let obj = { name, number };
        let data = this.getDataFromStorage();
        data.push(obj);
        this.setDataToStorage(data);
        this.drawing();
        form.reset();
      }
    });
  }
  sort() {
    document.querySelectorAll(".sort-icon").forEach(item => {
      item.addEventListener("click", e => {
        let hasClass = e.target.classList.contains("arrow-up");
        let bo = hasClass ? 1 : -1;
        let key = e.target.parentElement.textContent.trim().toLocaleLowerCase();
        if (hasClass) {
          e.target.classList.remove("arrow-up");
          e.target.classList.add("arrow-down");
        } else {
          e.target.classList.add("arrow-up");
          e.target.classList.remove("arrow-down");
        }
        let data = this.getDataFromStorage();
        data.sort((a, b) => {
          let nameA = a[key].toLowerCase();
          let nameB = b[key].toLowerCase();
          if (nameA < nameB) return -1 * bo;
          if (nameA > nameB) return 1 * bo;
          return 0;
        });
        this.setDataToStorage(data);
        this.drawing();
      });
    });
  }
}

new PhoneBook();
