import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    // verificar se não tem dois agendamentos no mesmo horário
    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    // caso exista já um agendamento com a mesma data retorna menssagem de erro
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    // criando um agendamento
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default new CreateAppointmentService();
