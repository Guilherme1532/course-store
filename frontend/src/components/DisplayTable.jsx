import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";


const DisplayTable = ({data, columns}) => {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
  return (
    <div className="p-2 text-black">
        <table className="w-full">
            <thead className="bg-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border text-orange-600 border-slate-600 p-1"
                    >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody className="bg-white">
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-600">
                {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border text-center border-slate-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  );
};

export default DisplayTable;
