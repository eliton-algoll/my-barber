import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();
  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  // garantindo que a data seja somente de hora em hora, sem considerar os minutos quebrados
  const parsedDate = parseISO(date);

  const appointment = await CreateAppointmentService.execute({
    provider_id,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
