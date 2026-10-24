import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { SearchMyEventsParam } from '../../application/params/search_my_events_param';
import type { Event } from '../../domain/entities/event';
import type { SearchMyEventsRepository } from '../../domain/repository/search_my_events_repository';
import { SearchMyEventsDatasource } from '../datasources/search_my_events_datasource';
export class SearchMyEventsRepositoryImpl implements SearchMyEventsRepository {
  private datasource: SearchMyEventsDatasource;
  constructor(datasource: SearchMyEventsDatasource = new SearchMyEventsDatasource()) { this.datasource = datasource; }
  async searchMyEvents(param: SearchMyEventsParam): Promise<{ events: Event[]; currentPage: number; lastPage: number; total: number } | Failure> {
    try {
      const page = await this.datasource.searchMyEvents(param);
      return { ...page, events: page.events.map(event => event.toEntity()) };
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
