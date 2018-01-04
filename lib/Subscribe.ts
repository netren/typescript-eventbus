import "reflect-metadata";
import { EventBus } from "./EventBus";

export function Subscribe(target: Object, // The prototype of the class
    propertyKey: string, descriptor : any) {
        let types = Reflect.getMetadata("design:paramtypes", target, propertyKey);
        if (types.length == 1) {
            let eventTypeConstructor = types[0]
            //console.log("event type:" + eventTypeConstructor);
            let e = EventBus.eventHandlerClassMap[target.constructor as any]
            if (!e) {
                e = [];
                EventBus.eventHandlerClassMap[target.constructor as any] = e;
            }
            e.push({eventTypeConstructor : eventTypeConstructor, functionName : propertyKey, callfunc : descriptor.value});
        }
        else {
            console.log("params is not suit, it must one arg");
        }
}