import ReservasModel from "../models/ReservasModel.js";
import ValidacoesService from "../services/ValidacoesService.js";
import DatabaseReservasMetodos from "../DAO/DatabaseReservasMetodos.js";

DatabaseReservasMetodos.createTableReservas()

class Reservas {
    static rotas(app) {
        app.get("/reservas", async (req, res) => {
            const resposta = await DatabaseReservasMetodos.listarReservas()
            res.status(200).json(resposta)
        })

        app.get("/reservas/:id", async (req, res) => {
            try {
                const reserva = await DatabaseReservasMetodos.listarReservasPorID(req.params.id)

                if (reserva) {
                    res.status(200).json(reserva)
                } else {
                    throw new Error("Reserva não encontrada para esse ID. Revise o ID e tente novamente.")
                }
            } catch (error) {
                res.status(404).json(error.message)
            }
        })

        app.post("/reservas", async (req, res) => {
            const reservaValidada = ValidacoesService.reservaValidada(...Object.values(req.body))
            try {
                if (reservaValidada) {
                    const reserva = new ReservasModel(...Object.values(req.body))
                    const response = await DatabaseReservasMetodos.inserirReserva(reserva)

                    res.status(201).json(response)
                } else {
                    throw new Error("Informações inválidas, confira os dados e tente novamente.")
                }
            } catch (error) {
                res.status(404).json(error.message)
            }
        })

        app.put("/reservas/:id", async (req, res) => {
            try {
                const reservaValidada = ValidacoesService.reservaValidada(...Object.values(req.body))
                if (reservaValidada) {
                    const reserva = new ReservasModel(...Object.values(req.body))
                    const response = await DatabaseReservasMetodos.atualizarReserva(req.params.id, reserva)
                    res.status(200).json(response)
                } else {
                    throw new Error("Informações inválidas, confira os dados e tente novamente.")
                }
            } catch (error) {
                res.status(404).json({ Error: error.message })
            }
        })

        app.delete("/reservas/:id", async (req, res) => {
            try {
                const reserva = await DatabaseReservasMetodos.excluirReserva(req.params.id)
                res.status(200).json(reserva)
            } catch (error) {
                res.status(404).json({ Error: error.message })
            }
        })
    }
}

export default Reservas;