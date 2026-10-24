import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { GetMyEventsByStatusParam } from '../../application/params/get_my_events_by_status_param';
import type { Event } from '../../domain/entities/event';
import type { GetMyEventsByStatusRepository } from '../../domain/repository/get_my_events_by_status_repository';
import { GetMyEventsByStatusDatasource } from '../datasources/get_my_events_by_status_datasource';
export class GetMyEventsByStatusRepositoryImpl implements GetMyEventsByStatusRepository {
  private datasource: GetMyEventsByStatusDatasource;
  constructor(datasource: GetMyEventsByStatusDatasource = new GetMyEventsByStatusDatasource()) { this.datasource = datasource; }
  async getMyEventsByStatus(param: GetMyEventsByStatusParam): Promise<{ events: Event[]; currentPage: number; lastPage: number; total: number } | Failure> {
    try {
      const page = await this.datasource.getMyEventsByStatus(param);
      return { ...page, events: page.events.map(event => event.toEntity()) };
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
