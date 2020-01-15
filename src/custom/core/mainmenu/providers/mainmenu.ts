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

import { CoreMainMenuProvider, CoreMainMenuCustomItem } from '@core/mainmenu/providers/mainmenu';
import { CustomCoreSite } from '../../../classes/site';
import { Injectable } from '@angular/core';
import { SubscriptionTier } from '../../../services/SiteSubscriptionsManager';
import CustomCoreSitesProvider from '../../../facades/CustomCoreSitesProvider';

@Injectable()
export class CustomCoreMainMenuProvider extends CoreMainMenuProvider {

    async getCustomMenuItems(siteId?: string): Promise<CoreMainMenuCustomItem[]> {
        const items = await super.getCustomMenuItems(siteId);
        const site = await CustomCoreSitesProvider.instance.getSite(siteId);
        const maxItems = this.getMaximumCustomMenuItems(site);

        if (maxItems !== null && items.length > maxItems) {
            const removedItems = items.splice(maxItems, items.length - maxItems);

            // tslint:disable-next-line
            console.warn(`${removedItems.length} custom menu items have been ignored because a superior subscription tier is required`);
        }

        return items;
    }

    private getMaximumCustomMenuItems(site: CustomCoreSite): number | null {
        switch (site.subscriptionTier) {
            case SubscriptionTier.Free:
                return 1;
            case SubscriptionTier.Pro:
                return 2;
            default:
                return null;
        }
    }

}
