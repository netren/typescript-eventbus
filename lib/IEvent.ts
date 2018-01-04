export interface IEvent {
    
}

export class IResultEvent<T> implements IEvent {
    result : T;
}

export class ResultEvent<T> implements IResultEvent<T> {
    result : T;
}