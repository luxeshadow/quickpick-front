import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { GetMyEventsParam } from '../../application/params/get_my_events_param';
import type { Event } from '../../domain/entities/event';
import type { GetMyEventsRepository } from '../../domain/repository/get_my_events_repository';
import { GetMyEventsDatasource } from '../datasources/get_my_events_datasource';
export class GetMyEventsRepositoryImpl implements GetMyEventsRepository {
  private datasource: GetMyEventsDatasource;
  constructor(datasource: GetMyEventsDatasource = new GetMyEventsDatasource()) { this.datasource = datasource; }
  async getMyEvents(param: GetMyEventsParam): Promise<{ events: Event[]; currentPage: number; lastPage: number; total: number } | Failure> {
    try {
      const page = await this.datasource.getMyEvents(param);
      return { ...page, events: page.events.map(event => event.toEntity()) };
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
