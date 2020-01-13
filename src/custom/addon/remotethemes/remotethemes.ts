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

import { AddonRemoteThemesProvider } from '@addon/remotethemes/providers/remotethemes';
import { CoreAppProvider } from '@providers/app';
import { CoreFilepoolProvider } from '@providers/filepool';
import { CoreFileProvider } from '@providers/file';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CustomCoreSite } from 'custom/classes/site';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomAddonRemoteThemesProvider extends AddonRemoteThemesProvider {

    constructor(
        logger: CoreLoggerProvider,
        private mySitesProvider: CoreSitesProvider,
        fileProvider: CoreFileProvider,
        filepoolProvider: CoreFilepoolProvider,
        http: Http,
        utils: CoreUtilsProvider,
        appProvider: CoreAppProvider,
    ) {
        super(logger, mySitesProvider, fileProvider, filepoolProvider, http, utils, appProvider);
    }

    async get(siteId?: string): Promise<{fileUrl: string, styles: string}> {
        siteId = siteId || this.mySitesProvider.getCurrentSiteId();

        const site = (await this.mySitesProvider.getSite(siteId)) as CustomCoreSite;

        if (!site.isPremium) {
            throw new Error(`Remote sites are disabled for ${site.siteUrl} because it doesn't have a Premium subscription`);
        }

        return await super.get(siteId);
    }

}
