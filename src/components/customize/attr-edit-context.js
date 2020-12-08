import React from 'react';
import ComponentAttrsConfig from './componentAttrsConfig';
import TableColumnsConfig from './table-columns-config';

/**
 * 可编辑区域，配置区域
 *
 * @export
 * @param {*} { selectedNode, update, areas }
 * @returns
 */
export default function AttrEditContext({ selectedNode, update, areas }) {
    return (
        <div className='edit-wrapper'>
            <h2>组件属性配置</h2>
            {selectedNode && selectedNode.area !== 'area-table' && (
                <ComponentAttrsConfig
                    node={selectedNode.node}
                    updateSelectedNode={(node) => {
                        const newAreas = areas;
                        const tasks = newAreas[selectedNode.area].tasks;
                        newAreas[selectedNode.area].tasks = tasks.map((item) => {
                            if (item.id === node.id) {
                                item = node;
                            }
                            return item;
                        });
                        update(newAreas);
                    }}
                />
            )}
            {selectedNode && selectedNode.area === 'area-table' && (
                <TableColumnsConfig
                    node={selectedNode.node}
                    updateSelectedNode={(node) => {
                        const newAreas = areas;
                        const tasks = newAreas[selectedNode.area].tasks;
                        newAreas[selectedNode.area].tasks = tasks.map((item) => {
                            if (item.id === node.id) {
                                item = node;
                            }
                            return item;
                        });
                        update(newAreas);
                    }}
                />
            )}
        </div>
    );
}
