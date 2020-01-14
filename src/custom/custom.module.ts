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

import { NgModule, Provider, Injector } from '@angular/core';

import { AddonRemoteThemesProvider } from '@addon/remotethemes/providers/remotethemes';
import { CoreCourseHelperProvider } from '@core/course/providers/helper';
import { CoreSitesFactoryProvider } from '@providers/sites-factory';

import { CoreCourseProvider } from '@core/course/providers/course';
import { CustomAddonRemoteThemesProvider } from './addon/remotethemes/remotethemes';
import { CustomCoreCourseHelperProvider } from './core/courses/providers/helper';
import { CustomCoreCourseProvider } from './core/courses/providers/course';
import { CustomCoreSitesFactoryProvider } from './providers/sites-factory';
import { initializeFacadesInjector } from './facades/Facade';

@NgModule({
    declarations: [],
    imports: [],
    providers: [
        { provide: AddonRemoteThemesProvider, useClass: CustomAddonRemoteThemesProvider },
        { provide: CoreCourseHelperProvider, useClass: CustomCoreCourseHelperProvider },
        { provide: CoreCourseProvider, useClass: CustomCoreCourseProvider },
    ],
    exports: []
})
export class CustomModule {

    static rootProviders: Provider[] = [
        { provide: CoreSitesFactoryProvider, useClass: CustomCoreSitesFactoryProvider },
    ];

    constructor(injector: Injector) {
        initializeFacadesInjector(injector);
    }

}
