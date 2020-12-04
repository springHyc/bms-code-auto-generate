import { Button, Dropdown, Menu } from 'antd';
import React from 'react';

export default function WrapperDelete(props) {
    const { visible, deleteTask } = props;
    return (
        <Dropdown
            trigger={['contextMenu']}
            visible={visible}
            overlay={
                <Menu>
                    <Menu.Item>
                        <Button onClick={deleteTask} type='link'>
                            删除
                        </Button>
                    </Menu.Item>
                </Menu>
            }
        >
            {props.children}
        </Dropdown>
    );
}
