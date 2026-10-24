import type { Failure } from '../../../../core/error/failure';
import type { AccessLink } from '../entities/access_link';
import type { ShowAccessLinkParam } from '../../application/params/show_access_link_param';
export interface ShowAccessLinkRepository { showAccessLink(param: ShowAccessLinkParam): Promise<AccessLink | Failure>; }
