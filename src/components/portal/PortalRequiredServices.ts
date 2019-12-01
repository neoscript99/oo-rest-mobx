import { DomainService, PortletDataSourceService } from '../../services/';
import { MobxDomainStore } from '../../stores';

export interface PortalRequiredServices {
  portletColRelService: DomainService<MobxDomainStore>;
  portletDataSourceService: PortletDataSourceService;
  portalRowRelService: DomainService<MobxDomainStore>;
  portletTabRelService: DomainService<MobxDomainStore>;
  portletCalendarService: DomainService<MobxDomainStore>;
  portletLinkService: DomainService<MobxDomainStore>;
  portletListViewService: DomainService<MobxDomainStore>;
  portletTableService: DomainService<MobxDomainStore>;
}
