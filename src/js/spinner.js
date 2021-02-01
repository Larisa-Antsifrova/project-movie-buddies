const spinner = {
  spinnerRef: document.querySelector('.loader'),
  show() {
    this.spinnerRef.style.display = 'block';
  },
  hide() {
    this.spinnerRef.style.display = 'none';
  },
};

export { spinner };
