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
        try {
            const car = data;
            const cars = await this.getCars();

            const lastCar = cars[cars.length - 1];
            car.id = lastCar ? lastCar.id + 1 : 1;

            // Check if the car with the given code already exists
            const existe = cars.some((e) => e.code === car.code);
            if (existe) {
                console.error(`El código ${car.code} ya se encuentra REGISTRADO`);
            }
            if (!car.status) {
                car.status = true;
            }

            // Check if all required fields are present
            const requiredFields = ['brand', 'model', 'price', 'image', 'code', 'stock', 'status'];
            const hasAllFields = requiredFields.every((field) => car.hasOwnProperty(field));
            if (hasAllFields) {
                cars.push(car);
                await fs.promises.writeFile(this.path, JSON.stringify(cars, null, "\t"));
                return car;
            } else {
                console.error('Todos los campos son obligatorios. Revise los datos para poder continuar');
            }
        } catch (error) {
            throw new Error("Error al agregar el auto:", error.message);
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
        return jsonData.find((e) => e.id === id);
    };

    async deleteCar(id) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const jsonData = JSON.parse(data);
        const index = jsonData.findIndex(car => car.id === id);

        if (index !== -1) {
            jsonData.splice(index, 1);
            try {
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(jsonData, null, "\t")
                );
                return `El auto con id ${id} fue eliminado`
            } catch (error) {
                throw new Error('Error eliminando el auto');
            }
        } else {
            console.error('Product not found');
        }
    }
}
