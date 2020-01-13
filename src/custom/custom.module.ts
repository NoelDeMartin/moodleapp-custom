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

import { NgModule, Provider } from '@angular/core';

import { AddonRemoteThemesProvider } from '@addon/remotethemes/providers/remotethemes';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreSitesFactoryProvider } from '@providers/sites-factory';
import { CoreSitesProvider } from '@providers/sites';

import { CustomAddonRemoteThemesProvider } from './addon/remotethemes/remotethemes';
import { CustomCoreCoursesProvider } from './core/courses/providers/courses';
import { CustomCoreSitesFactoryProvider } from './providers/sites-factory';
import { CustomCoreSitesProvider } from './providers/sites';

@NgModule({
    declarations: [],
    imports: [],
    providers: [
        { provide: CoreCoursesProvider, useClass: CustomCoreCoursesProvider },
        { provide: AddonRemoteThemesProvider, useClass: CustomAddonRemoteThemesProvider },
    ],
    exports: []
})
export class CustomModule {

    static rootProviders: Provider[] = [
        { provide: CoreSitesProvider, useClass: CustomCoreSitesProvider },
        { provide: CoreSitesFactoryProvider, useClass: CustomCoreSitesFactoryProvider },
    ];

}