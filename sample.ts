
import { Subscribe } from './lib/Subscribe';
import { IEvent, ResultEvent } from './lib/IEvent';
import { EventBus } from './lib/EventBus';

class A implements IEvent {

}

class B implements IEvent {

}

class C extends ResultEvent<number> {
    
}
class TObject  {
    

    @Subscribe onA (e : A) {
        console.log("onA")
    }

    @Subscribe onB(e : B) {
        console.log("onB")
    }

    @Subscribe onC(e : C) {
        e.result = 1;
    }
}

console.log("adsa")
let e = new EventBus();
let t = new TObject()
e.register(t);

e.post(new A());
e.post(new B());
console.log(e.get(new C()))
e.unregister(t);
console.log(e.get(new C()))
