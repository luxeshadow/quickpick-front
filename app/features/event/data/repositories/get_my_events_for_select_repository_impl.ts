import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { GetMyEventsForSelectParam } from '../../application/params/get_my_events_for_select_param';
import type { GetMyEventsForSelectRepository } from '../../domain/repository/get_my_events_for_select_repository';
import { GetMyEventsForSelectDatasource } from '../datasources/get_my_events_for_select_datasource';
export class GetMyEventsForSelectRepositoryImpl implements GetMyEventsForSelectRepository {
  private datasource: GetMyEventsForSelectDatasource;
  constructor(datasource: GetMyEventsForSelectDatasource = new GetMyEventsForSelectDatasource()) { this.datasource = datasource; }
  async getMyEventsForSelect(param: GetMyEventsForSelectParam): Promise<{ id: number; name: string; status: 'active' | 'inactive' }[] | Failure> {
    try {
      const result = await this.datasource.getMyEventsForSelect(param);
      return result;
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
