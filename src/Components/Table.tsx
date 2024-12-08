import "./Table.css";
type TableProps = {
  headers: string[];
  data: T[] | null;
};

// generically receives the header names and the data

const Table = ({ headers, data }: TableProps) => {
  //   console.log(headers);
  //   console.log(data);
  return (
    <div>
      <table className="tipalti-table-style">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.entries(item).map(([key, value]) => {
                return <td key={key}>{value}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

// table expense dummy data
// {"id":1,
// "date":"2024-10-16T08:03:00.214Z",
// "amount":80.43,
// "merchant":"Sports Direct",
// "category":"lifestyle"
// }
