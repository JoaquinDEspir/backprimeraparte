// services/ticketService.js
const Ticket = require('../models/tickets');
const { v4: uuidv4 } = require('uuid');

class TicketService {
    async createTicket(data) {
        const ticket = new Ticket({
            code: uuidv4(),
            amount: data.amount,
            purchaser: data.purchaser
        });
        return await ticket.save();
    }
}

module.exports = new TicketService();
