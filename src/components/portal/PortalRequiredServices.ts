import { DomainService, PortletDataSourceService } from '../../services/';

export interface PortalRequiredServices {
  portletColRelService: DomainService;
  portletDataSourceService: PortletDataSourceService;
  portalRowRelService: DomainService;
  portletTabRelService: DomainService;
  portletCalendarService: DomainService;
  portletLinkService: DomainService;
  portletListViewService: DomainService;
  portletTableService: DomainService;
}
