const socket = io();

const table = document.getElementById('table');

function addCar(car) {
  const html = `
                <td class="py-5">${car.brand}</td>
                <td class="py-5">${car.model}</td>
                <td class="py-5">$${car.price}</td>
                <td><img style="max-width: 200px;" src="${car.image}"></td>
                <td class="py-5">${car.stock} unidades</td>
              `
  const tr = document.createElement('tr');
  tr.id = car._id;

  tr.innerHTML = html;
  table.appendChild(tr);
}

function deleteCar(carId) {
  console.log(carId, "hola")
  const car = document.getElementById(carId);
  console.log(car, "este estaba")

  if (car) {
    table.removeChild(car);
  }
}

function createCars(cars) {
  while (table.firstChild) {
    table.removeChild(table.firstChild)
  }

  Array.from(cars).forEach((car) => addCar(car));
}

socket.on('connect', () => {
  console.log('socket.io connected');
});

socket.on("addCar", (car) => {
  addCar(car);
});

socket.on("deleteCar", (carId) => {
  deleteCar(carId);
});

socket.on('initCars', (cars) => {
  createCars(cars);
});

socket.on("updateCar", (car) => {
  deleteCar(car._id);
  addCar(car);
});

socket.on('disconnect', () => {
  console.log('socket.io disconnected');
});