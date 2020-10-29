import React from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import { Badge, Calendar, Card, Popover, List, Divider } from 'antd';
import urlTemplate from 'url-template';
import moment, { Moment } from 'moment';
import 'moment/locale/zh-cn';
import { Portlet } from './Portlet';
import zh from 'antd/lib/calendar/locale/zh_CN';
import { DomainService } from '../../services';
import { MobxDomainStore } from '../../stores';

moment.locale('zh-cn');

export class PortletCalendar extends Portlet {
  render() {
    if (!(this.state && this.state.portlet)) return null;

    const { portletName, dateLink } = this.state.portlet;
    return (
      <Card
        title={portletName}
        extra={
          <a href={dateLink} target="_blank">
            更多
          </a>
        }
        style={this.props.style}
      >
        <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
          <Calendar
            locale={zh}
            fullscreen={false}
            dateCellRender={this.cellRender.bind(this, 'day')}
            monthCellRender={this.cellRender.bind(this, 'month')}
          />
        </div>
      </Card>
    );
  }

  cellRender(unit: 'day' | 'month', date: Moment) {
    const { portlet, dataList } = this.state;
    if (!dataList) return null;

    const matchData = dataList.filter((item) =>
      date.isBetween(
        moment(item[portlet.beginTimeField], portlet.timeFormat),
        moment(item[portlet.endTimeField], portlet.timeFormat),
        unit,
        '[]',
      ),
    );

    const linkTemplate = urlTemplate.parse(portlet.titleLink);
    return (
      <Popover
        placement="bottom"
        content={
          <List
            dataSource={matchData}
            renderItem={(item) => (
              <List.Item>
                <CalendarOutlined />
                <Divider type="vertical" />
                <a href={linkTemplate.expand(item)} target="_blank">
                  {item[portlet.titleField]}
                </a>
              </List.Item>
            )}
          />
        }
      >
        <Badge count={matchData.length} />
      </Popover>
    );
  }

  get portletService(): DomainService<MobxDomainStore> | null {
    return this.props.services.portletCalendarService;
  }

  /**
   * 加了onSelect={this.calSelect}后，点击popup中的链接后打开两个链接，应该是bug，先放到标题栏
   * @param date
   */
  calSelect = (date?: Moment) => {
    const { dateLink, timeFormat } = this.state.portlet;
    const linkTemplate = urlTemplate.parse(dateLink);

    window.open(linkTemplate.expand(date && { date: date.format(timeFormat) }), '_blank');
  };
}
