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
import { Injectable } from '@angular/core';
import CustomCoreSitesProvider from '../../facades/CustomCoreSitesProvider';

@Injectable()
export class CustomAddonRemoteThemesProvider extends AddonRemoteThemesProvider {

    async get(siteId?: string): Promise<{fileUrl: string, styles: string}> {
        siteId = siteId || CustomCoreSitesProvider.instance.getCurrentSiteId();

        const site = await CustomCoreSitesProvider.instance.getSite(siteId);

        if (!site.isPremium) {
            throw new Error(`Remote themes are disabled for ${site.siteUrl} because it doesn't have a Premium subscription`);
        }

        return await super.get(siteId);
    }

}
