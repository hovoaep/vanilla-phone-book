class PhoneBook {
  constructor() {
    this.drawing();
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
    return `<tr data-id=${data.id ? data.id : Date.now()}>
              <td>${data.name}</td>
              <td>${data.number}</td>
              <td><button type="button" data-toggle="modal" data-target="#editModal" class="btn btn-primary"><i class="fas fa-edit"></i></button><button class="btn btn-danger remove-phone"><i class="fas fa-trash"></i></button></td>
            </tr>`;
  }
  drawing(data = this.getDataFromStorage()) {
    let parrent = document.querySelector("tbody");
    parrent.innerHTML = "";
    data.forEach(item => {
      parrent.innerHTML += this.makeHtml(item);
    });
    this.addEvent();

    this.modal();
    this.removeEvent();
  }
  addEvent() {
    let form = document.querySelector("#phone-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      let name = document.querySelector("#full-name").value;
      let number = document.querySelector("#phone-number").value;
      if (name.length > 0 && number.length > 0) {
        let obj = {
          name,
          number,
          id: Date.now()
        };
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
        this.drawing(data);
      });
    });
  }
  modal() {
    document.querySelectorAll(`[data-toggle="modal"]`).forEach(item => {
      item.addEventListener("click", e => {
        let id = e.target.closest("tr").getAttribute("data-id");
        let data = this.getDataFromStorage();
        data = data.filter(item => {
          return item.id === Number(id);
        });
        let modal = document.querySelector("#editModal");
        modal.querySelector("#full-name-edit").value = data[0].name;
        modal.querySelector("#phone-number-edit").value = data[0].number;
        modal.querySelector(".save-edit-form").setAttribute("data-id", id);
      });
    });
    document.querySelector(".save-edit-form").addEventListener("click", e => {
      e.preventDefault();
      let name = document.querySelector("#full-name-edit").value;
      let number = document.querySelector("#phone-number-edit").value;
      let id = Number(e.target.getAttribute("data-id"));
      if (name.length > 0 && number.length > 0) {
        let data = this.getDataFromStorage();
        let newObj = {
          name,
          number,
          id: Date.now()
        };
        data = data.map(item => {
          return item.id === id ? newObj : item;
        });
        console.log(data);
        this.setDataToStorage(data);
        this.drawing();
      }
    });
  }
  removeEvent() {
    document.querySelectorAll(".remove-phone").forEach(item => {
      item.addEventListener("click", e => {
        let data = this.getDataFromStorage();
        let id = e.target.closest("tr").getAttribute("data-id");
        let newData = data.filter(item => item.id !== Number(id));
        this.setDataToStorage(newData);
        this.drawing();
      });
    });
  }
}

new PhoneBook();
