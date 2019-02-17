import {
  Directive, ViewContainerRef, Injector, NgModuleFactoryLoader, Inject, OnDestroy, OnInit, Input,
  NgModuleRef, NgModuleFactory, Type
} from '@angular/core';
import { LAZY_MODULES, LAZY_MODULES_MAP } from './layzy-load-provider';

type ModuleWithRoot = Type<any> & { rootComponent: Type<any> };

@Directive({
  selector: '[lsLoadModule]'
})
export class LoadModuleDirective implements OnInit, OnDestroy {
  @Input() lsLoadModule: keyof LAZY_MODULES;
  private moduleRef: NgModuleRef<any>;

  constructor(
    private vcr: ViewContainerRef,
    private injector: Injector,
    private loader: NgModuleFactoryLoader,
    @Inject(LAZY_MODULES_MAP) private modulesMap
  ) { }

  ngOnInit() {
    console.log(this.lsLoadModule);
    this.loader
      .load(this.modulesMap[this.lsLoadModule])
      .then((moduleFactory: NgModuleFactory<any>) => {
        this.moduleRef = moduleFactory.create(this.injector);
        const rootComponent = (moduleFactory.moduleType as ModuleWithRoot)
          .rootComponent;

        const factory = this.moduleRef.componentFactoryResolver.resolveComponentFactory(
          rootComponent
        );

        this.vcr.createComponent(factory);
      });
  }

  ngOnDestroy() {
    if (this.moduleRef) {
      this.moduleRef.destroy();
    }
  }

}
