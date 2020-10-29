import React, { ReactNode } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { DomainService } from '../../services';
import { MobxDomainStore } from '../../stores';
import { Portlet } from './Portlet';

export class PortletLink extends Portlet {
  render(): ReactNode {
    if (!this.state || !this.state.portlet) return null;
    const { linkUrl, portletName } = this.state.portlet;
    return (
      <Button
        type="primary"
        icon={<LinkOutlined />}
        size="large"
        style={{ height: '6rem' }}
        onClick={() => window.open(linkUrl, '_blank')}
      >
        {portletName}
      </Button>
    );
  }

  get portletService(): DomainService<MobxDomainStore> {
    return this.props.services.portletLinkService;
  }
}
