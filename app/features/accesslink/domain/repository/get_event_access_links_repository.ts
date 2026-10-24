import type { Failure } from '../../../../core/error/failure';
import type { AccessLink } from '../entities/access_link';
import type { GetEventAccessLinksParam } from '../../application/params/get_event_access_links_param';
export interface GetEventAccessLinksRepository { getEventAccessLinks(param: GetEventAccessLinksParam): Promise<AccessLink[] | Failure>; }
