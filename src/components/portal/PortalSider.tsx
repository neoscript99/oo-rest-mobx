import React from 'react';
import { Anchor, Layout } from 'antd';
import { Entity } from '../../services';
import { PortalRequiredServices } from './PortalRequiredServices';

const { Sider } = Layout;

interface P {
  portal: Entity;
  services: PortalRequiredServices;
  portalRowRelAllList: Entity[];
  portletColRelAllList: Entity[];
}

export class PortalSider extends React.Component<P> {
  render() {
    const { portalRowRelAllList, portletColRelAllList } = this.props;

    const rowRelList = portalRowRelAllList.filter((value) => value.portal.id === this.props.portal.id);

    const portletList: Entity[] = [];
    rowRelList.every((rowRel) =>
      rowRel.row.cols
        .slice()
        .sort((a: Entity, b: Entity) => a.colOrder - b.colOrder)
        .every((col: Entity) =>
          portletColRelAllList
            .filter((colRel) => colRel.col.id === col.id)
            .reduce<Entity[]>((list, colRel) => (list.push(colRel.portlet), list), portletList),
        ),
    );
    return (
      <Sider
        style={{ backgroundColor: '#ffffff', borderTop: 'solid thin #f3f3f3', borderBottom: 'solid thin #f3f3f3' }}
      >
        <Anchor style={{ backgroundColor: 'inherit', margin: '0.5rem' }}>
          {portletList.map((portlet, index) => (
            <Anchor.Link key={portlet.id} href={'#' + portlet.id} title={`${index + 1}、${portlet.portletName}`} />
          ))}
        </Anchor>
      </Sider>
    );
  }
}
