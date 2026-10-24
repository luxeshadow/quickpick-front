import type { Event } from '../../domain/entities/event';
import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { CreateEventParam } from '../../application/params/create_event_param';
import type { CreateEventRepository } from '../../domain/repository/create_event_repository';
import { CreateEventDatasource } from '../datasources/create_event_datasource';

export class CreateEventRepositoryImpl implements CreateEventRepository {
  private datasource: CreateEventDatasource;

  constructor(datasource: CreateEventDatasource = new CreateEventDatasource()) {
    this.datasource = datasource;
  }

  async createEvent(param: CreateEventParam): Promise<Event | Failure> {
    try {
      const model = await this.datasource.createEvent(param);
      return model.toEntity();
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
