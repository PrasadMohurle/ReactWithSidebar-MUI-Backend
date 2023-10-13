import React, { useEffect, useState } from 'react';
import mundra from '../excelsheets/mundra.xlsx';
import schedule from '../excelsheets/Schedule_Main_Pipeline.xlsx';
import awaDrop from '../excelsheets/awaDrop.xlsx';

import * as xlsx from 'xlsx';
const ExcelJS = require('exceljs');

const Schedule = () => {
    // jsondata1 is mundras state variable
    // jsondata2 is schedule pipeline state variable
    // jsondata3 is awas state variable
    const [jsondata1, setJsondata1] = useState([]);
    const [jsondata2, setJsondata2] = useState([]);
    const [jsondata3, setJsondata3] = useState([]);

    //reading mundra excel sheet and converting it into json
    async function readFile1() {
        const file = await fetch(mundra);
        let data = await file.arrayBuffer();
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Convert worksheet data to JSON and update state
        setJsondata1(xlsx.utils.sheet_to_json(worksheet));
    }

    //reading schedule pipeline excel sheet and converting it into json
    async function readFile2() {
        const file = await fetch(schedule);
        let data = await file.arrayBuffer();
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Convert worksheet data to JSON and update state
        setJsondata2(xlsx.utils.sheet_to_json(worksheet));
    }

    //reading awa drop excel sheet and converting it into json
    async function readFile3() {
        const file = await fetch(awaDrop);
        let data = await file.arrayBuffer();
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        setJsondata3(xlsx.utils.sheet_to_json(worksheet));
    }

    useEffect(() => {
        readFile1();
        readFile2();
        readFile3();
    }, []);

    function exportToExcel() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // TABLE HEADER FOR SCHEDULE PIPELINE REPORT TABLE, BUT THERE IS ALSO USE OF THIS IN MUNDRA AND AWA TABLES FOR SPACING BETWEEN TABLES.
        const headers = [
            { headVal: 'VAD', key: 'VAD' },
            { headVal: 'PAL', key: 'PAL' },
            { headVal: 'AWA', key: 'AWA' },
            { headVal: 'AJM', key: 'AJM' },
            { headVal: 'JAI', key: 'JAI' },
            { headVal: 'REW', key: 'REW' },
            { headVal: 'BAH', key: 'BAH' },
            { headVal: 'TOP', key: 'TERMINAL_CODE' },
            { headVal: 'PRD', key: 'PRODUCT_CODE' },
            { headVal: 'VOL(in KL)', key: 'QUANTITY_VAL' },
        ];

        // CURRENT COLUMN AND ROW VALUE IN EXCEL FOR POSITIONING OF TABLES
        let currentRow = 2;
        let currentColumn = 5;

        //_________CODE FOR MUNDRA TABLES_________

        // FETCHING UNIQUE DAY FROM MUNDRA DATA AND STORING IT IN DAYS
        let uniqueDays = new Set(jsondata1.map((row) => row.SCHEDULE_DAY));
        const days = Array.from(uniqueDays);

        // FILTERING THE DATA AND STORING IT IN FILTEREDDATA VARIABLE IF row.SCHEDULE_DAY IS EQUAL TO EACH DAY IN DAYS
        days.forEach((day, dayIndex) => {
            const filteredData = jsondata1.filter(
                (row) => row.SCHEDULE_DAY === day
            );

            if (filteredData.length > 0) {
                // ADDING HEADERS FOR THIS TABLE
                filteredData.forEach((row, index) => {
                    const cell = worksheet.getCell(
                        currentRow,
                        currentColumn + index
                    );
                    cell.value = row.PRODUCT_CODE;
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'd69b33' },
                    };
                });
                currentRow++;

                // ADDING ROWS IN THE TABLE
                filteredData.forEach((row, index) => {
                    const cell = worksheet.getCell(
                        currentRow,
                        currentColumn + index
                    );
                    cell.value = row.QUANTITY;
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'd69b33' },
                    };
                });

                if (dayIndex !== days.length - 1) {
                    currentColumn += headers.length + 2; //ADDING COLUM SPACING AFTER EACH TABLE , USING THE HEADERS VARIABLE LENGTH
                    currentRow = 2; // RESETTING THE ROWS VARIABLE TO START A NEW TABLE
                }
            }
        });

        //_________CODE FOR MUNDRA TABLES END_________

        //_________CODE FOR SCHEDULE PIPELINE REPORT TABLES _________

        // FETCHING UNIQUE DAY FROM SCHEDULE PIPELINE DATA AND STORING IT IN DAYS
        let uniqueDays2 = new Set(jsondata2.map((row) => row.SCHEDULE_DAY));
        const days2 = Array.from(uniqueDays2);
        currentRow = 2; //UPDATING CURRENT ROW VALUE
        currentColumn = 5; //UPDATING CURRENT COLUMN VALUE

        // FILTERING THE DATA AND STORING IT IN FILTEREDDATA VARIABLE IF row.SCHEDULE_DAY IS EQUAL TO EACH DAY IN DAYS
        days2.forEach((day, dayIndex) => {
            const filteredData = jsondata2.filter(
                (row) => row.SCHEDULE_DAY === day
            );

            if (filteredData.length > 0) {
                currentRow += 3; //this is the gap between the table and day variable

                // ADDING HEADERS FOR THIS TABLE
                headers.forEach((header, index) => {
                    const cell = worksheet.getCell(
                        currentRow,
                        currentColumn + index
                    );
                    cell.value = header.headVal;
                    cell.font = { bold: true };
                });

                currentRow++; //INCREMENTING ROW TO ADD NEXT LINE OF ROW ENTRY

                // ADDING ROWS
                filteredData.forEach((row) => {
                    headers.forEach((header, index) => {
                        const key = header.key;
                        const cell = worksheet.getCell(
                            currentRow,
                            currentColumn + index
                        );
                        cell.value = row[key];

                        if (
                            key === 'PAL' ||
                            key === 'AWA' ||
                            key === 'AJM' ||
                            key === 'JAI' ||
                            key === 'REW' ||
                            key === 'BAH' ||
                            key === 'VAD'
                        ) {
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFADD8E6' },
                            };
                        }
                    });
                    currentRow++;
                });

                if (dayIndex !== days.length - 1) {
                    currentColumn += headers.length + 2; //ADDING COLUM SPACING AFTER EACH TABLE , USING THE HEADERS VARIABLE LENGTH
                    currentRow = 2; // RESETTING THE ROWS VARIABLE TO START A NEW TABLE
                }
            }
        });

        //_________CODE FOR SCHEDULE PIPELINE REPORT TABLES  END_________

        //_________CODE FOR AWA REPORT TABLES  _________

        // FETCHING UNIQUE DAY FROM AWA DATA AND STORING IT IN DAYS
        let uniqueDays3 = new Set(jsondata3.map((row) => row.SCHEDULE_DATE));
        const days3 = Array.from(uniqueDays3);
        console.log(days3);
        currentRow = 35; //NEED TO MAKE CHANGES IN THIS HARDCODED ROW VALUE IN EXCEL
        currentColumn = 5;

        // FILTERING THE DATA AND STORING IT IN FILTEREDDATA VARIABLE IF row.SCHEDULE_DAY IS EQUAL TO EACH DAY IN DAYS
        days3.forEach((day, dayIndex) => {
            const filteredData = jsondata3.filter(
                (row) => row.SCHEDULE_DATE === day
            );

            if (filteredData.length > 0) {
                // ADDING HEADERS FOR THIS TABLE
                filteredData.forEach((row, index) => {
                    const cell = worksheet.getCell(
                        currentRow,
                        currentColumn + index
                    );
                    cell.value = row.PRODUCT_CODE;
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'd69b33' },
                    };
                });
                currentRow++; //INCREMENTING ROW TO ADD NEXT LINE OF ROW ENTRY

                // ADDING ROWS
                filteredData.forEach((row, index) => {
                    console.log('row:', JSON.stringify(row));

                    const cell = worksheet.getCell(
                        currentRow,
                        currentColumn + index
                    );
                    cell.value = row.QUANTITY;
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'd69b33' },
                    };
                });

                if (dayIndex !== days3.length - 1) {
                    currentColumn += headers.length + 2; //ADDING COLUM SPACING AFTER EACH TABLE , USING THE HEADERS VARIABLE LENGTH
                    currentRow = 35; // SETTING THE ROWS VARIABLE TO START A NEW TABLE FROM THE SAME ROW AS PREVIOUS TABLE
                }
            }
        });
        //_________CODE FOR AWA REPORT TABLES  END_________

        // GENERATING THE EXCEL FILE
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'combined_data.xlsx');
            document.body.appendChild(link);
            link.click();
        });
    }

    return (
        <div>
            <h1>Schedule</h1>
            <button onClick={exportToExcel} className="btn btn-primary">
                Convert to Excel
            </button>
            <br />

            {/* DISPLAYING MUNDRA DATA  */}
            {jsondata1.length > 0 && (
                <div className="flex-container">
                    {Array.from(
                        new Set(jsondata1.map((row) => row.SCHEDULE_DAY))
                    ).map((day) => (
                        <div key={day} className="mt-4 table-container">
                            <table className="table">
                                <thead>
                                    {jsondata1
                                        .filter(
                                            (row) => row.SCHEDULE_DAY === day
                                        )
                                        .map((row) => (
                                            <th className="mudraCellfill">
                                                {row.PRODUCT_CODE}
                                            </th>
                                        ))}
                                </thead>
                                <tbody>
                                    {jsondata1
                                        .filter(
                                            (row) => row.SCHEDULE_DAY === day
                                        )
                                        .map((row) => (
                                            <td className="mudraCellfill">
                                                {row.QUANTITY}
                                            </td>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}

            {/* DISPLAYING SCHEDULED PIPELINE DATA */}
            {jsondata2.length > 0 && (
                <div className="flex-container">
                    {Array.from(
                        new Set(jsondata2.map((row) => row.SCHEDULE_DAY))
                    ).map((day) => (
                        <div key={day} className="mt-4 table-container">
                            <h6>Day {day}</h6>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>TOP</th>
                                        <th>PRD</th>
                                        <th className="volume-tab">
                                            VOL(in KL)
                                        </th>
                                        <th>VAD</th>
                                        <th>PAL</th>
                                        <th>AWA</th>
                                        <th>AJM</th>
                                        <th>JAI</th>
                                        <th>REW</th>
                                        <th>BAH</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jsondata2
                                        .filter(
                                            (row) => row.SCHEDULE_DAY === day
                                        )
                                        .map((row) => (
                                            <tr>
                                                <td>{row.TERMINAL_CODE}</td>
                                                <td>{row.PRODUCT_CODE}</td>
                                                <td>{row.QUANTITY_VAL}</td>
                                                <td className="bluebg">
                                                    {row.VAD}
                                                </td>
                                                <td className="bluebg">
                                                    {row.PAL}
                                                </td>
                                                <td className="bluebg">
                                                    {row.AWA}
                                                </td>
                                                <td className="bluebg">
                                                    {row.AJM}
                                                </td>
                                                <td className="bluebg">
                                                    {row.JAI}
                                                </td>
                                                <td className="bluebg">
                                                    {row.REW}
                                                </td>
                                                <td className="bluebg">
                                                    {row.BAH}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}

            {/* DISPLAYING AWA DROP DATA */}
            {jsondata3.length > 0 && (
                <div className="flex-container">
                    {Array.from(
                        new Set(jsondata3.map((row) => row.SCHEDULE_DATE))
                    ).map((day) => (
                        <div key={day} className="mt-4 table-container">
                            <table className="table">
                                <thead>
                                    {jsondata3
                                        .filter(
                                            (row) => row.SCHEDULE_DATE === day
                                        )
                                        .map((row) => (
                                            <th className="mudraCellfill">
                                                {row.PRODUCT_CODE}
                                            </th>
                                        ))}
                                </thead>
                                <tbody>
                                    {jsondata3
                                        .filter(
                                            (row) => row.SCHEDULE_DATE === day
                                        )
                                        .map((row) => (
                                            <td className="mudraCellfill">
                                                {row.QUANTITY}
                                            </td>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Schedule;
