import type { Failure } from '../../../../core/error/failure';
import type { AccessLink } from '../entities/access_link';
import type { UpdateAccessLinkParam } from '../../application/params/update_access_link_param';
export interface UpdateAccessLinkRepository { updateAccessLink(param: UpdateAccessLinkParam): Promise<AccessLink | Failure>; }
