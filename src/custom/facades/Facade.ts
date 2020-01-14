// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Injector, Type } from '@angular/core';

export function initializeFacadesInjector(injector: Injector): void {
    Facade.injector = injector;
}

export default class Facade<Provider> {

    static injector: Injector;

    constructor(providerClass: Type<Provider>) {
        this.providerClass = providerClass;
    }

    private providerClass: Type<Provider>;
    private _instance: Provider;

    get instance(): Provider {
        if (!this._instance) {
            this._instance = Facade.injector.get(this.providerClass);
        }

        return this._instance;
    }

}
