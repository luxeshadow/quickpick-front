import { Failure } from '../error/failure'

export interface UseCase<Type, Params> {
  execute(params: Params): Promise<Type | Failure>
}