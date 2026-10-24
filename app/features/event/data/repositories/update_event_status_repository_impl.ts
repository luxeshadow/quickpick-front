import type { Event } from '../../domain/entities/event';
import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { UpdateEventStatusParam } from '../../application/params/update_event_status_param';
import type { UpdateEventStatusRepository } from '../../domain/repository/update_event_status_repository';
import { UpdateEventStatusDatasource } from '../datasources/update_event_status_datasource';

export class UpdateEventStatusRepositoryImpl implements UpdateEventStatusRepository {
  private datasource: UpdateEventStatusDatasource;

  constructor(datasource: UpdateEventStatusDatasource = new UpdateEventStatusDatasource()) {
    this.datasource = datasource;
  }

  async updateEventStatus(param: UpdateEventStatusParam): Promise<Event | Failure> {
    try {
      const model = await this.datasource.updateEventStatus(param);
      return model.toEntity();
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
