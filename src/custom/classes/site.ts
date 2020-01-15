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

const DISABLED_FEATURES_LIMITS = {
    [SubscriptionTier.Free]: 1,
    [SubscriptionTier.Pro]: 2,
};

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

    // Override
    getStoredConfig(name?: string): any {
        const value = super.getStoredConfig(name);

        if (name === 'tool_mobile_disabledfeatures') {
            const maxDisabledFeatures = SiteSubscriptionsManager.getTierLimit(this.subscriptionTier, DISABLED_FEATURES_LIMITS);

            if (maxDisabledFeatures !== null && value) {
                const disabledFeatures = value.split(',');

                if (disabledFeatures.length > maxDisabledFeatures) {
                    const removedDisabledFeatures = disabledFeatures.splice(
                        maxDisabledFeatures,
                        disabledFeatures.length - maxDisabledFeatures,
                    );

                    // tslint:disable-next-line
                    console.warn(`${removedDisabledFeatures.length} disabled features have been ignored because a superior subscription tier is required`);

                    return disabledFeatures.join(',');
                }
            }
        }

        return value;
    }

}
