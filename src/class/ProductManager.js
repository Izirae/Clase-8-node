import fs from "fs";

export default class ProductManager {
    constructor() {
        this.path = "src/class/files/Cars.json"
    }

    getCars = async (limit) => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(data);
            if (limit) {
                return products.slice(0, limit);
            } else {
                return products;
            }
        } else {
            const folder = this.path.replace('/Cars.json', '');
            if (!fs.existsSync(folder)) {
                await fs.promises.mkdir(folder)
            }
            return [];
        }
    };

    addCar = async (data) => {
        const car = data;
        const cars = await this.getCars()

        if (cars.length) {
            car.id = cars[cars.length - 1].id + 1
        } else {
            car.id = 1
        }

        const existe = cars.filter(e => e.code === car.code)

        if (existe.length) {
            return console.error(`El código ${car.code} ya se encuentra REGISTRADO`)
        }

        if (!car.status) {
            car.status = true
        }

        if (car.brand,
            car.model,
            car.price,
            car.image,
            car.code,
            car.stock,
            car.status) {
            cars.push(car);

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(cars, null, "\t")
            );
            return cars;
        } else {
            console.error('Todos los campos son obligatorios. Revise los datos para poder continuar')
        }

    }

    getCarById = async (id) => {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const JsonData = JSON.parse(data);
        const exist = JsonData.filter((e) => e.id === id);

        if (exist.length !== 0) {
            console.log(`este es el producto con el id ${id}, `, exist);
            return exist
        } else {
            return console.error(`El producto con el id ${id} no existe`);
        }
    };

    updateCarById = async (id, product) => {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const jsonData = JSON.parse(data);

        jsonData.forEach((e) => {
            for (let prop in product) {
                if (id === e["id"]) {
                    e[prop] = product[prop]
                }
            }
        })

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(jsonData, null, "\t")
        );
        console.log(`Se modificó el producto con id ${id}`)
        return jsonData.filter((e) => e.id === id);
    };
}
