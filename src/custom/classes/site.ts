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
import Arr from '../services/Arr';
import Obj from '../services/Obj';
import SiteSubscriptionsManager, { SubscriptionTier } from '../services/SiteSubscriptionsManager';

const DISABLED_FEATURES_LIMITS = {
    [SubscriptionTier.Free]: 1,
    [SubscriptionTier.Pro]: 2,
};

const CUSTOM_LANGUAGE_STRINGS_LIMITS = {
    [SubscriptionTier.Free]: 10,
    [SubscriptionTier.Pro]: 20,
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

        switch (name) {
            case 'tool_mobile_disabledfeatures':
                return this.limitDisabledFeatures(value);
            case 'tool_mobile_customlangstrings':
                return this.limitCustomLanguageStrings(value);
            default:
                return value;
        }
    }

    private limitDisabledFeatures(value: string): string {
        const maxDisabledFeatures = SiteSubscriptionsManager.getTierLimit(this.subscriptionTier, DISABLED_FEATURES_LIMITS);

        if (maxDisabledFeatures === null && !value) {
            return value;
        }

        const disabledFeatures = value.split(',');

        if (disabledFeatures.length <= maxDisabledFeatures) {
            return value;
        }

        const removedDisabledFeatures = disabledFeatures.splice(
            maxDisabledFeatures,
            disabledFeatures.length - maxDisabledFeatures,
        );

        // tslint:disable-next-line
        console.warn(`${removedDisabledFeatures.length} disabled features have been ignored because a superior subscription tier is required`);

        return disabledFeatures.join(',');
    }

    private limitCustomLanguageStrings(value: string): string {
        const maxStrings = SiteSubscriptionsManager.getTierLimit(this.subscriptionTier, CUSTOM_LANGUAGE_STRINGS_LIMITS);

        if (maxStrings === null && !value) {
            return value;
        }

        // Map strings by language
        const languageStrings = value.split(/(?:\r\n|\r|\n)/);
        const languageStringsMap = {};

        for (const languageString of languageStrings) {
            const values = languageString.split('|');

            if (values.length < 3) {
                // Not enough data, ignore the entry.
                continue;
            }

            const language = values[2].replace(/_/g, '-'); // Use the app format instead of Moodle format.

            if (!(language in languageStringsMap)) {
                languageStringsMap[language] = [];
            }

            languageStringsMap[language].push(languageString);
        }

        // Remove strings past the limit
        for (const language in languageStringsMap) {
            if (languageStringsMap[language].length <= maxStrings) {
                continue;
            }

            const removedStrings = languageStringsMap[language].splice(
                maxStrings,
                languageStringsMap[language].length - maxStrings,
            );

            // tslint:disable-next-line
            console.warn(`${removedStrings.length} custom strings have been ignored from ${language} because a superior subscription tier is required`);
        }

        // Rebuild value
        return Arr.flatten(Obj.values(languageStringsMap)).join('\n');
    }

}
