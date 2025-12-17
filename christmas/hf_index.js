//@ts-nocheck
/**
 * @typedef {{what: string, who1: string, muszak1: string, who2?: string, muszak2?: string}} TableData
 * @typedef {{label: string, id: string, type: "text" | "checkbox" | "select"}} FormInput
 * @typedef {{label: string, value: string}} SelectOption
 */

/**
 * @type {TableData[]}
 */
const tableData = [
  {
    what: "Logisztika",
    who1: "Kovács Máté",
    muszak1: "Délelöttös",
    who2: "Kovács József",
    muszak2: "Délutános",
  },
  { what: "Könyvelés", who1: "Szabó Anna", muszak1: "Éjszakai" },
  {
    what: "Játékfejlesztés",
    who1: "Varga Péter",
    muszak1: "Délutános",
    who2: "Nagy Eszter",
    muszak2: "Éjszakai",
  },
];

/**
 * @type {string[]}
 */
const headers = ["Osztály", "Manó neve", "Műszak"];

const jssection = createElement("div", document.body);
jssection.id = "jssection";
jssection.classList.add("hide");
const table = createElement("table", jssection);
const thead = createElement("thead", table);
const headerRow = createElement("tr", thead);

for (const header of headers) {
  createCell("th", header, headerRow);
}

const tbody = createElement("tbody", table);
renderTbody(tableData);

/**
 * Rendereli a table body-t.
 * @param {TableData[]} data
 * @returns {void}
 */
function renderTbody(data) {
  tbody.innerHTML = "";
  for (const row of data) {
    const tr = createElement("tr", tbody);
    const osztaly = createCell("td", row.what, tr);
    createCell("td", row.who1, tr);
    createCell("td", row.muszak1, tr);

    if (row.who2 && row.muszak2) {
      osztaly.rowSpan = 2;

      const tr2 = createElement("tr", tbody);
      createCell("td", row.who2, tr2);
      createCell("td", row.muszak2, tr2);
    }
  }
}

/**
 * @type {FormInput[]}
 */
const formData = [
  {
    label: "Osztály",
    id: "osztaly",
    type: "text",
  },
  {
    label: "Manó 1",
    id: "mano1",
    type: "text",
  },
  {
    label: "Manó 1 Műszak",
    id: "muszak1",
    type: "select",
  },
  {
    label: "Két manót veszek fel",
    id: "masodikmano",
    type: "checkbox",
  },
  {
    label: "Manó 2",
    id: "mano2",
    type: "text",
  },
  {
    label: "Manó 2 Műszak",
    id: "muszak2",
    type: "select",
  },
];

/**
 * @type {SelectOption[]}
 */
const muszakok = [
  {
    label: "Válassz műszakot!",
    value: "",
  },
  {
    label: "Délelöttös",
    value: "1",
  },
  {
    label: "Délutános",
    value: "2",
  },
  {
    label: "Éjszakai",
    value: "3",
  },
];

const form = createElement("form", jssection);
for (const inputGroup of formData) {
  createFormInput(inputGroup, form);
}
const button = createElement("button", form);
button.innerText = "Felvétel";

/**
 * Létrehoz egy form input csoportot és appendeli.
 * @param {FormInput} formInput
 * @param {HTMLElement} parent
 */
function createFormInput(formInput, parent) {
  const div = createElement("div", parent);
  if (formInput.type == "checkbox") {
    const checkbox = createElement("input", div);
    checkbox.type = "checkbox";
    checkbox.id = formInput.id;
    createElement("br", div);
    const label = createElement("label", div);
    label.innerText = formInput.label;
  } else if (formInput.type == "select") {
    const label = createElement("label", div);
    label.innerText = formInput.label;
    createElement("br", div);
    const select = createElement("select", div);
    select.id = formInput.id;
    for (const muszak of muszakok) {
      const option = createElement("option", select);
      option.label = muszak.label;
      option.value = muszak.value;
    }
  } else {
    const label = createElement("label", div);
    label.innerText = formInput.label;
    createElement("br", div);
    const input = createElement("input", div);
    input.type = formInput.type;
    input.id = formInput.id;
  }
  createElement("br", div);
  const error = createElement("label", div);
  error.classList.add("error");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const osztaly = form.querySelector("#osztaly");
  const mano1 = form.querySelector("#mano1");
  const muszak1 = form.querySelector("#muszak1");
  const mano2 = form.querySelector("#mano2");
  const muszak2 = form.querySelector("#muszak2");

  const errors = form.querySelectorAll(".error");
  for (const error of errors) {
    error.innerText = "";
  }

  if (validateFields(osztaly, mano1, muszak1)) {
    /**
     * @type {TableData}
     */
    const mano = {
      what: osztaly.value,
      who1: mano1.value,
      muszak1: mapMuszak(muszak1.value),
      who2: mano2.value,
      muszak2: mapMuszak(muszak2.value),
    };

    createNewElement(mano, form, tableData);
    form.reset();
  }
});

/**
 * Validálja a megadott mezőket, hogy üresek-e, és ha azok, megjeleníti a hibaüzenetet és visszatér a validáció sikerességével.
 * @param  {...HTMLInputElement} fields A mezők amiket ellenőrizni kell
 * @returns {boolean}
 */
function validateFields(...fields) {
  let success = true;
  for (const field of fields) {
    if (!field.value) {
      const div = field.parentElement;
      const span = div.querySelector(".error");
      span.innerText = "Kötelező elem!";
      success = false;
    }
  }

  return success;
}

/**
 * Létrehoz egy cellát cellType alapján, beállítja neki szövegként a content-et és appendeli a parentRow-hoz.
 * @param {"th" | "td"} cellType
 * @param {string} content
 * @param {HTMLTableRowElement} parentRow
 * @returns {HTMLTableCellElement}
 */
function createCell(cellType, content, parentRow) {
  const cell = createElement(cellType, parentRow);
  cell.innerText = content;

  return cell;
}

/**
 * Létrehoz egy elementet és appendeli a parent-hez.
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tagName A létrehozandó element
 * @param {HTMLElement} parent Az element amihez appendeljük
 * @returns {HTMLElementTagNameMap[K]} A létrehozott element
 */
function createElement(tagName, parent) {
  const elem = document.createElement(tagName);
  parent.appendChild(elem);

  return elem;
}

initCheckbox(document.getElementById("masodikmano"));
initSelect(tableData);

document.getElementById("htmlform").addEventListener("submit", (e) => {
  e.preventDefault();
  const target = e.target;

  const mano = target.querySelector("#manochooser");
  const tevekenyseg1 = target.querySelector("#manotev1");
  const tevekenyseg2 = target.querySelector("#manotev2");

  const errors = target.querySelectorAll(".error");
  for (const error of errors) {
    error.innerText = "";
  }

  if (validateFields(mano, tevekenyseg1)) {
    const htmlTBody = document.getElementById("htmltbody");
    const tr = createElement("tr", htmlTBody);
    createCell("td", mano.value, tr);
    const td1 = createCell("td", tevekenyseg1.value, tr);
    if (tevekenyseg2.value) {
      createCell("td", tevekenyseg2.value, tr);
    } else {
      td1.colSpan = 2;
    }

    target.reset();
  }
});
