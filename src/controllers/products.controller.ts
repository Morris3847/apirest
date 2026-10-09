import { Request, Response } from "express";
import pool from "../conf/dbConnection";

const isValidId = (id: any): boolean => {
    return /^\d+$/.test(id) && Number(id) > 0;
};

const isValidPrice = (price: any): boolean => {

    if (typeof price !== "number") {
        return false;
    }

    if (!Number.isFinite(price)) {
        return false;
    }

    if (price <= 0) {
        return false;
    }

    const decimals: any = String(price).split(".")[1];

    if (decimals && decimals.length > 2) {
        return false;
    }

    return true;
};

export const getAllProducts = async (
    req: Request,
    res: Response
): Promise<any> => {

    try {

        const [rows]: any = await pool.execute(
            "SELECT * FROM products WHERE active = ?",
            [true]
        );

        return res.status(200).json(rows);

    } catch (error) {

        console.error("Error al obtener productos:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export const getProductById = async (
    req: Request,
    res: Response
): Promise<any> => {

    try {

        const { id }: any = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: "El ID debe ser un entero positivo"
            });
        }

        const [rows]: any = await pool.execute(
            "SELECT * FROM products WHERE id = ? AND active = ?",
            [Number(id), true]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }

        return res.status(200).json(rows[0]);

    } catch (error) {

        console.error("Error al obtener producto:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export const createProduct = async (
    req: Request,
    res: Response
): Promise<any> => {

    try {

        const {
            name,
            price,
            stock,
            description,
            brand,
            img
        }: any = req.body;

        if (
            !name ||
            price === undefined ||
            stock === undefined ||
            !description
        ) {
            return res.status(400).json({
                message: "name, price, stock y description son obligatorios"
            });
        }

        if (!isValidPrice(price)) {
            return res.status(400).json({
                message: "El precio debe ser un número mayor que cero y tener máximo dos decimales"
            });
        }

        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                message: "El stock debe ser un entero mayor o igual a cero"
            });
        }

        const [result]: any = await pool.execute(
            `INSERT INTO products
            (name, price, stock, description, brand, img, active)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                price,
                stock,
                description,
                brand || null,
                img || null,
                true
            ]
        );

        return res.status(201).json({
            message: "Producto creado correctamente",
            id: result.insertId
        });

    } catch (error) {

        console.error("Error al crear producto:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export const updateProduct = async (
    req: Request,
    res: Response
): Promise<any> => {

    try {

        const { id }: any = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: "El ID debe ser un entero positivo"
            });
        }

        const {
            name,
            price,
            stock,
            description,
            brand,
            img
        }: any = req.body;

        if (
            !name ||
            price === undefined ||
            stock === undefined ||
            !description
        ) {
            return res.status(400).json({
                message: "name, price, stock y description son obligatorios"
            });
        }

        if (!isValidPrice(price)) {
            return res.status(400).json({
                message: "El precio debe ser un número mayor que cero y tener máximo dos decimales"
            });
        }

        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                message: "El stock debe ser un entero mayor o igual a cero"
            });
        }

        const [result]: any = await pool.execute(
            `UPDATE products
             SET name = ?,
                 price = ?,
                 stock = ?,
                 description = ?,
                 brand = ?,
                 img = ?
             WHERE id = ? AND active = ?`,
            [
                name,
                price,
                stock,
                description,
                brand || null,
                img || null,
                Number(id),
                true
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            message: "Producto actualizado correctamente"
        });

    } catch (error) {

        console.error("Error al actualizar producto:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response
): Promise<any> => {

    try {

        const { id }: any = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: "El ID debe ser un entero positivo"
            });
        }

        const [result]: any = await pool.execute(
            `UPDATE products
             SET active = ?
             WHERE id = ? AND active = ?`,
            [
                false,
                Number(id),
                true
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            message: "Producto dado de baja correctamente"
        });

    } catch (error) {

        console.error("Error al dar de baja el producto:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export const changePrice = async (
    req: Request,
    res: Response
): Promise<any> => {

    try {

        const { id }: any = req.params;
        const { price }: any = req.body;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: "El ID debe ser un entero positivo"
            });
        }

        if (!isValidPrice(price)) {
            return res.status(400).json({
                message: "El precio debe ser un número mayor que cero y tener máximo dos decimales"
            });
        }

        const [result]: any = await pool.execute(
            `UPDATE products
             SET price = ?
             WHERE id = ? AND active = ?`,
            [
                price,
                Number(id),
                true
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            message: "Precio actualizado correctamente"
        });

    } catch (error) {

        console.error("Error al cambiar el precio:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};