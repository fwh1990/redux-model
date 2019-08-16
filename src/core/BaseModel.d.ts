import { NormalAction } from './action/NormalAction';
import {
  ActionNormal,
  Effects,
  Reducers,
  RequestActionParamNoMeta,
  RequestActionParamWithMeta,
  RequestActionParamWithMetas,
  RequestActionWithMeta,
  RequestActionWithMetas,
  RequestOptions,
} from './utils/types';
import { FetchHandle } from '../libs/types';
import { RequestAction } from '../libs/RequestAction';

type EnhanceResponse<A> = A extends (...args: any[]) => FetchHandle<infer R, any> ? R : never;
type EnhancePayload<A> = A extends (...args: any[]) => FetchHandle<any, infer P> ? P : never;
type ExtractNormalPayload<A> = A extends (state: any, payload: infer P) => any ? P : never;
type ExtractNormalAction<A> = A extends (state: any, payload: (unknown | undefined)) => any
  ? () => ActionNormal<ExtractNormalPayload<A>>
  : (payload: ExtractNormalPayload<A>) => ActionNormal<ExtractNormalPayload<A>>;

export declare abstract class BaseModel<Data = null> {
    static middlewareName: string;

    // As we know, it's forbidden to make condition when we are using hooks.
    // We can't write code like: xxxModel.xxx.useLoading() || xxxModel.yyy.useLoading()
    // So, just write code like: Model.isLoading(xxxModel.xxx.useLoading(), xxxModel.yyy.useLoading());
    static isLoading(...fromUseLoading: boolean[]): boolean;

    constructor(alias?: string);

    register(): Reducers;

    // Remember: You can only use it in function component. Make sure React version >=16.8 and react-redux version >=7.1.0
    useData<T = Data>(filter?: (data: Data) => T): T;
    // Remember: You can only use it in react-redux.connect() method.
    connectData(): Data;

    protected actionNormal<A extends (state: Data, payload: any) => void | Data>(fn: A): NormalAction<Data, ExtractNormalAction<A>, ExtractNormalPayload<A>>;

    // Case meta is false. We will never create meta reducer for this action.
    protected actionRequest<A extends (...args: any[]) => FetchHandle<Response, Payload>, Response = EnhanceResponse<A>, Payload = EnhancePayload<A>>(config: RequestActionParamNoMeta<Data, A, Response, Payload>): RequestAction<Data, A, Response, Payload>;

    // Case meta is undefined or true. we will automatically register meta reducer.
    protected actionRequest<A extends (...args: any[]) => FetchHandle<Response, Payload>, Response = EnhanceResponse<A>, Payload = EnhancePayload<A>>(config: RequestActionParamWithMeta<Data, A, Response, Payload>): RequestActionWithMeta<Data, A, Response, Payload>;

    // Case meta is one of payload's key. we will automatically register metas reducer.
    protected actionRequest<A extends (...args: any[]) => FetchHandle<Response, Payload>, Response = EnhanceResponse<A>, Payload = EnhancePayload<A>>(config: RequestActionParamWithMetas<Data, A, Response, Payload>): RequestActionWithMetas<Data, A, Response, Payload>;

    protected get<Response = any, Payload = undefined>(options: RequestOptions<Payload>): FetchHandle<Response, Payload>;
    protected post<Response = any, Payload = undefined>(options: RequestOptions<Payload>): FetchHandle<Response, Payload>;
    protected put<Response = any, Payload = undefined>(options: RequestOptions<Payload>): FetchHandle<Response, Payload>;
    protected delete<Response = any, Payload = undefined>(options: RequestOptions<Payload>): FetchHandle<Response, Payload>;

    protected effects(): Effects<Data>;
    protected getMiddlewareName(): string;
    // Open immer feature and you can modify state directly. Default is true
    protected mvvmForReducer(): boolean;
    protected abstract initReducer(): Data;
}
