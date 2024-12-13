import { useState, useEffect } from "react";
import Table from "./Components/Table";

interface ExpenseInformation {
  id: number;
  date: string;
  amount: string;
  merchant: string;
  category: string;
}

interface PageData {
  page: number;
  limit: number;
}

interface PaginationInformation {
  currentPage: number;
  next: PageData | null;
  previous: PageData | null;
  totalPages: number;
}

function App() {
  //|useState and useEffect|///////////////////////////////////////////

  const [expenseData, setExpenseData] = useState<ExpenseInformation[] | null>(
    null
  );

  const [updatePage, setUpdatePage] = useState<boolean>(true);
  const [buttonArray, setButtonArray] = useState<number[]>([1]);

  const [paginationData, setPaginationData] = useState<PaginationInformation>({
    currentPage: 1,
    next: null,
    previous: null,
    totalPages: 1,
  });

  const [userPrompt, setUserPrompt] = useState<string>("Data Loading...");

  useEffect(() => {
    // fetch the data and process it

    fetchExpenseData();
  }, [updatePage]);

  //|Constant values|///////////////////////////////////////////

  const expenseHeader: string[] = [
    "ID",
    "Date",
    "Amount",
    "Merchant",
    "Category",
  ];

  // const expenseDataDummy: ExpenseInformation[] | null = [
  //   {
  //     id: 1,
  //     date: "08:03 - 16/10/2024",
  //     amount: "£80.43",
  //     merchant: "Sports Direct",
  //     category: "lifestyle",
  //   },
  //   {
  //     id: 2,
  //     date: "08:03 - 16/10/2024",
  //     amount: "£80.43",
  //     merchant: "Sports Direct",
  //     category: "lifestyle",
  //   },
  // ];

  //|Functions|///////////////////////////////////////////
  const fetchExpenseData = async (): Promise<void> => {
    try {
      // get data from the api (1 page only)
      const response = await fetch(
        `https://tip-transactions.vercel.app/api/transactions?page=${paginationData.currentPage}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      if (data.transactions && data.transactions.length > 0) {
        // update pagination data
        const tmpPaginationData = {
          currentPage: data.currentPage,
          next: data.next ? data.next : null,
          previous: data.previous ? data.previous : null,
          totalPages: data.totalPages,
        };
        setPaginationData(tmpPaginationData);
        setButtonArray(
          Array.from({ length: data.totalPages }, (_, i) => i + 1)
        );
        // Process the data and format it to the required format if available

        const resultArray: ExpenseInformation[] = data.transactions.map(
          (transaction: T) => ({
            id: transaction.id,
            date: formatDate(transaction.date), // Convert to string format
            amount: `£${transaction.amount.toFixed(2)}`, // Convert to string format with 2 sig fig
            merchant: transaction.merchant,
            category:
              transaction.category.charAt(0).toUpperCase() +
              transaction.category.slice(1),
          })
        );

        // console.log(resultArray)

        setExpenseData(resultArray);
      } else {
        // no data retrieved from api
        setUserPrompt("No data found");
      }
      setUpdatePage(false);
    } catch (error) {
      // Handle errors hereee
      console.error("Error fetching data:", error);
      setUserPrompt("Error fetching data. Please try again later.");
    }
  };

  function formatDate(date: string): string {
    const dateObj = new Date(date);
    const hr = dateObj.getUTCHours().toString().padStart(2, "0");
    const min = dateObj.getUTCMinutes().toString().padStart(2, "0");

    const dd = dateObj.getDate().toString().padStart(2, "0");
    const mm = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${hr}:${min} - ${dd}/${mm}/${yyyy}`;
  }

  const handleFirst = () => {
    setUpdatePage(true);
    setPaginationData({
      ...paginationData,
      currentPage: 1,
    });
  };

  const handleLast = () => {
    setUpdatePage(true);
    setPaginationData({
      ...paginationData,
      currentPage: paginationData.totalPages,
    });
  };

  const handleDynamic = (newPage: number) => {
    setUpdatePage(true);
    setPaginationData({
      ...paginationData,
      currentPage: newPage,
    });
  };

  //|Rendering|///////////////////////////////////////////

  // only render table if data is available and the length is more than 0

  return (
    <div id="template-text">
      <h2 className="centered-header">Expenses</h2>
      {expenseData?.length > 0 ? (
        <Table headers={expenseHeader} data={expenseData} />
      ) : (
        <p>{userPrompt}</p>
      )}

      {paginationData.totalPages > 1 && (
        <div>
          <button className="button-text-only" onClick={handleFirst}>
            First
          </button>

          {buttonArray.map((value, index) => (
            <button key={index} onClick={() => handleDynamic(value)}>
              {index + 1}
            </button>
          ))}

          <button className="button-text-only" onClick={handleLast}>
            Last
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
