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
import { Injectable } from '@angular/core';
import CustomCoreSitesProvider from '../../../facades/CustomCoreSitesProvider';
import SiteSubscriptionsManager, { SubscriptionTier } from '../../../services/SiteSubscriptionsManager';

const CUSTOM_MENU_ITEMS_LIMITS = {
    [SubscriptionTier.Free]: 1,
    [SubscriptionTier.Pro]: 2,
};

@Injectable()
export class CustomCoreMainMenuProvider extends CoreMainMenuProvider {

    async getCustomMenuItems(siteId?: string): Promise<CoreMainMenuCustomItem[]> {
        const items = await super.getCustomMenuItems(siteId);
        const site = await CustomCoreSitesProvider.instance.getSite(siteId);
        const maxItems = SiteSubscriptionsManager.getTierLimit(site.subscriptionTier, CUSTOM_MENU_ITEMS_LIMITS);

        if (maxItems !== null && items.length > maxItems) {
            const removedItems = items.splice(maxItems, items.length - maxItems);

            // tslint:disable-next-line
            console.warn(`${removedItems.length} custom menu items have been ignored because a superior subscription tier is required`);
        }

        return items;
    }

}
