import type { Failure } from '../../../../core/error/failure';
import type { PublicAccessLink } from '../entities/access_link';
import type { ResolvePublicAccessLinkParam } from '../../application/params/resolve_public_access_link_param';
export interface ResolvePublicAccessLinkRepository { resolvePublicAccessLink(param: ResolvePublicAccessLinkParam): Promise<PublicAccessLink | Failure>; }
