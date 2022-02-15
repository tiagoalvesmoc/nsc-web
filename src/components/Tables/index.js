import React from 'react';


import { Table } from 'rsuite'

import 'rsuite/dist/styles/rsuite-default.css';
const { Column, HeaderCell, Cell, Pagination } = Table;



export default function Tables({ data, config, action, content, onRowClick, loading }) {


    function capitalize(str) {
        if (typeof str !== 'string') {
            return '';
        }

        return `${str.charAt(0).toUpperCase()}${str.substring(1).toLowerCase()}`;
    }


    return (
        <>

            <Table

                loading={loading}
                height={400}
                data={data}
                onRowClick={data => {
                    onRowClick(data);
                }}
            >

                {config.map((c) => (
                    <Column width={c.width} flexGrow={!c.width ? 1 : 0} fixed={c.fixed}>
                        <HeaderCell>{


                            capitalize(c.label)

                        }</HeaderCell>

                        {!c.content ? (
                            <Cell dataKey={c.key} />


                        )
                            :

                            <Cell  > {(item) => c.content(item)}</Cell>
                        }

                    </Column>
                ))}





                <Column width={150} fixed="right">
                    <HeaderCell>Ações</HeaderCell>
                    <Cell >
                        {(item) => action(item)}

                    </Cell>
                </Column>




                {/* <Column width={120} fixed="right">
                    <HeaderCell>Action</HeaderCell>

                    <Cell>
                        {rowData => {
                            function handleAction() {
                                alert(`id:${rowData.id}`);
                            }
                            return (
                                <span>
                                    <a onClick={handleAction}> Edit </a> |{' '}
                                    <a onClick={handleAction}> Remove </a>
                                </span>
                            );
                        }}
                    </Cell>
                </Column> */}
            </Table>
        </>

    );
}