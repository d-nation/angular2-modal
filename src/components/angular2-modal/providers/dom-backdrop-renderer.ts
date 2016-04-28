import {
    ComponentRef,
    ViewContainerRef,
    DynamicComponentLoader,
    Renderer,
    ResolvedReflectiveProvider,
    Injectable,
    Type,
    Provider
} from 'angular2/core';

import {BackdropRenderer} from '../models/tokens';
import {MODAL_PROVIDERS} from './modal';

@Injectable()
export class DOMBackdropRenderer implements BackdropRenderer {
    constructor(private _dlc: DynamicComponentLoader,
                private _renderer: Renderer){}

    public createBackdrop(type: Type, viewContainer: ViewContainerRef,
                          bindings: ResolvedReflectiveProvider[], 
                          inside: boolean): Promise<ComponentRef> {

        return this._dlc.loadNextToLocation(type, viewContainer, bindings)
            .then((cmpRef: any) => {
               
                if (inside) {
                    this._renderer.invokeElementMethod(
                        viewContainer.element.nativeElement,
                        'appendChild',
                        [cmpRef.hostView.rootNodes[0]]
                    );
                }
                else {
                    document.body.appendChild(cmpRef.hostView.rootNodes[0]);
                }
                return cmpRef;
            });
        
    }
}

MODAL_PROVIDERS.push(new Provider(BackdropRenderer, {useClass: DOMBackdropRenderer}));