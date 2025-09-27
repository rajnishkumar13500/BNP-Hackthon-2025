
import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

function Result() {
  const { datas } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pageGroupSize = 10;

  const totalPages = Math.ceil(datas.length / itemsPerPage);

  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const groupStartPage = currentGroup * pageGroupSize + 1;
  const groupEndPage = Math.min(groupStartPage + pageGroupSize - 1, totalPages);

  const currentData = datas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [datas]);

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    const keys = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(keys.join(","));
    data.forEach((row) => {
      const values = keys.map((k) => {
        let val = row[k];
        if (typeof val === "string") {
          val = val.replace(/"/g, '""');
          if (val.search(/("|,|\n)/g) >= 0) {
            val = `"${val}"`;
          }
        }
        return val;
      });
      csvRows.push(values.join(","));
    });
    return csvRows.join("\n");
  };

  const downloadCSV = () => {
    const csvString = convertToCSV(currentData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `result_page_${currentPage}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 min-h-screen flex flex-col bg-gray-900 text-gray-200">
      <h2 className="text-2xl font-bold mb-6">Result Page</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto mb-4 flex-grow rounded border border-gray-700">
        <table className="min-w-full border-collapse border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {datas[0] &&
                Object.keys(datas[0]).map((key) => (
                  <th
                    key={key}
                    className="py-2 px-4 border border-gray-700 text-left"
                  >
                    {key.toUpperCase()}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}
              >
                {Object.values(row).map((val, i) => (
                  <td key={i} className="py-2 px-4 border border-gray-700">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-auto">
        <div className="flex space-x-2 items-center flex-wrap">
          {Array.from(
            { length: groupEndPage - groupStartPage + 1 },
            (_, i) => groupStartPage + i
          ).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex space-x-2 items-center">
          <button
            onClick={() => handlePageChange(groupStartPage - 1)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
            disabled={groupStartPage === 1}
            aria-label="Previous group"
          >
            &lt;
          </button>

          <button
            onClick={() => handlePageChange(groupEndPage + 1)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
            disabled={groupEndPage === totalPages}
            aria-label="Next group"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
