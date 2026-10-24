import type { Failure } from '../../../../core/error/failure';
import type { DeleteAccessLinkParam } from '../../application/params/delete_access_link_param';
export interface DeleteAccessLinkRepository { deleteAccessLink(param: DeleteAccessLinkParam): Promise<string | Failure>; }
