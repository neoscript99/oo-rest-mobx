import React, { Component } from 'react';
import { Icon as LegacyIcon } from 'antd';
import { Menu } from 'antd';
import { MenuEntity, MenuNode } from '../../stores/MenuStore';

const SubMenu = Menu.SubMenu;

export interface MenuClickHandler {
  (menu: MenuEntity): void;
}

interface P {
  rootMenu: MenuNode;
  menuClick: MenuClickHandler;
}

export class MenuTree extends Component<P> {
  render() {
    const { rootMenu } = this.props;
    return (
      <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
        {rootMenu.subMenus.map(menuNode => getTree(menuNode, this.props.menuClick))}
      </Menu>
    );
  }
}

function getTree(menuNode: MenuNode, clickHandle: MenuClickHandler) {
  return menuNode.menu.app ? (
    <Menu.Item key={menuNode.menu.id} onClick={clickHandle.bind(null, menuNode.menu)}>
      <LegacyIcon type={menuNode.menu.icon || 'file'} />
      <span>{menuNode.menu.label}</span>
    </Menu.Item>
  ) : (
    <SubMenu
      key={menuNode.menu.id}
      title={
        <span>
          <LegacyIcon type={menuNode.menu.icon || 'folder'} />
          <span>{menuNode.menu.label}</span>
        </span>
      }
    >
      {menuNode.subMenus.map(subNode => getTree(subNode, clickHandle))}
    </SubMenu>
  );
}
