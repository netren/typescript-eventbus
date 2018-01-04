import { EventHandler } from './EventHandler';
import { IEvent, IResultEvent } from './IEvent';

class EventDef {
    eventTypeConstructor : Function;
    functionName : string;
    callfunc : Function;
}

class EventHandlerData {
    handler : EventHandler;
    callfunc : Function;
    isRemove : boolean = false;
}


export class EventBus {
    
    // dispaherMap  : Map<String, Array<EventHandler> >
    dispaherMap  = {}
    isDispatching : boolean;
    dispatchingList : Array<EventHandlerData>;
    dispatchingRemoved = false;
    public static eventHandlerClassMap  = {}
    
    constructor() {
    }

    register(handler : EventHandler) {

        var constructor : any = handler.constructor;
        let e : Array<EventDef> = EventBus.eventHandlerClassMap[constructor]
        if (e) {
            for (let i = 0; i < e.length; ++i) {
                let eventDef = e[i]
                let eventHandlerList = this.dispaherMap[eventDef.eventTypeConstructor as any];
                if (!eventHandlerList) {
                    eventHandlerList = [];
                    this.dispaherMap[eventDef.eventTypeConstructor as any] = eventHandlerList;
                }
                eventHandlerList.push({handler : handler, callfunc : eventDef.callfunc,isRemove : false });
            }
        }
        
    }

    unregister(handler : EventHandler) {
        var constructor : any = handler.constructor;
        var e = EventBus.eventHandlerClassMap[constructor]
        if (e) {
            for (let eventDef of e) {
                let eventHandlerList = this.dispaherMap[eventDef.eventTypeConstructor];
                if (!eventHandlerList) {
                    continue
                }
                let isThisDispatching = this.dispatchingList === eventHandlerList
                for (var i = 0; i < eventHandlerList.length; ++i) {
                    if (eventHandlerList[i].handler === handler) {
                        if (isThisDispatching) {
                            eventHandlerList[i].isRemove = true;
                            this.dispatchingRemoved = true;
                            break;
                        }
                        else {
                            eventHandlerList.splice(i, 1); 
                            break
                        }
                    }
                    
                }
            
            }
        }
    }

    get<T>(resultEvent : IResultEvent<T>) : T {
        this.post(resultEvent);
        return resultEvent.result
    }

    post(object : IEvent) {
        
        
        let constructor : any = object.constructor;
        let eventHandlerList = this.dispaherMap[constructor];
        if (eventHandlerList) {
            this.dispatchingList = eventHandlerList
            let args = [object];
            this.isDispatching = true;
            this.dispatchingRemoved  = false;
            for (var i = 0; i < eventHandlerList.length; ++i) {
                
                let handlerData = eventHandlerList[i];
                handlerData.callfunc.apply(handlerData.handler, args);
            }

            if (this.dispatchingRemoved) {
                for (var i = 0; i < eventHandlerList.length; ) {
                    if (eventHandlerList[i].isRemove) {
                        eventHandlerList.splice(i, 1)
                    }
                    else {
                        ++i;
                    }
                }
                this.dispatchingRemoved = false;
            }
            this.dispatchingList = null;
            this.isDispatching = false;

        }
        // object.constructor.name
    }
}