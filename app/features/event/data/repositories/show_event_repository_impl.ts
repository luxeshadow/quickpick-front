import type { Event } from '../../domain/entities/event';
import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { ShowEventParam } from '../../application/params/show_event_param';
import type { ShowEventRepository } from '../../domain/repository/show_event_repository';
import { ShowEventDatasource } from '../datasources/show_event_datasource';
export class ShowEventRepositoryImpl implements ShowEventRepository {
  private datasource: ShowEventDatasource;
  constructor(datasource: ShowEventDatasource = new ShowEventDatasource()) { this.datasource = datasource; }
  async showEvent(param: ShowEventParam): Promise<Event | Failure> {
    try {
      const result = await this.datasource.showEvent(param);
      return result.toEntity();
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
