import type { Failure } from '../../../../core/error/failure';
import type { AccessLink } from '../entities/access_link';
import type { GenerateAccessLinkParam } from '../../application/params/generate_access_link_param';
export interface GenerateAccessLinkRepository { generateAccessLink(param: GenerateAccessLinkParam): Promise<AccessLink | Failure>; }
