import { combineLatest, Subject, throwError } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ResourceService, ToasterService, ConfigService, ContentUtilsServiceService, ITelemetryShare } from '@sunbird/shared';
import { CourseConsumptionService } from '@sunbird/learn';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { NavigationHelperService } from '@sunbird/shared';

@Component({
  templateUrl: './public-course-consumption-page.component.html',
  styleUrls: ['./public-course-consumption-page.component.css']
})
export class PublicCourseConsumptionPageComponent implements OnInit, OnDestroy {
  public courseId: string;
  public showLoader = true;
  public showError = false;
  public courseHierarchy: any;
  sharelinkModal: boolean;
  shareLink: string;
  public telemetryCourseImpression: IImpressionEventInput;

  /**
   * telemetryShareData
  */
  telemetryShareData: Array<ITelemetryShare>;

  public unsubscribe = new Subject<void>();
  constructor(public navigationHelperService: NavigationHelperService, private activatedRoute: ActivatedRoute,
    private courseConsumptionService: CourseConsumptionService, public toasterService: ToasterService,
    private resourceService: ResourceService, public router: Router, public contentUtilsServiceService: ContentUtilsServiceService,
    private configService: ConfigService, private telemetryService: TelemetryService) {
  }

  ngOnInit() {
    this.showLoader = true;
    const routeParams: any = {...this.activatedRoute.snapshot.firstChild.params };
    this.courseId = routeParams.courseId;
    if (!this.courseId) {
      return this.redirectToExplore();
    }
    const inputParams = {params: this.configService.appConfig.CourseConsumption.contentApiQueryParams};
    this.courseConsumptionService.getCourseHierarchy(this.courseId, inputParams).pipe(takeUntil(this.unsubscribe))
    .subscribe((courseHierarchy: any) => {
      this.courseHierarchy = courseHierarchy;
      this.showLoader = false;
    }, (error) => {
      if (_.isEqual(_.get(error, 'error.responseCode'), 'RESOURCE_NOT_FOUND')) {
        this.toasterService.error(this.resourceService.messages.emsg.m0002);
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
      this.redirectToExplore();
    });
  }
  onShareLink() {
    this.sharelinkModal = true;
    this.shareLink = this.contentUtilsServiceService.getCoursePublicShareUrl(this.courseHierarchy.identifier);
    this.setTelemetryShareData(this.courseHierarchy);
  }
  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }

  redirectToExplore() {
    this.navigationHelperService.navigateToResource('explore-course');
  }

  closeSharePopup(id) {
    this.sharelinkModal = false;
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'explore',
        cdata: []
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'explore-course-toc',
      },
      object: {
        id: _.get(this.courseHierarchy, 'identifier'),
        type: _.get(this.courseHierarchy, 'contentType') || 'Course',
        ver: `${_.get(this.courseHierarchy, 'pkgVersion')}` || `1.0`,
        rollup: { l1: this.courseId }
      }
    };
    this.telemetryService.interact(interactData);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
