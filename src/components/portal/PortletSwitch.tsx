import React from 'react';
import { CloseOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { PortletListView } from './PortletListView';
import { PortletLink } from './PortletLink';
import { PortletTable } from './PortletTable';
import { PortletCalendar } from './PortletCalendar';
import { PortletTab } from './PortletTab';
import { PortletProps } from './Portlet';

const defaultPortalMap: PortletMap = { PortletLink, PortletTable, PortletListView, PortletCalendar, PortletTab };

export interface PortletMap {
  [key: string]: React.ComponentType<PortletProps>;
}

export interface PortletSwitchProps extends PortletProps {
  inTab?: boolean;
  portletMap?: PortletMap;
}

export const PortletSwitch = (props: PortletSwitchProps) => {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <a id={props.portlet.id} />
      <PortletMapping {...props} />
    </div>
  );
};

const PortletMapping = ({ portlet, portletMap, inTab, services }: PortletSwitchProps) => {
  const map = { ...defaultPortalMap, ...portletMap };
  if (map[portlet.type]) {
    const Portlet = map[portlet.type];
    const portletStyle = portlet.style ? JSON.parse(portlet.style) : {};
    return <Portlet portlet={portlet} inTab={inTab} services={services} style={portletStyle} />;
  } else return <NotExists portlet={portlet} services={services} />;
};

const NotExists = ({ portlet }: PortletProps) => (
  <Card
    title={portlet.portletName}
    actions={[<SettingOutlined key="1" />, <EditOutlined key="2" />, <EllipsisOutlined key="3" />]}
  >
    <Card.Meta
      avatar={<CloseOutlined style={{ color: 'red', fontSize: '2rem' }} />}
      title="控件不存在，请联系管理员"
      description={portlet.type}
    />
  </Card>
);
