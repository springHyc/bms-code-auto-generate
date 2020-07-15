import React, { Component } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Route, Redirect, Link } from 'react-router-dom';
import MENUS from './menus.js';
import './App.less';

const { Header, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const avater = '//img.shurongdai.cn/group1/M00/00/0C/wKgX2FrNcZKAa92mAAAI-XyxqgY410.jpg';
export default class Layouts extends Component {
    constructor(props) {
        super(props);

        const _state = this.getDefaultKeys();
        this.state = {
            current: [MENUS[0]],
            collapsed: false,
            openKeys: [MENUS[0].path],
            ..._state
        };
        this.defaultSelectedKeys = window.location.hash.split('#')[1] === '/' ? [MENUS[0].path] : [window.location.hash.split('#')[1]];
    }
    rootSubmenuKeys = MENUS.map((menu) => menu.path);

    getDefaultKeys = () => {
        this.defaultOpenKeys = [];
        const hashStr = window.location.hash.split('#')[1];
        if (hashStr.split('/').length > 2) {
            const openKeys = [`/${hashStr.split('/')[1]}`];
            this.defaultOpenKeys = openKeys;
            return { openKeys };
        }
        return { openKeys: [] };
    };

    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find((key) => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : []
            });
        }
    };
    getBreadcrumb = () => {
        let breadcrumbs = [];
        const hashStr = window.location.hash.split('#/')[1];
        const targetRoute = MENUS.filter((menu) => {
            if (menu.path.split('/')[1] === hashStr.split('/')[0]) {
                return menu;
            }
        })[0];
        if (!targetRoute) return breadcrumbs;
        breadcrumbs.push({ path: targetRoute.path, name: targetRoute.name });
        if (targetRoute.subset && targetRoute.subset.length > 0) {
            targetRoute.subset.forEach((item) => {
                if (item.path === '/' + hashStr) {
                    breadcrumbs.push({ path: item.path, name: item.name });
                    return breadcrumbs;
                }
            });
        }
        return breadcrumbs;
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    renderMenus() {
        return (
            <>
                <div className='br-logo'>
                    <HomeOutlined style={{ fontSize: 20 }} />
                </div>
                <Menu
                    theme='dark'
                    mode='horizontal'
                    defaultSelectedKeys={this.defaultSelectedKeys}
                    defaultOpenKeys={this.defaultOpenKeys}
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                >
                    {MENUS.map((route) => {
                        if (route.subset && route.subset.length > 0) {
                            return (
                                <SubMenu
                                    key={route.path}
                                    title={
                                        <span>
                                            {route.icon}
                                            <span>{route.name}</span>
                                        </span>
                                    }
                                >
                                    {route.subset.map((item) => (
                                        <Menu.Item key={item.path}>
                                            <Link to={item.path}>
                                                {route.icon}
                                                <span>{item.name}</span>
                                            </Link>
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            );
                        }
                        return (
                            <Menu.Item key={route.path}>
                                <Link to={route.path}>
                                    {route.icon}
                                    <span>{route.name}</span>
                                </Link>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </>
        );
    }

    renderHeader() {
        return (
            <Header className='hyc-header'>
                {this.renderMenus()}

                <Menu mode='horizontal' theme='dark' onClick={this.menuClick} style={{ marginLeft: 'auto' }}>
                    <SubMenu
                        title={
                            <span className='br-avatar'>
                                <img src={avater} alt='头像' />
                                yignchun.he
                            </span>
                        }
                    >
                        <MenuItemGroup>
                            <Menu.Item key='logout'>
                                <span>退出登录</span>
                            </Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                </Menu>
            </Header>
        );
    }
    render() {
        return (
            <Layout className='hyc-layout'>
                {this.renderHeader()}
                <Content className='site-layout' style={{ marginTop: 64 }}>
                    <Breadcrumb style={{ margin: '16px ' }}>
                        {this.getBreadcrumb().map((item, index) => (
                            <Breadcrumb.Item key={index}>
                                <Link to={item.path}>{item.name}</Link>
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                    <div className='site-layout-background' style={{ minHeight: 'calc(100vh - 188px)' }}>
                        {MENUS.map((item) => {
                            if (item.subset && item.subset.length > 0) {
                                return item.subset.map((sub) => (
                                    <Route exact key={sub.path} path={sub.path} render={(props) => <sub.component {...props} />} />
                                ));
                            } else {
                                return <Route exact key={item.path} path={item.path} render={(props) => <item.component {...props} />} />;
                            }
                        })}
                        <Route
                            path='/'
                            render={() => (
                                <Redirect
                                    to={
                                        window.location.hash.split('#')[1] === '/'
                                            ? this.state.current[0].path
                                            : window.location.hash.split('#')[1]
                                    }
                                />
                            )}
                        />
                    </div>
                </Content>
                <Footer>贺贺 版权所有 | 采用默认主题的后台管理系统页面自动生成工具 | 基于 React+Antd 构建©2020 | 托管于GitHub</Footer>
                {/* </Layout> */}
            </Layout>
        );
    }
}
