import { Router } from "express";
import{createTicket, createTicketInventory, getTickets,getTicket, getTicketInventory, updateTicketStatus, updateTicket} from "../controllers/tickets.controllers.js"

const router = Router()

router.get("/tickets",getTickets);
router.get("/ticket/:id",getTicket)
router.get("/ticketInventory/:id",getTicketInventory)
router.post("/tickets",createTicket);
router.post('/ticketsInventory',createTicketInventory)
router.put('/tickets/:id',updateTicketStatus)
router.put("/updateTicket/:id",updateTicket)


export default router;