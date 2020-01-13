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

import { CoreSite } from '@classes/site';
import SiteSubscriptionsManager, { SubscriptionTier } from '../services/SiteSubscriptionsManager';

export class CustomCoreSite extends CoreSite {

    get isPro(): boolean {
        return this.infos && (this.infos.subscriptionTier === SubscriptionTier.Pro ||
            this.isPremium);
    }

    get isPremium(): boolean {
        return this.infos && (this.infos.subscriptionTier === SubscriptionTier.Premium ||
            this.isBranded);
    }

    get isBranded(): boolean {
        return this.infos && this.infos.subscriptionTier === SubscriptionTier.Branded;
    }

    // Override
    async fetchSiteInfo(): Promise<any> {
        const info = await super.fetchSiteInfo();

        info.subscriptionTier = await SiteSubscriptionsManager.getSubscriptionTier(this.siteUrl);

        return info;
    }

}
