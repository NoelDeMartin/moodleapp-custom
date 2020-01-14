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

import { CoreCourseHelperProvider } from '@core/course/providers/helper';
import { CoreCourseOptionsMenuHandlerToDisplay, CoreCourseOptionsHandlerToDisplay } from '@core/course/providers/options-delegate';
import { CustomCoreSite } from '../../../classes/site';
import { Injectable } from '@angular/core';
import { SubscriptionTier } from '../../../services/SiteSubscriptionsManager';
import CustomCoreCourseProvider from '../../../facades/CustomCoreCourseProvider';
import CustomCoreSitesProvider from '../../../facades/CustomCoreSitesProvider';

@Injectable()
export class CustomCoreCourseHelperProvider extends CoreCourseHelperProvider {

    // Override
    async confirmAndPrefetchCourse(data: any, course: any, sections?: any[], courseHandlers?: CoreCourseOptionsHandlerToDisplay[],
            menuHandlers?: CoreCourseOptionsMenuHandlerToDisplay[]): Promise<boolean> {

        const site = CustomCoreSitesProvider.instance.getCurrentSite();
        const downloadLimit = this.getCoursesDownloadLimit(site);

        if (downloadLimit !== null) {
            const downloadedCourses = await CustomCoreCourseProvider.instance.getDownloadedCourses();

            if (downloadedCourses.length >= downloadLimit) {
                throw new Error('Courses download limit has been reached!');
            }
        }

        return super.confirmAndPrefetchCourse(data, course, sections, courseHandlers, menuHandlers);
    }

    private getCoursesDownloadLimit(site: CustomCoreSite): number | null {
        switch (site.subscriptionTier) {
            case SubscriptionTier.Free:
                return 2;
            case SubscriptionTier.Pro:
                return 5;
            default:
                return null;
        }
    }

}
