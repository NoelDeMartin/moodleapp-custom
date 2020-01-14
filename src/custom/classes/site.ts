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

    subscriptionTier: SubscriptionTier;

    get isPro(): boolean {
        return this.subscriptionTier === SubscriptionTier.Pro || this.isPremium;
    }

    get isPremium(): boolean {
        return this.subscriptionTier === SubscriptionTier.Premium || this.isBranded;
    }

    get isBranded(): boolean {
        return this.subscriptionTier === SubscriptionTier.Branded;
    }

    // Override
    async fetchSiteInfo(): Promise<any> {
        this.subscriptionTier = await SiteSubscriptionsManager.getSubscriptionTier(this.siteUrl);

        return await super.fetchSiteInfo();
    }

}
