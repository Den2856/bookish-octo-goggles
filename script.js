const MIN_VALUE = 0;
const MAX_VALUE = 100;

function normalizeValue(value) {
  const numericValue = Number.parseInt(value, 10);

  if (Number.isNaN(numericValue)) {
    return MIN_VALUE;
  }

  return Math.min(MAX_VALUE, Math.max(MIN_VALUE, numericValue));
}

function createProgressBlock(root) {
  const elements = {
    display: root.querySelector("[data-display]"),
    ring: root.querySelector("[data-ring]"),
    circle: root.querySelector("[data-progress-circle]"),
    valueInput: root.querySelector("[data-value-input]"),
    animateInput: root.querySelector("[data-animate-input]"),
    hideInput: root.querySelector("[data-hide-input]"),
  };

  const radius = Number(elements.circle.getAttribute("r"));
  const circumference = 2 * Math.PI * radius;

  const state = {
    value: normalizeValue(elements.valueInput.value),
    animated: elements.animateInput.checked,
    hidden: elements.hideInput.checked,
  };

  elements.circle.style.strokeDasharray = `${circumference}`;

  function renderValue() {
    const ratio = state.value / MAX_VALUE;
    const dashOffset = circumference * (1 - ratio);

    elements.circle.style.strokeDashoffset = `${dashOffset}`;
    elements.valueInput.value = String(state.value);
  }

  function renderAnimated() {
    elements.ring.classList.toggle("is-animated", state.animated);
    elements.animateInput.checked = state.animated;
  }

  function renderHidden() {
    elements.display.classList.toggle("is-hidden", state.hidden);
    elements.hideInput.checked = state.hidden;
  }

  function render() {
    renderValue();
    renderAnimated();
    renderHidden();
  }

  function setValue(value) {
    state.value = normalizeValue(value);
    renderValue();
  }

  function setAnimated(animated) {
    state.animated = Boolean(animated);
    renderAnimated();
  }

  function setHidden(hidden) {
    state.hidden = Boolean(hidden);
    renderHidden();
  }

  elements.valueInput.addEventListener("input", (event) => {
    const { value } = event.target;

    if (value === "") {
      return;
    }

    setValue(value);
  });

  elements.valueInput.addEventListener("blur", () => {
    elements.valueInput.value = String(state.value);
  });

  elements.animateInput.addEventListener("change", (event) => {
    setAnimated(event.target.checked);
  });

  elements.hideInput.addEventListener("change", (event) => {
    setHidden(event.target.checked);
  });

  render();

  return {
    setValue,
    setAnimated,
    setHidden,
  };
}

const progressRoot = document.querySelector("[data-progress-root]");

window.progressApi = createProgressBlock(progressRoot);


