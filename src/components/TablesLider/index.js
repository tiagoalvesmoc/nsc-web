import React from 'react';


import { Table } from 'rsuite'

import 'rsuite/dist/styles/rsuite-default.css';
const { Column, HeaderCell, Cell, Pagination } = Table;



export default function TablesLider({ data }) {


    function capitalize(str) {
        if (typeof str !== 'string') {
            return '';
        }

        return `${str.charAt(0).toUpperCase()}${str.substring(1).toLowerCase()}`;
    }


    return (
        <>


        </>

    );
}